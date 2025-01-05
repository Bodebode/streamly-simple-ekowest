import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { min_length = 0, max_length = 42 } = await req.json()
    console.log('Received parameters:', { min_length, max_length })

    console.log('Checking cache for skits...')
    const { data: cachedVideos, error: cacheError } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'Skits')
      .gt('expires_at', new Date().toISOString())
      .order('views', { ascending: false })
      .limit(12)

    if (cacheError) {
      console.error('Cache error:', cacheError)
      throw cacheError
    }

    if (cachedVideos && cachedVideos.length > 0) {
      console.log('Returning cached videos:', cachedVideos.length)
      const formattedVideos = cachedVideos.map(video => ({
        id: video.id,
        title: video.title,
        image: video.image,
        category: video.category,
        videoId: video.video_id
      }));
      return new Response(JSON.stringify(formattedVideos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Cache miss, fetching from YouTube API...')
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&q=nollywood+skit+comedy&type=video&order=date&maxResults=50&key=${API_KEY}`
    )
    const searchData = await searchResponse.json()

    if (searchData.error) {
      console.error('YouTube API error:', searchData.error)
      throw new Error(`YouTube API error: ${JSON.stringify(searchData.error)}`)
    }

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')

    const videoResponse = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    )
    const videoData = await videoResponse.json()

    const videos = videoData.items
      .filter((video: any) => {
        const viewCount = parseInt(video.statistics.viewCount || '0')
        const durationMinutes = convertDurationToMinutes(video.contentDetails.duration)
        return viewCount >= 10000 && durationMinutes <= max_length && durationMinutes >= min_length
      })
      .slice(0, 12)
      .map((video: any) => {
        const videoId = video.id
        return {
          id: videoId,
          title: truncateTitle(video.snippet.title),
          image: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
          category: "Skits",
          videoId: videoId,
        }
      })

    console.log(`Found ${videos.length} videos matching criteria`)

    // Cache the videos with the correct structure
    if (videos.length > 0) {
      const videosToCache = videos.map((video: any) => ({
        id: video.id,
        title: video.title,
        image: video.image,
        category: video.category,
        video_id: video.videoId,
        views: 10000, // Default value since we filtered for this minimum
        duration: 30, // Default reasonable duration
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      }));

      const { error: insertError } = await supabase
        .from('cached_videos')
        .upsert(videosToCache)

      if (insertError) {
        console.error('Cache insert error:', insertError)
      }
    }

    return new Response(JSON.stringify(videos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
})

const convertDurationToMinutes = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  
  return hours * 60 + minutes + Math.ceil(seconds / 60)
}

const truncateTitle = (title: string): string => {
  const separatorIndex = title.search(/[-|(#]/)
  let processedTitle = separatorIndex !== -1 
    ? title.substring(0, separatorIndex).trim()
    : title.trim()
    
  const words = processedTitle.split(' ')
  processedTitle = words.slice(0, Math.min(3, words.length)).join(' ')
  
  return processedTitle
}