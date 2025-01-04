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
    if (!API_KEY) {
      console.error('YouTube API key is not configured')
      throw new Error('YouTube API key is not configured')
    }

    console.log('Fetching new releases...')
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&q=nollywood+full+movie&type=video&order=date&maxResults=50&key=${API_KEY}`
    )
    
    if (!searchResponse.ok) {
      const error = await searchResponse.text()
      console.error('YouTube API error:', error)
      throw new Error(`YouTube API error: ${error}`)
    }

    const searchData = await searchResponse.json()
    console.log(`Found ${searchData.items?.length || 0} initial videos`)

    if (!searchData.items || searchData.items.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')

    const videoResponse = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    )
    
    if (!videoResponse.ok) {
      const error = await videoResponse.text()
      console.error('YouTube API error when fetching video details:', error)
      throw new Error(`YouTube API error: ${error}`)
    }

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

    console.log(`Returning ${videos.length} filtered videos`)

    return new Response(JSON.stringify(videos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in get-new-releases function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch videos from YouTube' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})