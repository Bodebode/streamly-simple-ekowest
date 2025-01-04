import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const truncateTitle = (title: string): string => {
  const separatorIndex = title.search(/[-|(#]/)
  let processedTitle = separatorIndex !== -1 
    ? title.substring(0, separatorIndex).trim()
    : title.trim()
  
  const words = processedTitle.split(' ')
  processedTitle = words.slice(0, Math.min(3, words.length)).join(' ')
  
  return processedTitle
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

    console.log('Fetching skits...')
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&q=nollywood+comedy+skit&type=video&order=date&maxResults=50&key=${API_KEY}`
    )
    
    if (!searchResponse.ok) {
      console.error('YouTube API search error:', await searchResponse.text())
      return new Response(
        JSON.stringify({ error: 'Failed to fetch videos from YouTube' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const searchData = await searchResponse.json()
    console.log(`Found ${searchData.items?.length || 0} initial videos`)

    if (!searchData.items || searchData.items.length === 0) {
      return new Response(
        JSON.stringify([]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const playableVideos = await Promise.all(
      searchData.items.map(async (video: any) => {
        const videoId = video.id.videoId
        const isPlayable = await checkVideoPlayability(videoId)
        
        if (!isPlayable) {
          console.log(`Video ${videoId} is not embeddable, skipping`)
          return null
        }

        return {
          id: videoId,
          title: truncateTitle(video.snippet.title),
          image: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
          category: "Skits",
          videoId: videoId,
        }
      })
    )

    const videos = playableVideos
      .filter(video => video !== null)
      .slice(0, 12)

    console.log(`Returning ${videos.length} videos`)

    return new Response(JSON.stringify(videos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})