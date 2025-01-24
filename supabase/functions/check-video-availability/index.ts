import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get video ID from request body
    const { videoId } = await req.json().catch(() => ({}));
    
    console.log(`[check-video-availability] Checking availability for video: ${videoId}`);

    if (!videoId) {
      console.log('[check-video-availability] No videoId provided');
      return new Response(
        JSON.stringify({ error: 'Video ID is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Try to fetch video info from YouTube's oembed endpoint
    const response = await fetch(
      `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`
    );

    const result = {
      available: response.ok,
      status: response.status,
      videoId
    };

    console.log(`[check-video-availability] Result for ${videoId}:`, result);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('[check-video-availability] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});