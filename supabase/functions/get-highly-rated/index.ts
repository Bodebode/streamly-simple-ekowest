import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)

const truncateTitle = (title: string): string => {
  const slashIndex = title.search(/\/?[^/]*\//)
  const separatorIndex = title.search(/[-|(]/)
  
  const cutoffIndex = (slashIndex !== -1 && (separatorIndex === -1 || slashIndex < separatorIndex))
    ? slashIndex
    : separatorIndex;

  if (cutoffIndex !== -1) {
    return title.substring(0, cutoffIndex).trim()
  }
  return title
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting get-highly-rated function execution')
    
    // First, try to get non-expired cached videos
    const { data: cachedVideos, error: cacheError } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'Highly Rated')
      .gt('expires_at', new Date().toISOString())
      .order('access_count', { ascending: false })
      .limit(12)

    // Update access count for retrieved videos
    if (cachedVideos && cachedVideos.length > 0) {
      const videoIds = cachedVideos.map(video => video.id)
      await supabase
        .from('cached_videos')
        .update({ access_count: supabase.sql`access_count + 1` })
        .in('id', videoIds)

      console.log('Returning cached videos:', cachedVideos.length)
      return new Response(JSON.stringify(cachedVideos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // If we don't have enough fresh cached videos, try to get expired ones
    const { data: expiredVideos } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'Highly Rated')
      .lte('expires_at', new Date().toISOString())
      .order('access_count', { ascending: false })
      .limit(12)

    if (expiredVideos && expiredVideos.length > 0) {
      // Update access count and refresh expiration for frequently accessed videos
      const videoIds = expiredVideos.map(video => video.id)
      await supabase
        .from('cached_videos')
        .update({ 
          access_count: supabase.sql`access_count + 1`,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Extend by 30 days
        })
        .in('id', videoIds)

      console.log('Returning expired but frequently accessed videos:', expiredVideos.length)
      return new Response(JSON.stringify(expiredVideos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Only fetch from YouTube API if we have no usable cached data
    if (!YOUTUBE_API_KEY) {
      console.error('YouTube API key not configured')
      throw new Error('YouTube API key not configured')
    }

    console.log('No cached videos found, fetching from YouTube API')
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=Nollywood&type=video&key=${YOUTUBE_API_KEY}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.error) {
      console.error('YouTube API error:', data.error)
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 503
      })
    }

    console.log('Successfully fetched videos from YouTube API')

    // Batch process video details to minimize API calls
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',')
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    )
    const detailsData = await detailsResponse.json()

    const videos = data.items
      .map((video: any) => {
        const videoId = video.id.videoId
        const videoDetails = detailsData.items.find((item: any) => item.id === videoId)
        
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
      .filter((video) => 
        video && 
        video.views >= 500000 && 
        video.comments >= 100 &&
        video.duration >= 40
      )
      .sort((a, b) => new Date(b!.published_at).getTime() - new Date(a!.published_at).getTime())
      .slice(0, 12)

    console.log('Filtered and processed videos:', videos.length)

    if (videos.length > 0) {
      console.log('Caching new videos')
      const { error: insertError } = await supabase
        .from('cached_videos')
        .upsert(videos.map(video => ({
          ...video,
          cached_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          access_count: 1
        })))

      if (insertError) {
        console.error('Error caching videos:', insertError)
      }
    }

    return new Response(JSON.stringify(videos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in get-highly-rated function:', error)
    
    // If there's an error, try to return any cached videos regardless of expiration
    const { data: emergencyCachedVideos } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'Highly Rated')
      .order('access_count', { ascending: false })
      .limit(12)

    if (emergencyCachedVideos && emergencyCachedVideos.length > 0) {
      console.log('Returning emergency cached videos:', emergencyCachedVideos.length)
      return new Response(JSON.stringify(emergencyCachedVideos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ 
      error: error.message,
      message: 'Failed to fetch videos, please try again later'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})