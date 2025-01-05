import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getYouTubeApiKey } from '../_shared/youtube.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)

const truncateTitle = (title: string): string => {
  const slashIndex = title.search(/\/?[^/]*\//)
  const separatorIndex = title.search(/[-|(]/)
  
  const cutoffIndex = (slashIndex !== -1 && (separatorIndex === -1 || slashIndex < separatorIndex))
    ? slashIndex
    : separatorIndex;

  if (cutoffIndex !== -1) {
    return title.substring(0, cutoffIndex).trim()
  }
  return title
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting get-highly-rated function execution')
    
    // Check if we've made an API call in the last 2 hours
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    const { data: lastApiCall } = await supabase
      .from('cached_videos')
      .select('cached_at')
      .order('cached_at', { ascending: false })
      .limit(1);

    const shouldUseCache = lastApiCall?.[0]?.cached_at && 
      (new Date().getTime() - new Date(lastApiCall[0].cached_at).getTime() < TWO_HOURS);

    if (shouldUseCache) {
      console.log('Using cached data (within 2-hour window)');
      const { data: cachedVideos } = await supabase
        .from('cached_videos')
        .select('*')
        .eq('category', 'Highly Rated')
        .order('access_count', { ascending: false })
        .limit(12);

      if (cachedVideos && cachedVideos.length > 0) {
        // Update access counts
        const videoIds = cachedVideos.map(video => video.id);
        await supabase
          .from('cached_videos')
          .update({ access_count: supabase.rpc('increment_count') })
          .in('id', videoIds);

        return new Response(JSON.stringify(cachedVideos), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // If we need to make an API call, get an available API key
    const apiKey = await getYouTubeApiKey();
    
    console.log('Fetching from YouTube API');
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=Nollywood&type=video&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('YouTube API error:', data.error);
      // Fallback to cached content regardless of age
      const { data: emergencyCachedVideos } = await supabase
        .from('cached_videos')
        .select('*')
        .eq('category', 'Highly Rated')
        .order('access_count', { ascending: false })
        .limit(12);

      if (emergencyCachedVideos && emergencyCachedVideos.length > 0) {
        return new Response(JSON.stringify(emergencyCachedVideos), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 503
      });
    }

    const videos = data.items
      .map((video: any) => {
        const videoId = video.id.videoId;
        return {
          id: videoId,
          title: truncateTitle(video.snippet.title),
          image: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
          category: "Highly Rated",
          video_id: videoId,
        }
      })
      .filter((video) => video)
      .slice(0, 12);

    if (videos.length > 0) {
      console.log('Caching new videos');
      const { error: insertError } = await supabase
        .from('cached_videos')
        .upsert(videos.map(video => ({
          ...video,
          cached_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          access_count: 1
        })));

      if (insertError) {
        console.error('Error caching videos:', insertError);
      }
    }

    return new Response(JSON.stringify(videos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-highly-rated function:', error);
    
    // Always fallback to cached content on error
    const { data: emergencyCachedVideos } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'Highly Rated')
      .order('access_count', { ascending: false })
      .limit(12);

    if (emergencyCachedVideos && emergencyCachedVideos.length > 0) {
      return new Response(JSON.stringify(emergencyCachedVideos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      error: error.message,
      message: 'Failed to fetch videos, using cached content'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});