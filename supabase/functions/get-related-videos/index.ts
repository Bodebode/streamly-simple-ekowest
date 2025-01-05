import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)

  try {
    const { videoId } = await req.json()
    
    if (!videoId || typeof videoId !== 'string') {
      console.error('Invalid or missing videoId:', videoId)
      throw new Error('Invalid video ID provided')
    }

    console.log('Fetching related videos for:', videoId)

    // First try to get cached related videos
    const { data: cachedVideos } = await supabase
      .from('cached_videos')
      .select('*')
      .neq('video_id', videoId)
      .gt('expires_at', new Date().toISOString())
      .order('access_count', { ascending: false })
      .limit(7)

    if (cachedVideos && cachedVideos.length >= 5) {
      console.log('Using cached related videos')
      // Update access count for retrieved videos
      const videoIds = cachedVideos.map(video => video.id)
      await supabase
        .from('cached_videos')
        .update({ access_count: supabase.sql`access_count + 1` })
        .in('id', videoIds)

      const relatedVideos = cachedVideos.map(video => ({
        id: video.video_id,
        title: video.title,
        thumbnail: video.image,
      }))

      return new Response(JSON.stringify(relatedVideos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // If not enough cached videos, fall back to YouTube API
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
    if (!YOUTUBE_API_KEY) {
      console.error('YouTube API key not found')
      throw new Error('YouTube API key not configured')
    }

    console.log('Fetching from YouTube API')
    const youtubeUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    youtubeUrl.searchParams.append('part', 'snippet')
    youtubeUrl.searchParams.append('relatedToVideoId', videoId)
    youtubeUrl.searchParams.append('type', 'video')
    youtubeUrl.searchParams.append('maxResults', '7')
    youtubeUrl.searchParams.append('key', YOUTUBE_API_KEY)

    const response = await fetch(youtubeUrl.toString())
    const data = await response.json()

    if (!response.ok) {
      console.error('YouTube API error details:', JSON.stringify(data, null, 2))
      throw new Error(`YouTube API error: ${response.status} - ${data.error?.message || 'Unknown error'}`)
    }

    console.log('Successfully received YouTube API response')

    if (!data.items || !Array.isArray(data.items)) {
      console.error('Invalid response format:', data)
      throw new Error('Invalid response from YouTube API')
    }

    // Cache the new videos
    const newVideos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      image: item.snippet.thumbnails.maxres?.url || 
             item.snippet.thumbnails.high?.url || 
             item.snippet.thumbnails.default.url,
      category: "Related",
      video_id: item.id.videoId,
      cached_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      access_count: 1
    }))

    if (newVideos.length > 0) {
      const { error: insertError } = await supabase
        .from('cached_videos')
        .upsert(newVideos)

      if (insertError) {
        console.error('Error caching related videos:', insertError)
      }
    }

    const relatedVideos = newVideos.map(video => ({
      id: video.video_id,
      title: video.title,
      thumbnail: video.image,
    }))

    console.log('Returning related videos:', relatedVideos.length)

    return new Response(JSON.stringify(relatedVideos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in get-related-videos:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})