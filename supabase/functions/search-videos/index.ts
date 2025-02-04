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

    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
    )

    if (!searchResponse.ok) {
      const error = await searchResponse.json()
      console.error('YouTube API error:', error)
      throw new Error(`YouTube API error: ${searchResponse.status}`)
    }

    const data = await searchResponse.json()
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Cache the results
    const videos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      image: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      category: 'search_results',
      video_id: item.id.videoId,
      cached_at: new Date().toISOString(),
      is_available: true,
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
      JSON.stringify(data.items),
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