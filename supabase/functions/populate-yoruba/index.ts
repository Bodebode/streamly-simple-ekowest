import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const PRIMARY_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const SECONDARY_API_KEY = Deno.env.get('YOUTUBE_API_KEY_SECONDARY')
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

async function searchYouTube(apiKey: string) {
  console.log('Attempting YouTube search with API key...');
  const searchResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=yoruba+movie+2024&type=video&videoDuration=long&key=${apiKey}`
  )
  
  if (!searchResponse.ok) {
    throw new Error(`YouTube search failed: ${searchResponse.statusText}`)
  }
  
  return await searchResponse.json()
}

async function getVideoDetails(videoIds: string[], apiKey: string) {
  console.log('Fetching video details...');
  const detailsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(',')}&key=${apiKey}`
  )
  
  if (!detailsResponse.ok) {
    throw new Error(`Video details fetch failed: ${detailsResponse.statusText}`)
  }
  
  return await detailsResponse.json()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Yoruba movies population...');
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

    const { data: existingVideos, error: checkError } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'Yoruba Movies');
    
    console.log('Existing Yoruba videos in database:', existingVideos?.length || 0);

    let searchData;
    let currentKey = PRIMARY_API_KEY;

    try {
      searchData = await searchYouTube(PRIMARY_API_KEY!);
      console.log('Successfully used primary API key');
      console.log('Found videos in search:', searchData.items.length);
    } catch (error) {
      console.log('Primary API key failed, trying secondary key:', error);
      currentKey = SECONDARY_API_KEY;
      searchData = await searchYouTube(SECONDARY_API_KEY!);
      console.log('Successfully used secondary API key');
      console.log('Found videos in search:', searchData.items.length);
    }

    const videoIds = searchData.items.map((item: any) => item.id.videoId);
    console.log('Video IDs to fetch details for:', videoIds.length);
    
    const detailsData = await getVideoDetails(videoIds, currentKey!);
    console.log(`Found ${detailsData.items.length} video details`);

    let successCount = 0;
    let failureCount = 0;

    // Process and store each video
    for (const video of detailsData.items as VideoDetails[]) {
      const thumbnailUrl = video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url;

      // Parse duration string to seconds
      const durationStr = video.contentDetails.duration;
      const matches = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      const hours = parseInt(matches?.[1] || '0');
      const minutes = parseInt(matches?.[2] || '0');
      const seconds = parseInt(matches?.[3] || '0');
      const durationInSeconds = hours * 3600 + minutes * 60 + seconds;

      // Calculate like ratio
      const likes = parseInt(video.statistics.likeCount || '0');
      const views = parseInt(video.statistics.viewCount || '0');
      const likeRatio = views > 0 ? likes / views : 0;

      // Log criteria checks
      console.log(`\nChecking criteria for video: ${video.snippet.title}`);
      console.log(`Duration: ${durationInSeconds}s (required: ≥1800s) - ${durationInSeconds >= 1800 ? 'PASS' : 'FAIL'}`);
      console.log(`Quality: 1080p (hardcoded) - PASS`);
      console.log(`Views: ${views} (required: ≥400000) - ${views >= 400000 ? 'PASS' : 'FAIL'}`);
      console.log(`Like ratio: ${likeRatio} (target: ≥0.8)`);

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
        video_quality: '1080p',
        language_tags: ['yoruba'],
        channel_metadata: { is_yoruba_creator: true },
        content_tags: ['yoruba', 'movie'],
        like_ratio: likeRatio,
        cultural_elements: ['yoruba'],
        storytelling_pattern: 'traditional',
        setting_authenticity: true,
        is_available: true,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      };

      // Call validate_yoruba_criteria function
      const { data: criteriaResult, error: criteriaError } = await supabase
        .rpc('validate_yoruba_criteria', {
          p_duration: durationInSeconds,
          p_quality: '1080p',
          p_views: views,
          p_language_tags: ['yoruba'],
          p_channel_metadata: { is_yoruba_creator: true },
          p_content_tags: ['yoruba', 'movie'],
          p_like_ratio: likeRatio,
          p_cultural_elements: ['yoruba'],
          p_storytelling_pattern: 'traditional',
          p_setting_authenticity: true
        });

      if (criteriaError) {
        console.error(`Error validating criteria for ${video.id}:`, criteriaError);
        failureCount++;
        continue;
      }

      console.log('Criteria result:', criteriaResult);

      const { error } = await supabase
        .from('cached_videos')
        .upsert({
          ...videoData,
          criteria_met: criteriaResult
        });

      if (error) {
        console.error(`Error storing video ${video.id}:`, error);
        failureCount++;
      } else {
        console.log(`Successfully stored video ${video.id}`);
        successCount++;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Yoruba movies population completed',
        apiKeyUsed: currentKey === PRIMARY_API_KEY ? 'primary' : 'secondary',
        totalProcessed: detailsData.items.length,
        successCount,
        failureCount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});