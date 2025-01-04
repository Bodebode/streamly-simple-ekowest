import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const MOCK_VIDEOS = [
  {
    id: "xyz123",
    title: "New Nollywood Release",
    image: "https://i.ytimg.com/vi/xyz123/maxresdefault.jpg",
    category: "New Release",
    videoId: "xyz123"
  },
  {
    id: "abc456",
    title: "Latest Nigerian Movie",
    image: "https://i.ytimg.com/vi/abc456/maxresdefault.jpg",
    category: "New Release",
    videoId: "abc456"
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Fetching new releases...')
    const API_KEY = Deno.env.get('YOUTUBE_API_KEY')

    if (!API_KEY) {
      console.log('Using mock data (no API key)')
      return new Response(JSON.stringify(MOCK_VIDEOS), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

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
    console.error('Error:', error)
    console.log('Falling back to mock data due to error')
    return new Response(JSON.stringify(MOCK_VIDEOS), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
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
  const separatorIndex = title.search(/[-|(]/)
  if (separatorIndex !== -1) {
    return title.substring(0, separatorIndex).trim()
  }
  return title
}
