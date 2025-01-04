import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const truncateTitle = (title: string): string => {
  const separatorIndex = title.search(/[-|(]/)
  if (separatorIndex !== -1) {
    return title.substring(0, separatorIndex).trim()
  }
  return title
}

async function checkVideoPlayability(videoId: string): Promise<boolean> {
  try {
    const embedResponse = await fetch(
      `${BASE_URL}/videos?part=status&id=${videoId}&key=${API_KEY}`
    )
    const embedData = await embedResponse.json()
    
    if (!embedData.items || embedData.items.length === 0) return false
    
    return embedData.items[0].status.embeddable === true
  } catch (error) {
    console.error('Error checking video playability:', error)
    return false
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!API_KEY) {
      throw new Error('YouTube API key not configured')
    }

    console.log('Fetching highly rated videos...')
    const url = `${BASE_URL}/search?part=snippet&maxResults=50&q=Nollywood&type=video&key=${API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('YouTube API error:', await response.text())
      return new Response(
        JSON.stringify({ error: 'Failed to fetch videos from YouTube' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const data = await response.json()
    console.log(`Found ${data.items?.length || 0} initial videos`)

    if (!data.items || data.items.length === 0) {
      return new Response(
        JSON.stringify([]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const videoDetailsPromises = data.items.map(async (video: any) => {
      const videoId = video.id.videoId
      
      const isPlayable = await checkVideoPlayability(videoId)
      if (!isPlayable) {
        console.log(`Video ${videoId} is not embeddable, skipping`)
        return null
      }

      const detailsResponse = await fetch(
        `${BASE_URL}/videos?part=statistics,contentDetails&id=${videoId}&key=${API_KEY}`
      )
      
      if (!detailsResponse.ok) {
        console.error(`Failed to fetch details for video ${videoId}`)
        return null
      }

      const detailsData = await detailsResponse.json()
      const videoDetails = detailsData.items?.[0]
      
      if (!videoDetails) {
        console.log(`No details found for video ${videoId}`)
        return null
      }

      return {
        id: videoId,
        title: truncateTitle(video.snippet.title),
        image: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
        category: "Highly Rated",
        videoId: videoId,
      }
    })

    const videos = (await Promise.all(videoDetailsPromises))
      .filter(video => video !== null)
      .slice(0, 10)

    console.log(`Returning ${videos.length} videos`)

    return new Response(JSON.stringify(videos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in get-highly-rated function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})