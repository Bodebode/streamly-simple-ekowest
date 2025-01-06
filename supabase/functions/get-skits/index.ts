import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PRIMARY_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const SECONDARY_API_KEY = Deno.env.get('YOUTUBE_API_KEY_SECONDARY')
const BASE_URL = 'https://www.googleapis.com/youtube/v3'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables')
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const truncateTitle = (title: string): string => {
  const separatorIndex = title.search(/[-|(#]/)
  let processedTitle = separatorIndex !== -1 
    ? title.substring(0, separatorIndex).trim()
    : title.trim()
  
  const words = processedTitle.split(' ')
  processedTitle = words.slice(0, Math.min(3, words.length)).join(' ')
  
  return processedTitle
}

async function fetchFromYouTube(endpoint: string, apiKey: string) {
  const url = `${BASE_URL}${endpoint}&key=${apiKey}`
  console.log(`Fetching from YouTube API: ${url.replace(apiKey, 'REDACTED')}`)
  
  const response = await fetch(url)
  if (!response.ok) {
    const errorText = await response.text()
    console.error('YouTube API error:', errorText)
    
    // Check if it's a quota error
    if (errorText.includes('quota')) {
      throw new Error('QUOTA_EXCEEDED')
    }
    
    throw new Error(`YouTube API error: ${errorText}`)
  }
  
  return response.json()
}

async function tryFetchWithBackup(endpoint: string) {
  try {
    if (PRIMARY_API_KEY) {
      return await fetchFromYouTube(endpoint, PRIMARY_API_KEY)
    }
  } catch (error) {
    console.log('Error with primary key:', error.message)
    if (error.message === 'QUOTA_EXCEEDED' && SECONDARY_API_KEY) {
      console.log('Trying secondary API key')
      return await fetchFromYouTube(endpoint, SECONDARY_API_KEY)
    }
    throw error
  }
  
  throw new Error('No valid YouTube API key available')
}

serve(async (req) => {
  console.log('Processing request to get-skits function')
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // First check cache
    console.log('Checking cache for skits videos')
    const { data: cachedVideos, error: cacheError } = await supabaseAdmin
      .from('cached_videos')
      .select('*')
      .eq('category', 'Skits')
      .gt('expires_at', new Date().toISOString())
      .order('access_count', { ascending: false })
      .limit(12)

    if (cacheError) {
      console.error('Error fetching from cache:', cacheError)
    }

    if (cachedVideos && cachedVideos.length > 0) {
      console.log('Returning cached skits:', cachedVideos.length)
      return new Response(JSON.stringify(cachedVideos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // If cache miss, check for expired cache as fallback
    const { data: expiredCache } = await supabaseAdmin
      .from('cached_videos')
      .select('*')
      .eq('category', 'Skits')
      .lt('expires_at', new Date().toISOString())
      .order('cached_at', { ascending: false })
      .limit(12)

    try {
      // Search for Nollywood skits
      console.log('Fetching new skits from YouTube API')
      const searchData = await tryFetchWithBackup(
        '/search?part=snippet&q=nollywood+skit+comedy&type=video&maxResults=50'
      )

      if (!searchData.items || searchData.items.length === 0) {
        console.log('No videos found in YouTube search, using expired cache')
        return new Response(JSON.stringify(expiredCache || []), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Get video IDs
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')

      // Get detailed video information
      console.log('Fetching video details')
      const videoData = await tryFetchWithBackup(
        `/videos?part=snippet,statistics,contentDetails&id=${videoIds}`
      )

      // Transform videos
      const videos = videoData.items
        .slice(0, 12)
        .map((video: any) => ({
          id: video.id,
          title: truncateTitle(video.snippet.title),
          image: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
          category: "Skits",
          videoId: video.id,
          views: parseInt(video.statistics.viewCount),
          comments: parseInt(video.statistics.commentCount),
          cached_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        }))

      // Cache the results
      if (videos.length > 0) {
        console.log('Caching new videos:', videos.length)
        const { error: insertError } = await supabaseAdmin
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
    console.error('Error in get-skits function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})