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
    let result = {
      available: false,
      status: 404,
      videoId: null,
      message: 'No video ID provided'
    };

    if (req.body) {
      try {
        const { videoId } = await req.json();
        
        if (videoId) {
          console.log('Checking availability for video:', videoId);
          
          const response = await fetch(
            `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`
          );

          result = {
            available: response.ok,
            status: response.status,
            videoId,
            message: response.ok ? 'Video is available' : 'Video is not available'
          };
          
          console.log('Video availability result:', result);
        }
      } catch (parseError) {
        console.error('Error parsing request body:', parseError);
        result.message = 'Invalid request format';
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
        message: 'Internal server error',
        videoId: null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 to handle errors gracefully on client
      }
    );
  }
});