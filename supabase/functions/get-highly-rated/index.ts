import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)

const MOCK_HIGHLY_RATED = [
  {
    id: "Yg9z8lv1k_4",
    title: "Do you Wanna Japa",
    image: "https://img.youtube.com/vi/Yg9z8lv1k_4/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "Yg9z8lv1k_4",
    views: 1000000,
    comments: 500,
    duration: 45,
    publishedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "3aQFM1ZtMG0",
    title: "The Ghost Chase",
    image: "https://img.youtube.com/vi/3aQFM1ZtMG0/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "3aQFM1ZtMG0",
    views: 800000,
    comments: 300,
    duration: 42,
    publishedAt: "2024-01-02T00:00:00Z"
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Checking cache for highly rated videos...')
    const { data: cachedVideos, error: cacheError } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'Highly Rated')
      .gt('expires_at', new Date().toISOString())
      .order('views', { ascending: false })
      .limit(10)

    if (cacheError) {
      console.error('Cache error:', cacheError)
      throw cacheError
    }

    if (cachedVideos && cachedVideos.length > 0) {
      console.log('Returning cached videos:', cachedVideos.length)
      return new Response(JSON.stringify(cachedVideos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Cache miss, fetching from YouTube API...')
    const url = `${BASE_URL}/search?part=snippet&maxResults=50&q=Nollywood&type=video&key=${API_KEY}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.error) {
      console.error('YouTube API error:', JSON.stringify(data.error, null, 2))
      if (data.error.code === 403 && data.error.errors?.[0]?.reason === 'quotaExceeded') {
        console.log('Quota exceeded, returning mock data')
        return new Response(JSON.stringify(MOCK_HIGHLY_RATED), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      throw new Error(`YouTube API error: ${JSON.stringify(data)}`)
    }

    const videoDetailsPromises = data.items.map(async (video: any) => {
      const videoId = video.id.videoId
      const detailsResponse = await fetch(
        `${BASE_URL}/videos?part=statistics,contentDetails&id=${videoId}&key=${API_KEY}`
      )
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
        video_id: videoId,
        views: parseInt(stats.viewCount),
        comments: parseInt(stats.commentCount),
        duration: totalMinutes,
        published_at: video.snippet.publishedAt,
      }
    })

    const videos = (await Promise.all(videoDetailsPromises))
      .filter((video) => 
        video && 
        video.views >= 500000 && 
        video.comments >= 100 &&
        video.duration >= 40
      )
      .sort((a, b) => b!.views - a!.views)
      .slice(0, 10)

    // Cache the videos
    if (videos.length > 0) {
      console.log('Caching videos:', videos.length)
      const { error: insertError } = await supabase
        .from('cached_videos')
        .upsert(videos)

      if (insertError) {
        console.error('Cache insert error:', insertError)
      }
    }

    return new Response(JSON.stringify(videos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify(MOCK_HIGHLY_RATED), {
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