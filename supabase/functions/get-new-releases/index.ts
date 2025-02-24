import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const BASE_URL = 'https://www.googleapis.com/youtube/v3'
const MIN_DURATION_SECONDS = 150 // 2 minutes and 30 seconds

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

const truncateTitle = (title: string): string => {
  const separatorIndex = title.search(/[-|(]/)
  if (separatorIndex !== -1) {
    return title.substring(0, separatorIndex).trim()
  }
  return title
}

// Convert ISO 8601 duration to seconds
const parseDuration = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  const hours = parseInt(match?.[1] || '0')
  const minutes = parseInt(match?.[2] || '0')
  const seconds = parseInt(match?.[3] || '0')
  return hours * 3600 + minutes * 60 + seconds
}

serve(async (req) => {
  console.log('Processing request to get-new-releases function')
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // First check cache
    console.log('Checking cache for new releases')
    const { data: cachedVideos, error: cacheError } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'New Release')
      .gt('expires_at', new Date().toISOString())
      .gte('duration', MIN_DURATION_SECONDS)
      .limit(12)

    if (cacheError) {
      console.error('Error fetching from cache:', cacheError)
    }

    if (cachedVideos && cachedVideos.length > 0) {
      console.log('Returning cached new releases:', cachedVideos.length)
      return new Response(JSON.stringify(cachedVideos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // If cache miss, check for expired cache as fallback
    const { data: expiredCache } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'New Release')
      .lt('expires_at', new Date().toISOString())
      .gte('duration', MIN_DURATION_SECONDS)
      .order('cached_at', { ascending: false })
      .limit(12)

    try {
      if (!API_KEY) {
        console.error('YouTube API key not found')
        throw new Error('YouTube API key not configured')
      }

      // Search for Nollywood movies
      console.log('Fetching new releases from YouTube API')
      const searchResponse = await fetch(
        `${BASE_URL}/search?part=snippet&q=nollywood+full+movie&type=video&order=date&maxResults=50&key=${API_KEY}`
      )
      
      if (!searchResponse.ok) {
        console.error('YouTube search API error:', await searchResponse.text())
        throw new Error('Failed to fetch from YouTube API')
      }

      const searchData = await searchResponse.json()

      if (!searchData.items || searchData.items.length === 0) {
        console.log('No videos found in YouTube search, using expired cache')
        return new Response(JSON.stringify(expiredCache || []), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Get video IDs
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')

      // Get detailed video information including contentDetails for duration
      console.log('Fetching video details')
      const videoResponse = await fetch(
        `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
      )

      if (!videoResponse.ok) {
        console.error('YouTube videos API error:', await videoResponse.text())
        throw new Error('Failed to fetch video details')
      }

      const videoData = await videoResponse.json()

      // Transform and filter videos
      const videos = videoData.items
        .filter((video: any) => {
          const duration = parseDuration(video.contentDetails.duration)
          return duration >= MIN_DURATION_SECONDS
        })
        .slice(0, 12)
        .map((video: any) => ({
          id: video.id,
          title: truncateTitle(video.snippet.title),
          image: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
          category: "New Release",
          video_id: video.id,
          views: parseInt(video.statistics.viewCount),
          comments: parseInt(video.statistics.commentCount),
          duration: parseDuration(video.contentDetails.duration),
          cached_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        }))

      // Cache the results
      if (videos.length > 0) {
        console.log('Caching new videos:', videos.length)
        const { error: insertError } = await supabase
          .from('cached_videos')
          .upsert(videos)

        if (insertError) {
          console.error('Error caching videos:', insertError)
        }
      }

      return new Response(JSON.stringify(videos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Error fetching from YouTube:', error)
      if (expiredCache && expiredCache.length > 0) {
        console.log('Returning expired cache as fallback')
        return new Response(JSON.stringify(expiredCache), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      throw error
    }
  } catch (error) {
    console.error('Error in get-new-releases function:', error)
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})