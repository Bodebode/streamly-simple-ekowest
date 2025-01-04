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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { min_length = 0, max_length = 42, min_views = 4000 } = await req.json()
    console.log('Received parameters:', { min_length, max_length, min_views });

    // Search for Nollywood skits
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&q=nollywood+skit+comedy&type=video&order=viewCount&maxResults=50&key=${API_KEY}`
    )
    const searchData = await searchResponse.json()

    if (!searchData.items) {
      throw new Error('No videos found')
    }

    // Get video IDs
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')

    // Get detailed video information including statistics and contentDetails
    const videoResponse = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    )
    const videoData = await videoResponse.json()

    // Filter and transform videos
    const videos = videoData.items
      .filter((video: any) => {
        const viewCount = parseInt(video.statistics.viewCount || '0')
        const durationMinutes = convertDurationToMinutes(video.contentDetails.duration)
        return viewCount >= min_views && durationMinutes <= max_length && durationMinutes >= min_length
      })
      .slice(0, 12)
      .map((video: any) => {
        const videoId = video.id
        return {
          id: videoId,
          title: truncateTitle(video.snippet.title),
          image: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
          category: "Skits",
          videoId: videoId,
        }
      })

    console.log(`Found ${videos.length} skits matching criteria`)

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