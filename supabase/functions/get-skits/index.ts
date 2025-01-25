import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  console.log('Processing request to get-skits function')
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // First check cache
    console.log('Checking cache for skits')
    const { data: cachedVideos, error: cacheError } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'Skits')
      .eq('is_available', true)
      .gt('expires_at', new Date().toISOString())
      .order('access_count', { ascending: false })
      .limit(12)

    if (cacheError) {
      console.error('Error fetching from cache:', cacheError)
      throw cacheError
    }

    if (cachedVideos && cachedVideos.length > 0) {
      console.log('Returning cached skits:', cachedVideos.length)
      return new Response(JSON.stringify(cachedVideos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!API_KEY) {
      throw new Error('YouTube API key not configured')
    }

    // Search for Nigerian comedy skits with more specific parameters
    console.log('Fetching skits from YouTube API')
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&q=nigerian+comedy+skit+funny&type=video&maxResults=50&relevanceLanguage=en&videoDuration=short&key=${API_KEY}`
    )

    if (!searchResponse.ok) {
      throw new Error('Failed to fetch from YouTube API')
    }

    const searchData = await searchResponse.json()

    if (!searchData.items || searchData.items.length === 0) {
      console.error('No items returned from YouTube API')
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get video IDs
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')

    // Get detailed video information
    const videoResponse = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    )

    if (!videoResponse.ok) {
      throw new Error('Failed to fetch video details')
    }

    const videoData = await videoResponse.json()

    // Transform and filter videos
    const videos = videoData.items
      .slice(0, 12)
      .map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        image: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
        category: "Skits",
        video_id: video.id,
        views: parseInt(video.statistics.viewCount),
        comments: parseInt(video.statistics.commentCount),
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        is_available: true,
        last_availability_check: new Date().toISOString()
      }))

    // Cache the results
    if (videos.length > 0) {
      console.log('Caching new skits:', videos.length)
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
    console.error('Error in get-skits function:', error)
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})