import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

interface VideoDetails {
  id: string;
  snippet: {
    title: string;
    thumbnails: {
      maxres?: { url: string };
      high: { url: string };
    };
    publishedAt: string;
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting Yoruba movies population...')
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)

    // Search for Yoruba movies
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=yoruba+movie+2024&type=video&videoDuration=long&key=${YOUTUBE_API_KEY}`
    )

    if (!searchResponse.ok) {
      throw new Error(`YouTube search failed: ${searchResponse.statusText}`)
    }

    const searchData = await searchResponse.json()
    const videoIds = searchData.items.map((item: any) => item.id.videoId)

    // Get detailed information for each video
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`
    )

    if (!detailsResponse.ok) {
      throw new Error(`Video details fetch failed: ${detailsResponse.statusText}`)
    }

    const detailsData = await detailsResponse.json()
    
    console.log(`Found ${detailsData.items.length} videos`)

    // Process and store each video
    for (const video of detailsData.items as VideoDetails[]) {
      const thumbnailUrl = video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url

      // Parse duration string to seconds
      const durationStr = video.contentDetails.duration
      const matches = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
      const hours = parseInt(matches?.[1] || '0')
      const minutes = parseInt(matches?.[2] || '0')
      const seconds = parseInt(matches?.[3] || '0')
      const durationInSeconds = hours * 3600 + minutes * 60 + seconds

      // Calculate like ratio
      const likes = parseInt(video.statistics.likeCount || '0')
      const views = parseInt(video.statistics.viewCount || '0')
      const likeRatio = views > 0 ? likes / views : 0

      const videoData = {
        id: crypto.randomUUID(),
        title: video.snippet.title,
        image: thumbnailUrl,
        category: 'Yoruba Movies',
        video_id: video.id,
        views: parseInt(video.statistics.viewCount),
        comments: parseInt(video.statistics.commentCount),
        duration: durationInSeconds,
        published_at: video.snippet.publishedAt,
        video_quality: '1080p', // Assuming HD quality
        language_tags: ['yoruba'],
        channel_metadata: { is_yoruba_creator: true },
        content_tags: ['yoruba', 'movie'],
        like_ratio: likeRatio,
        cultural_elements: ['yoruba'],
        storytelling_pattern: 'traditional',
        setting_authenticity: true
      }

      const { error } = await supabase
        .from('cached_videos')
        .upsert(videoData)

      if (error) {
        console.error(`Error storing video ${video.id}:`, error)
      } else {
        console.log(`Successfully stored video ${video.id}`)
      }
    }

    return new Response(
      JSON.stringify({ message: 'Yoruba movies population completed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})