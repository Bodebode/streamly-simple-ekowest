// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RelatedVideo {
  id: string;
  title: string;
  thumbnail: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { videoId } = await req.json()
    
    // Validate videoId
    if (!videoId || typeof videoId !== 'string') {
      console.error('Invalid or missing videoId:', videoId)
      throw new Error('Invalid video ID provided')
    }

    console.log('Fetching related videos for:', videoId)

    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
    if (!YOUTUBE_API_KEY) {
      console.error('YouTube API key not found')
      throw new Error('YouTube API key not configured')
    }

    const youtubeUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    youtubeUrl.searchParams.append('part', 'snippet')
    youtubeUrl.searchParams.append('relatedToVideoId', videoId)
    youtubeUrl.searchParams.append('type', 'video')
    youtubeUrl.searchParams.append('maxResults', '7')
    youtubeUrl.searchParams.append('key', YOUTUBE_API_KEY)

    const response = await fetch(youtubeUrl.toString())

    if (!response.ok) {
      const errorData = await response.json()
      console.error('YouTube API error:', errorData)
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('YouTube API response received')

    if (!data.items || !Array.isArray(data.items)) {
      console.error('Invalid response format:', data)
      throw new Error('Invalid response from YouTube API')
    }

    const relatedVideos: RelatedVideo[] = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.maxres?.url || 
                item.snippet.thumbnails.high?.url || 
                item.snippet.thumbnails.default.url,
    }))

    return new Response(JSON.stringify(relatedVideos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
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