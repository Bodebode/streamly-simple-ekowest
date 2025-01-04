import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

const MOCK_NEW_RELEASES = [
  {
    id: "new1",
    title: "Latest Release",
    image: "https://img.youtube.com/vi/pY4L5IXFXPA/maxresdefault.jpg",
    category: "New Release",
    videoId: "pY4L5IXFXPA"
  },
  {
    id: "new2",
    title: "Fresh Content",
    image: "https://img.youtube.com/vi/grDl2G_3WuY/maxresdefault.jpg",
    category: "New Release",
    videoId: "grDl2G_3WuY"
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&q=nollywood+full+movie&type=video&order=date&maxResults=50&key=${API_KEY}`
    )
    const searchData = await searchResponse.json()

    if (searchData.error) {
      console.error('YouTube API error:', JSON.stringify(searchData.error, null, 2))
      if (searchData.error.code === 403 && searchData.error.errors?.[0]?.reason === 'quotaExceeded') {
        console.log('Quota exceeded, returning mock data')
        return new Response(JSON.stringify(MOCK_NEW_RELEASES), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      throw new Error(`YouTube API error: ${JSON.stringify(searchData)}`)
    }

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')

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
    return new Response(JSON.stringify(MOCK_NEW_RELEASES), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

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
