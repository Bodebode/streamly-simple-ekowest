import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from '@supabase/supabase-js';
import { fetchWithKeyRotation } from '../_shared/youtube.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // First try to get cached videos
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: cachedVideos, error: cacheError } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'Highly Rated')
      .order('access_count', { ascending: false })
      .limit(12);

    if (cachedVideos && cachedVideos.length > 0) {
      console.log('Using cached highly rated videos:', cachedVideos.length);
      return new Response(JSON.stringify(cachedVideos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If no cached videos, fetch from YouTube
    console.log('No cached videos found, fetching from YouTube...');
    const searchQuery = 'technology|programming|coding|tech|developer';
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${searchQuery}&type=video&videoDuration=medium&videoEmbeddable=true&order=rating`;

    const response = await fetchWithKeyRotation(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      console.log('No videos found from YouTube API');
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Transform and cache the results
    const videos = data.items.map((item: any, index: number) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      image: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      category: 'Highly Rated',
      videoId: item.id.videoId,
      cached_at: new Date().toISOString()
    }));

    // Cache the videos
    const { error: insertError } = await supabase
      .from('cached_videos')
      .upsert(videos, { onConflict: 'id' });

    if (insertError) {
      console.error('Error caching videos:', insertError);
    }

    return new Response(JSON.stringify(videos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-highly-rated function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});