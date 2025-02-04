import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    
    if (!query || typeof query !== 'string') {
      throw new Error('Invalid search query')
    }

    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured')
    }

    console.log('Searching YouTube for:', query)

    // First get search results
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
    )

    if (!searchResponse.ok) {
      const error = await searchResponse.json()
      console.error('YouTube API error:', error)
      throw new Error(`YouTube API error: ${searchResponse.status}`)
    }

    const searchData = await searchResponse.json()
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')

    // Then get video details including status.embeddable
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,status&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    )

    if (!videoDetailsResponse.ok) {
      throw new Error(`Failed to get video details: ${videoDetailsResponse.status}`)
    }

    const videoDetails = await videoDetailsResponse.json()
    
    // Filter out non-embeddable videos and map back to search result format
    const embeddableVideos = videoDetails.items
      .filter((video: any) => video.status.embeddable)
      .map((video: any) => {
        const searchResult = searchData.items.find((item: any) => item.id.videoId === video.id)
        return {
          ...searchResult,
          status: video.status
        }
      })

    console.log(`Filtered ${searchData.items.length - embeddableVideos.length} non-embeddable videos`)
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Cache the results
    const videos = embeddableVideos.map((item: any) => ({
      id: crypto.randomUUID(),
      title: item.snippet.title,
      image: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      category: 'search_results',
      video_id: item.id.videoId,
      cached_at: new Date().toISOString(),
      is_available: true,
      is_embeddable: true,
      channel_metadata: {
        title: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt
      }
    }))

    // Upsert videos to cache
    const { error: cacheError } = await supabase
      .from('cached_videos')
      .upsert(videos, { onConflict: 'video_id' })

    if (cacheError) {
      console.error('Error caching videos:', cacheError)
    }

    return new Response(
      JSON.stringify(embeddableVideos),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Search error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})