import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!API_KEY) {
      throw new Error('YouTube API key not configured')
    }

    console.log('Fetching new releases...')
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&q=nollywood+movie+full&type=video&order=date&maxResults=50&key=${API_KEY}`
    )
    
    if (!searchResponse.ok) {
      console.error('YouTube API search error:', await searchResponse.text())
      throw new Error('Failed to fetch videos from YouTube')
    }

    const searchData = await searchResponse.json()
    console.log(`Found ${searchData.items?.length || 0} initial videos`)

    if (!searchData.items || searchData.items.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Filter out non-playable videos
    const playableVideos = await Promise.all(
      searchData.items.map(async (item: any) => {
        const isPlayable = await checkVideoPlayability(item.id.videoId)
        return isPlayable ? item : null
      })
    )

    const filteredVideos = playableVideos.filter(video => video !== null)
    console.log(`${filteredVideos.length} videos are playable`)

    if (filteredVideos.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get video details
    const videoIds = filteredVideos.map((item: any) => item.id.videoId).join(',')
    const videoResponse = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    )

    if (!videoResponse.ok) {
      console.error('YouTube API videos error:', await videoResponse.text())
      throw new Error('Failed to fetch video details')
    }

    const videoData = await videoResponse.json()

    const videos = videoData.items
      .slice(0, 12)
      .map((video: any) => ({
        id: video.id,
        title: truncateTitle(video.snippet.title),
        image: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
        category: "New Release",
        videoId: video.id,
      }))

    console.log(`Returning ${videos.length} videos`)

    return new Response(JSON.stringify(videos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})