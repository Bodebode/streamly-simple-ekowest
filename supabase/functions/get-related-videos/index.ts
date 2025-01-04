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
    // Using a popular Nollywood movie as seed (Battle on Buka Street)
    const seedVideoId = 'jFoQ4RLPXQs'
    console.log('Using seed video ID:', seedVideoId)

    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured')
    }

    // Construct the URL with proper encoding and required parameters
    const params = new URLSearchParams({
      part: 'snippet',
      relatedToVideoId: seedVideoId,
      type: 'video',
      maxResults: '10',
      key: YOUTUBE_API_KEY,
      regionCode: 'NG',
      relevanceLanguage: 'en',
      videoDuration: 'long'
    });

    const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
    console.log('Fetching from YouTube API with URL:', url)
    
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      console.error('YouTube API error response:', data)
      throw new Error(`YouTube API error: ${data.error?.message || JSON.stringify(data)}`)
    }

    if (!data.items || !Array.isArray(data.items)) {
      console.error('Invalid response format:', data)
      throw new Error('Invalid response format from YouTube API')
    }

    console.log(`Successfully received ${data.items.length} videos from YouTube API`)

    const videos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.maxres?.url || 
                item.snippet.thumbnails.high?.url || 
                item.snippet.thumbnails.default.url,
    }))

    console.log('Processed videos:', videos)

    return new Response(
      JSON.stringify(videos),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
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