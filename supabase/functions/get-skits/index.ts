import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const API_KEY = Deno.env.get('YOUTUBE_API_KEY')
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

serve(async (req) => {
  console.log('Processing request to get-skits function')
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!API_KEY) {
      console.error('YouTube API key not configured')
      throw new Error('YouTube API key not configured')
    }

    // First check cache
    console.log('Checking cache for skits videos')
    const { data: cachedVideos, error: cacheError } = await supabaseAdmin
      .from('cached_videos')
      .select('*')
      .eq('category', 'Skits')
      .gt('expires_at', new Date().toISOString())
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

    // Search for Nollywood skits
    console.log('Fetching new skits from YouTube API')
    const searchUrl = `${BASE_URL}/search?part=snippet&q=nollywood+skit+comedy&type=video&maxResults=50&key=${API_KEY}`
    console.log('Search URL:', searchUrl)
    
    const searchResponse = await fetch(searchUrl)
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text()
      console.error('YouTube search API error:', errorText)
      throw new Error(`YouTube search API error: ${errorText}`)
    }

    const searchData = await searchResponse.json()

    if (!searchData.items || searchData.items.length === 0) {
      console.log('No videos found in YouTube search')
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get video IDs
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')

    // Get detailed video information
    console.log('Fetching video details')
    const videoUrl = `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    console.log('Video URL:', videoUrl)
    
    const videoResponse = await fetch(videoUrl)

    if (!videoResponse.ok) {
      const errorText = await videoResponse.text()
      console.error('YouTube videos API error:', errorText)
      throw new Error(`YouTube videos API error: ${errorText}`)
    }

    const videoData = await videoResponse.json()

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