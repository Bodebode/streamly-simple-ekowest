import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = `${BASE_URL}/search?part=snippet&maxResults=50&q=Nollywood&type=video&key=${API_KEY}`
    const response = await fetch(url)
    const data = await response.json()

    const videoDetailsPromises = data.items.map(async (video: any) => {
      const videoId = video.id.videoId
      // Fetch both statistics and contentDetails to get duration
      const detailsResponse = await fetch(
        `${BASE_URL}/videos?part=statistics,contentDetails&id=${videoId}&key=${API_KEY}`
      )
      const detailsData = await detailsResponse.json()
      const videoDetails = detailsData.items[0]
      
      if (!videoDetails) return null

      // Convert YouTube duration format (PT1H2M10S) to minutes
      const duration = videoDetails.contentDetails.duration
      const durationMatch = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
      const hours = parseInt(durationMatch[1] || '0')
      const minutes = parseInt(durationMatch[2] || '0')
      const seconds = parseInt(durationMatch[3] || '0')
      const totalMinutes = hours * 60 + minutes + seconds / 60

      const stats = videoDetails.statistics

      return {
        id: videoId,
        title: video.snippet.title,
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

    return new Response(JSON.stringify(videos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in get-highly-rated function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})