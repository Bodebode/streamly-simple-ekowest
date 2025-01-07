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

const truncateTitle = (title: string): string => {
  const separatorIndex = title.search(/[-|(]/)
  if (separatorIndex !== -1) {
    return title.substring(0, separatorIndex).trim()
  }
  return title
}

serve(async (req) => {
  console.log('Processing request to get-new-releases function')
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // First check cache
    console.log('Checking cache for new releases')
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
    const fiveDaysAgo = new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000));

    // First try to get NollyFamilyTV content
    const { data: nollyFamilyVideos } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'New Release')
      .eq('is_available', true)
      .eq('is_embeddable', true)
      .gte('views', 20000)
      .in('video_quality', ['1080p', '2160p', '1440p'])
      .gte('duration', 3600)
      .gte('published_at', fiveDaysAgo.toISOString())
      .ilike('channel_metadata->channel_id', '%nollyfamilytv%')
      .order('published_at', { ascending: false })
      .limit(1);

    // Then get other new releases
    const { data: otherVideos } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'New Release')
      .eq('is_available', true)
      .eq('is_embeddable', true)
      .gte('views', 20000)
      .in('video_quality', ['1080p', '2160p', '1440p'])
      .gte('published_at', threeDaysAgo.toISOString())
      .order('published_at', { ascending: false })
      .limit(11);

    if ((nollyFamilyVideos && nollyFamilyVideos.length > 0) || 
        (otherVideos && otherVideos.length > 0)) {
      const combinedVideos = [
        ...(nollyFamilyVideos || []),
        ...(otherVideos || [])
      ];

      console.log('Returning cached videos:', combinedVideos.length);
      return new Response(JSON.stringify(combinedVideos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If cache miss, fetch from YouTube API
    if (!API_KEY) {
      console.error('YouTube API key not found');
      throw new Error('YouTube API key not configured');
    }

    // Search for NollyFamilyTV videos first
    const nollyFamilyResponse = await fetch(
      `${BASE_URL}/search?part=snippet&channelId=@nollyfamilytv&type=video&order=date&maxResults=5&key=${API_KEY}`
    );

    // Then search for other Nollywood movies
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&q=nollywood+full+movie&type=video&order=date&maxResults=50&key=${API_KEY}`
    );

    if (!nollyFamilyResponse.ok || !searchResponse.ok) {
      throw new Error('Failed to fetch from YouTube API');
    }

    const [nollyFamilyData, searchData] = await Promise.all([
      nollyFamilyResponse.json(),
      searchResponse.json()
    ]);

    // Combine and get video details
    const allVideoIds = [
      ...(nollyFamilyData.items || []).map((item: any) => item.id.videoId),
      ...(searchData.items || []).map((item: any) => item.id.videoId)
    ].join(',');

    const videoResponse = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${allVideoIds}&key=${API_KEY}`
    );

    if (!videoResponse.ok) {
      throw new Error('Failed to fetch video details');
    }

    const videoData = await videoResponse.json();

    // Transform and filter videos based on criteria
    const videos = videoData.items
      .filter((video: any) => {
        const viewCount = parseInt(video.statistics.viewCount);
        const isNollyFamily = video.snippet.channelId === '@nollyfamilytv';
        const publishDate = new Date(video.snippet.publishedAt);
        const isRecent = isNollyFamily ? 
          publishDate >= fiveDaysAgo : 
          publishDate >= threeDaysAgo;
        
        return viewCount >= 20000 && isRecent;
      })
      .map((video: any) => ({
        id: video.id,
        title: truncateTitle(video.snippet.title),
        image: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
        category: "New Release",
        video_id: video.id,
        views: parseInt(video.statistics.viewCount),
        comments: parseInt(video.statistics.commentCount),
        video_quality: '1080p', // Assuming HD quality
        is_available: true,
        is_embeddable: true,
        channel_metadata: {
          channel_id: video.snippet.channelId,
          is_nollyfamily: video.snippet.channelId === '@nollyfamilytv'
        },
        published_at: video.snippet.publishedAt,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }));

    // Cache the results
    if (videos.length > 0) {
      console.log('Caching new videos:', videos.length);
      const { error: insertError } = await supabase
        .from('cached_videos')
        .upsert(videos);

      if (insertError) {
        console.error('Error caching videos:', insertError);
      }
    }

    return new Response(JSON.stringify(videos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-new-releases function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});