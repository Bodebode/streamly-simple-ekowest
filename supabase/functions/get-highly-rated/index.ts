import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

const truncateTitle = (title: string): string => {
  const separatorIndex = title.search(/[-|(]/)
  if (separatorIndex !== -1) {
    return title.substring(0, separatorIndex).trim()
  }
  return title
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!API_KEY) {
      console.error('YouTube API key is not configured')
      throw new Error('YouTube API key is not configured')
    }

    console.log('Fetching highly rated videos...')
    const url = `${BASE_URL}/search?part=snippet&maxResults=50&q=Nollywood&type=video&key=${API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      const error = await response.text()
      console.error('YouTube API error:', error)
      throw new Error(`YouTube API error: ${error}`)
    }

    const data = await response.json()
    console.log(`Found ${data.items?.length || 0} initial videos`)

    if (!data.items || data.items.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const videoDetailsPromises = data.items.map(async (video: any) => {
      const videoId = video.id.videoId
      const detailsResponse = await fetch(
        `${BASE_URL}/videos?part=statistics,contentDetails&id=${videoId}&key=${API_KEY}`
      )
      
      if (!detailsResponse.ok) {
        console.error(`Failed to fetch details for video ${videoId}`)
        return null
      }

      const detailsData = await detailsResponse.json()
      const videoDetails = detailsData.items[0]
      
      if (!videoDetails) return null

      const duration = videoDetails.contentDetails.duration
      const durationMatch = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
      const hours = parseInt(durationMatch[1] || '0')
      const minutes = parseInt(durationMatch[2] || '0')
      const seconds = parseInt(durationMatch[3] || '0')
      const totalMinutes = hours * 60 + minutes + seconds / 60

      const stats = videoDetails.statistics

      return {
        id: videoId,
        title: truncateTitle(video.snippet.title),
        image: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
        category: "Highly Rated",
        videoId: videoId,
        views: parseInt(stats.viewCount),
        comments: parseInt(stats.commentCount),
        duration: totalMinutes,
        publishedAt: video.snippet.publishedAt,
      }
    })

    const videos = (await Promise.all(videoDetailsPromises))
      .filter((video) => 
        video && 
        video.views >= 500000 && 
        video.comments >= 100 &&
        video.duration >= 40
      )
      .sort((a, b) => new Date(b!.publishedAt).getTime() - new Date(a!.publishedAt).getTime())
      .slice(0, 10)

    console.log(`Returning ${videos.length} filtered videos`)

    return new Response(JSON.stringify(videos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in get-highly-rated function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch videos from YouTube' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})