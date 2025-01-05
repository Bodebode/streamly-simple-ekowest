import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)

const MAX_RETRIES = 3
const BATCH_SIZE = 10
const MIN_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

const truncateTitle = (title: string): string => {
  const slashIndex = title.search(/\/?[^/]*\//)
  const separatorIndex = title.search(/[-|(]/)
  const cutoffIndex = (slashIndex !== -1 && (separatorIndex === -1 || slashIndex < separatorIndex))
    ? slashIndex
    : separatorIndex;
  return cutoffIndex !== -1 ? title.substring(0, cutoffIndex).trim() : title
}

async function fetchCachedVideos() {
  const { data: cachedVideos, error: cacheError } = await supabase
    .from('cached_videos')
    .select('*')
    .eq('category', 'Highly Rated')
    .gt('expires_at', new Date().toISOString())
    .order('access_count', { ascending: false })
    .limit(12)

  if (cacheError) {
    console.error('Cache fetch error:', cacheError)
    return null
  }

  return cachedVideos
}

async function processBatch(videoIds: string[], apiKey: string) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds.join(',')}&key=${apiKey}`
    )
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Batch processing error:', error)
    return null
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting get-highly-rated function execution')
    
    // Check cache first
    const cachedVideos = await fetchCachedVideos()
    if (cachedVideos && cachedVideos.length > 0) {
      console.log('Returning cached videos:', cachedVideos.length)
      return new Response(JSON.stringify(cachedVideos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured')
    }

    // Fetch new videos with retries and rate limiting
    let retryCount = 0
    let videos = []
    
    while (retryCount < MAX_RETRIES && videos.length === 0) {
      try {
        console.log(`Attempt ${retryCount + 1} to fetch videos`)
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=Nollywood&type=video&key=${YOUTUBE_API_KEY}`
        )
        
        if (!searchResponse.ok) {
          throw new Error(`YouTube search API error: ${searchResponse.status}`)
        }

        const searchData = await searchResponse.json()
        
        // Process videos in batches
        const allVideoIds = searchData.items.map((item: any) => item.id.videoId)
        const batches = []
        
        for (let i = 0; i < allVideoIds.length; i += BATCH_SIZE) {
          const batch = allVideoIds.slice(i, i + BATCH_SIZE)
          const batchData = await processBatch(batch, YOUTUBE_API_KEY)
          if (batchData) {
            batches.push(batchData)
          }
          // Add small delay between batches to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        videos = batches.flatMap(batch => 
          batch.items.filter((video: any) => {
            const stats = video.statistics
            return parseInt(stats.viewCount) >= 500000 && parseInt(stats.commentCount) >= 100
          })
        )

        if (videos.length > 0) {
          // Cache the results
          const videosToCache = videos.slice(0, 12).map((video: any) => ({
            id: video.id,
            title: truncateTitle(searchData.items.find((item: any) => item.id.videoId === video.id).snippet.title),
            image: searchData.items.find((item: any) => item.id.videoId === video.id).snippet.thumbnails.maxres?.url 
              || searchData.items.find((item: any) => item.id.videoId === video.id).snippet.thumbnails.high.url,
            category: "Highly Rated",
            video_id: video.id,
            views: parseInt(video.statistics.viewCount),
            comments: parseInt(video.statistics.commentCount),
            cached_at: new Date().toISOString(),
            access_count: 0
          }))

          const { error: insertError } = await supabase
            .from('cached_videos')
            .upsert(videosToCache)

          if (insertError) {
            console.error('Cache insertion error:', insertError)
          }
        }
        
        break
      } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error)
        retryCount++
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)) // Exponential backoff
      }
    }

    if (videos.length === 0) {
      // Fallback to expired cache if all retries failed
      const { data: expiredCache } = await supabase
        .from('cached_videos')
        .select('*')
        .eq('category', 'Highly Rated')
        .order('cached_at', { ascending: false })
        .limit(12)

      if (expiredCache && expiredCache.length > 0) {
        console.log('Returning expired cache as fallback')
        return new Response(JSON.stringify(expiredCache), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    return new Response(JSON.stringify(videos.slice(0, 12)), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Fatal error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      message: 'Failed to fetch videos, please try again later'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})