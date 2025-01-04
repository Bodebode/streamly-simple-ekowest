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

const convertDurationToMinutes = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  
  return hours * 60 + minutes + Math.ceil(seconds / 60)
}

async function checkVideoPlayability(videoId: string): Promise<boolean> {
  try {
    const embedResponse = await fetch(
      `${BASE_URL}/videos?part=status&id=${videoId}&key=${API_KEY}`
    )
    const embedData = await embedResponse.json()
    
    if (!embedData.items || embedData.items.length === 0) return false
    
    // Check if video is embeddable
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
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&q=nollywood+full+movie&type=video&order=date&maxResults=50&key=${API_KEY}`
    )
    const searchData = await searchResponse.json()

    if (!searchData.items) {
      throw new Error('No videos found')
    }

    // Filter out non-playable videos first
    const playableVideos = await Promise.all(
      searchData.items.map(async (item: any) => {
        const isPlayable = await checkVideoPlayability(item.id.videoId)
        return isPlayable ? item : null
      })
    )

    // Get video IDs of playable videos
    const videoIds = playableVideos
      .filter(video => video !== null)
      .map((item: any) => item.id.videoId)
      .join(',')

    const videoResponse = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    )
    const videoData = await videoResponse.json()

    const videos = videoData.items
      .filter((video: any) => {
        const commentCount = parseInt(video.statistics.commentCount || '0')
        const durationMinutes = convertDurationToMinutes(video.contentDetails.duration)
        return commentCount >= 12 && durationMinutes >= 40
      })
      .slice(0, 12)
      .map((video: any) => {
        const videoId = video.id
        return {
          id: videoId,
          title: truncateTitle(video.snippet.title),
          image: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
          category: "New Release",
          videoId: videoId,
        }
      })

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