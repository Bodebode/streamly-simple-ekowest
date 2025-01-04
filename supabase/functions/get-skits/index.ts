import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const MOCK_VIDEOS = [
  {
    id: "skit1",
    title: "Funny Skit",
    image: "https://i.ytimg.com/vi/skit1/maxresdefault.jpg",
    category: "Skits",
    videoId: "skit1"
  },
  {
    id: "skit2",
    title: "Comedy Skit",
    image: "https://i.ytimg.com/vi/skit2/maxresdefault.jpg",
    category: "Skits",
    videoId: "skit2"
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Fetching skits...')
    const API_KEY = Deno.env.get('YOUTUBE_API_KEY')

    if (!API_KEY) {
      console.log('Using mock data (no API key)')
      return new Response(JSON.stringify(MOCK_VIDEOS), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { min_length = 0, max_length = 42 } = await req.json()
    console.log('Fetching skits with parameters:', { min_length, max_length })

    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=nollywood+skit+comedy&type=video&order=date&maxResults=50&key=${API_KEY}`
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
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    )
    
    if (!videoResponse.ok) {
      const error = await videoResponse.text()
      console.error('YouTube API error when fetching video details:', error)
      throw new Error(`YouTube API error: ${error}`)
    }

    const videoData = await videoResponse.json()

    const videos = videoData.items
      .filter((video: any) => {
        const viewCount = parseInt(video.statistics.viewCount || '0')
        const durationMinutes = convertDurationToMinutes(video.contentDetails.duration)
        return viewCount >= 10000 && durationMinutes <= max_length && durationMinutes >= min_length
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

    console.log(`Returning ${videos.length} filtered videos`)

    return new Response(JSON.stringify(videos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in get-skits function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch videos from YouTube' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

const convertDurationToMinutes = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  
  return hours * 60 + minutes + Math.ceil(seconds / 60)
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
