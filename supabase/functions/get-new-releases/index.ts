import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

const NOLLYFAMILY_CHANNEL_ID = 'UCxqfjX44-TG9rF_ao3c0ZCw'
const MIN_VIEWS = 20000
const REGULAR_VIDEO_AGE_LIMIT = 3 * 24 * 60 * 60 * 1000 // 3 days in ms
const NOLLYFAMILY_AGE_LIMIT = 5 * 24 * 60 * 60 * 1000 // 5 days in ms
const MIN_DURATION_MS = 60 * 60 * 1000 // 1 hour in ms

const truncateTitle = (title: string): string => {
  const separatorIndex = title.search(/[-|(]/)
  if (separatorIndex !== -1) {
    return title.substring(0, separatorIndex).trim()
  }
  return title
}

const isHighQuality = (quality: string) => {
  return ['1080p', '1440p', '2160p'].includes(quality)
}

const isNollywoodContent = (title: string, description: string) => {
  const keywords = ['nollywood', 'nigerian movie', 'nigerian film']
  const content = (title + ' ' + description).toLowerCase()
  return keywords.some(keyword => content.includes(keyword))
}

serve(async (req) => {
  console.log('Processing request to get-new-releases function')
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // First check for recent NollyFamily videos
    console.log('Checking for NollyFamily videos')
    const nollyFamilyResponse = await fetch(
      `${BASE_URL}/search?part=snippet&channelId=${NOLLYFAMILY_CHANNEL_ID}&type=video&order=date&maxResults=5&key=${API_KEY}`
    )

    if (!nollyFamilyResponse.ok) {
      console.error('Error fetching NollyFamily videos:', await nollyFamilyResponse.text())
      throw new Error('Failed to fetch NollyFamily videos')
    }

    const nollyFamilyData = await nollyFamilyResponse.json()
    let nollyFamilyVideos = []

    if (nollyFamilyData.items?.length > 0) {
      const videoIds = nollyFamilyData.items.map((item: any) => item.id.videoId).join(',')
      const detailsResponse = await fetch(
        `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
      )

      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json()
        nollyFamilyVideos = detailsData.items
          .filter((video: any) => {
            const publishDate = new Date(video.snippet.publishedAt)
            const age = Date.now() - publishDate.getTime()
            const duration = video.contentDetails.duration // PT1H30M format
            const durationMs = (duration.match(/(\d+)H/) ? parseInt(duration.match(/(\d+)H/)[1]) * 60 * 60 * 1000 : 0) +
                             (duration.match(/(\d+)M/) ? parseInt(duration.match(/(\d+)M/)[1]) * 60 * 1000 : 0)
            
            return age <= NOLLYFAMILY_AGE_LIMIT && 
                   durationMs >= MIN_DURATION_MS &&
                   parseInt(video.statistics.viewCount) >= MIN_VIEWS
          })
          .map((video: any) => ({
            id: video.id,
            title: truncateTitle(video.snippet.title),
            image: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
            category: "New Release",
            video_id: video.id,
            views: parseInt(video.statistics.viewCount),
            comments: parseInt(video.statistics.commentCount),
            cached_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            is_available: true,
            is_embeddable: true,
            video_quality: '1080p' // Assuming NollyFamily uploads are high quality
          }))
      }
    }

    // Then fetch other Nollywood videos
    console.log('Fetching other Nollywood videos')
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&q=nollywood+full+movie&type=video&order=date&maxResults=50&key=${API_KEY}`
    )
    
    if (!searchResponse.ok) {
      console.error('YouTube search API error:', await searchResponse.text())
      throw new Error('Failed to fetch from YouTube API')
    }

    const searchData = await searchResponse.json()
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')

    const videoResponse = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    )

    if (!videoResponse.ok) {
      throw new Error('Failed to fetch video details')
    }

    const videoData = await videoResponse.json()
    const regularVideos = videoData.items
      .filter((video: any) => {
        const publishDate = new Date(video.snippet.publishedAt)
        const age = Date.now() - publishDate.getTime()
        return age <= REGULAR_VIDEO_AGE_LIMIT &&
               parseInt(video.statistics.viewCount) >= MIN_VIEWS &&
               isNollywoodContent(video.snippet.title, video.snippet.description)
      })
      .map((video: any) => ({
        id: video.id,
        title: truncateTitle(video.snippet.title),
        image: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
        category: "New Release",
        video_id: video.id,
        views: parseInt(video.statistics.viewCount),
        comments: parseInt(video.statistics.commentCount),
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        is_available: true,
        is_embeddable: true,
        video_quality: '1080p'
      }))

    // Combine videos, prioritizing NollyFamily
    const combinedVideos = [...nollyFamilyVideos, ...regularVideos].slice(0, 12)

    // Cache the results
    if (combinedVideos.length > 0) {
      console.log('Caching new videos:', combinedVideos.length)
      const { error: insertError } = await supabase
        .from('cached_videos')
        .upsert(combinedVideos)

      if (insertError) {
        console.error('Error caching videos:', insertError)
      }
    }

    return new Response(JSON.stringify(combinedVideos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in get-new-releases function:', error)
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})