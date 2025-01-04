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
      const detailsResponse = await fetch(
        `${BASE_URL}/videos?part=statistics&id=${videoId}&key=${API_KEY}`
      )
      const detailsData = await detailsResponse.json()
      const stats = detailsData.items[0]?.statistics

      if (!stats) return null

      return {
        id: videoId,
        title: video.snippet.title,
        image: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
        category: "Highly Rated",
        videoId: videoId,
        views: parseInt(stats.viewCount),
        comments: parseInt(stats.commentCount),
        publishedAt: video.snippet.publishedAt,
      }
    })

    const videos = (await Promise.all(videoDetailsPromises))
      .filter((video) => video && video.views >= 500000 && video.comments >= 100)
      .sort((a, b) => new Date(b!.publishedAt).getTime() - new Date(a!.publishedAt).getTime())
      .slice(0, 10)

    return new Response(JSON.stringify(videos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})