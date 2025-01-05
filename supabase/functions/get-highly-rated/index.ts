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
    
    // First try to get cached videos
    const { data: cachedVideos, error: cacheError } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'Highly Rated')
      .order('access_count', { ascending: false })
      .limit(12);

    if (cachedVideos && cachedVideos.length > 0) {
      console.log('Using cached videos:', cachedVideos.length);
      return new Response(JSON.stringify(cachedVideos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If no cached videos, try YouTube API
    try {
      const apiKey = await getYouTubeApiKey();
      console.log('Fetching from YouTube API');
      
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=Nollywood&type=video&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.error('YouTube API error:', data.error);
        throw new Error('YouTube API error: ' + data.error.message);
      }

      if (!data.items || data.items.length === 0) {
        console.error('No videos found in YouTube response');
        throw new Error('No videos found in YouTube response');
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
            cached_at: new Date().toISOString(),
            access_count: 1
          }
        })
        .filter((video: any) => video)
        .slice(0, 12);

      // Cache the new videos
      if (videos.length > 0) {
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
    } catch (youtubeError) {
      console.error('YouTube API or caching error:', youtubeError);
      
      // Return empty array with 200 status to prevent client errors
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Fatal error in get-highly-rated function:', error);
    return new Response(JSON.stringify([]), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});