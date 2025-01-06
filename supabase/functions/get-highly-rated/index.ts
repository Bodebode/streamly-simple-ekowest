import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { 
  fetchYouTubeVideos, 
  processBatch, 
  filterHighlyRatedVideos 
} from '../_shared/youtube-api.ts';
import {
  CACHE_DURATION,
  initSupabaseClient,
  fetchCachedVideos,
  fetchExpiredCache,
  truncateTitle
} from '../_shared/cache-utils.ts';

const MAX_RETRIES = 3;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Starting get-highly-rated function execution');
    const supabase = initSupabaseClient();
    
    // Try to get cached videos first
    const cachedVideos = await fetchCachedVideos(supabase);
    if (cachedVideos?.length > 0) {
      console.log('Returning cached videos:', cachedVideos.length);
      return new Response(JSON.stringify(cachedVideos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    // Check for recent errors
    const { data: recentErrors } = await supabase
      .from('cached_videos')
      .select('last_error, retry_count, last_retry')
      .eq('category', 'Highly Rated')
      .gt('last_retry', new Date(Date.now() - 15 * 60 * 1000).toISOString())
      .order('last_retry', { ascending: false })
      .limit(1);

    if (recentErrors?.[0]?.retry_count >= 3) {
      console.log('Too many recent errors, using expired cache');
      const expiredCache = await fetchExpiredCache(supabase);
      if (expiredCache?.length > 0) {
        return new Response(JSON.stringify(expiredCache), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Fetch new videos with retries
    let retryCount = 0;
    let videos = [];
    
    while (retryCount < MAX_RETRIES && videos.length === 0) {
      try {
        console.log(`Attempt ${retryCount + 1} to fetch videos`);
        const searchResults = await fetchYouTubeVideos(YOUTUBE_API_KEY);
        const allVideoIds = searchResults.map(item => item.id.videoId);
        
        const batches = await processBatch(allVideoIds, YOUTUBE_API_KEY);
        const filteredVideos = filterHighlyRatedVideos(batches.flatMap(batch => batch.items));

        if (filteredVideos.length > 0) {
          const videosToCache = filteredVideos.slice(0, 12).map(video => ({
            id: video.id,
            title: truncateTitle(searchResults.find(item => item.id.videoId === video.id).snippet.title),
            image: searchResults.find(item => item.id.videoId === video.id).snippet.thumbnails.maxres?.url 
              || searchResults.find(item => item.id.videoId === video.id).snippet.thumbnails.high.url,
            category: "Highly Rated",
            video_id: video.id,
            views: parseInt(video.statistics.viewCount),
            comments: parseInt(video.statistics.commentCount),
            cached_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + CACHE_DURATION).toISOString(),
            access_count: 0,
            retry_count: 0,
            last_retry: null,
            last_error: null
          }));

          const { error: insertError } = await supabase
            .from('cached_videos')
            .upsert(videosToCache);

          if (insertError) {
            console.error('Cache insertion error:', insertError);
          }

          videos = videosToCache;
        }
        
        break;
      } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error);
        
        await supabase
          .from('cached_videos')
          .update({
            last_error: error.message,
            retry_count: retryCount + 1,
            last_retry: new Date().toISOString()
          })
          .eq('category', 'Highly Rated');
        
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
      }
    }

    if (videos.length === 0) {
      console.log('No new videos fetched, falling back to expired cache');
      const expiredCache = await fetchExpiredCache(supabase);
      if (expiredCache?.length > 0) {
        return new Response(JSON.stringify(expiredCache), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify(videos.slice(0, 12)), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Fatal error:', error);
    
    const supabase = initSupabaseClient();
    const expiredCache = await fetchExpiredCache(supabase);
    if (expiredCache?.length > 0) {
      return new Response(JSON.stringify(expiredCache), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      error: error.message,
      message: 'Failed to fetch videos, please try again later'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});