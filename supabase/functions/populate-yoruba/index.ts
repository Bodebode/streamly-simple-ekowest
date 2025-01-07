import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { validateAndTransformVideo } from '../_shared/youtube-validation.ts'

const PRIMARY_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const SECONDARY_API_KEY = Deno.env.get('YOUTUBE_API_KEY_SECONDARY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

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
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,status&id=${videoIds.join(',')}&key=${apiKey}`
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

    let searchData;
    let currentKey = PRIMARY_API_KEY;

    try {
      searchData = await searchYouTube(PRIMARY_API_KEY!);
      console.log('Successfully used primary API key');
    } catch (error) {
      console.log('Primary API key failed, trying secondary key:', error);
      currentKey = SECONDARY_API_KEY;
      searchData = await searchYouTube(SECONDARY_API_KEY!);
      console.log('Successfully used secondary API key');
    }

    const videoIds = searchData.items.map((item: any) => item.id.videoId);
    const detailsData = await getVideoDetails(videoIds, currentKey!);

    let successCount = 0;
    let failureCount = 0;

    // Process and store each video
    for (const video of detailsData.items) {
      const videoData = await validateAndTransformVideo(supabase, video);
      
      if (!videoData) {
        failureCount++;
        continue;
      }

      const { error } = await supabase
        .from('cached_videos')
        .upsert(videoData);

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