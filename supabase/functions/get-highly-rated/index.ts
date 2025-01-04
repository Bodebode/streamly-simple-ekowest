import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const MOCK_VIDEOS = [
  {
    id: "KDHhiwoP5Ng",
    title: "The Wedding Party",
    image: "https://i.ytimg.com/vi/KDHhiwoP5Ng/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "KDHhiwoP5Ng",
    views: 1000000,
    comments: 500,
    duration: 120,
    publishedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "9uYzWX-mGcE",
    title: "King of Boys",
    image: "https://i.ytimg.com/vi/9uYzWX-mGcE/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "9uYzWX-mGcE",
    views: 800000,
    comments: 400,
    duration: 110,
    publishedAt: "2023-02-01T00:00:00Z"
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Fetching highly rated videos...')
    const API_KEY = Deno.env.get('YOUTUBE_API_KEY')

    if (!API_KEY) {
      console.log('Using mock data (no API key)')
      return new Response(JSON.stringify(MOCK_VIDEOS), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=Nollywood&type=video&key=${API_KEY}`
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
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoId}&key=${API_KEY}`
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
