// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    console.log('Using API key starting with:', YOUTUBE_API_KEY.substring(0, 5) + '...')

    const youtubeUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    youtubeUrl.searchParams.append('part', 'snippet')
    youtubeUrl.searchParams.append('relatedToVideoId', videoId)
    youtubeUrl.searchParams.append('type', 'video')
    youtubeUrl.searchParams.append('maxResults', '7')
    youtubeUrl.searchParams.append('key', YOUTUBE_API_KEY)

    console.log('Making request to YouTube API:', youtubeUrl.toString().replace(YOUTUBE_API_KEY, 'REDACTED'))
    const response = await fetch(youtubeUrl.toString())
    const data = await response.json()

    if (!response.ok) {
      console.error('YouTube API error details:', JSON.stringify(data, null, 2))
      throw new Error(`YouTube API error: ${response.status} - ${data.error?.message || 'Unknown error'}`)
    }

    console.log('Successfully received YouTube API response')

    if (!data.items || !Array.isArray(data.items)) {
      console.error('Invalid response format:', data)
      throw new Error('Invalid response from YouTube API')
    }

    const relatedVideos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.maxres?.url || 
                item.snippet.thumbnails.high?.url || 
                item.snippet.thumbnails.default.url,
    }))

    console.log('Returning related videos:', relatedVideos.length)

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