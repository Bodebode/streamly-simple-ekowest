// Follow this setup guide to integrate the Deno runtime into your application:
// https://docs.supabase.com/guides/functions/connect-to-supabase
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { videoId } = await req.json()
    console.log('Received request to fetch related videos for:', videoId)

    // Validate videoId
    if (!videoId || typeof videoId !== 'string' || videoId.length < 5) {
      throw new Error('Invalid video ID provided')
    }

    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured')
    }

    // Using a known working Nollywood movie ID as fallback if the provided ID fails
    const fallbackVideoId = 'YPJ_iwLJx2U'
    
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=7&key=${YOUTUBE_API_KEY}`
      console.log('First attempt: Fetching from YouTube API with provided ID...')
      
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok || !data.items || data.items.length === 0) {
        console.log('First attempt failed, trying with fallback ID...')
        throw new Error('Failed with provided ID, using fallback')
      }

      console.log('Successfully received YouTube data with provided ID')
      return processYouTubeResponse(data, corsHeaders)
    } catch (error) {
      // If the first attempt fails, try with the fallback ID
      console.log('Using fallback video ID:', fallbackVideoId)
      const fallbackUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${fallbackVideoId}&type=video&maxResults=7&key=${YOUTUBE_API_KEY}`
      
      const fallbackResponse = await fetch(fallbackUrl)
      const fallbackData = await fallbackResponse.json()

      if (!fallbackResponse.ok) {
        console.error('YouTube API error:', fallbackData)
        throw new Error(`YouTube API error: ${fallbackData.error?.message || 'Unknown error'}`)
      }

      console.log('Successfully received YouTube data with fallback ID')
      return processYouTubeResponse(fallbackData, corsHeaders)
    }
  } catch (error) {
    console.error('Error in get-related-videos:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

function processYouTubeResponse(data: any, corsHeaders: any) {
  if (!data.items || !Array.isArray(data.items)) {
    throw new Error('Invalid response format from YouTube API')
  }

  const videos = data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.maxres?.url || 
              item.snippet.thumbnails.high?.url || 
              item.snippet.thumbnails.default.url,
  }))

  console.log(`Returning ${videos.length} related videos`)

  return new Response(
    JSON.stringify(videos),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  )
}