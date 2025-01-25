import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Even if no videoId is provided, we should return a valid JSON response
    const result = {
      available: false,
      status: 404,
      videoId: null,
      message: 'No video ID provided'
    };

    // Try to parse the request body
    if (req.body) {
      const { videoId } = await req.json();
      
      if (videoId) {
        // Try to fetch video info from YouTube's oembed endpoint
        const response = await fetch(
          `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`
        );

        result.available = response.ok;
        result.status = response.status;
        result.videoId = videoId;
        result.message = response.ok ? 'Video is available' : 'Video is not available';
      }
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error checking video availability:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        available: false,
        status: 500,
        message: 'Internal server error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Still return 200 to handle the error gracefully on client
      }
    );
  }
});