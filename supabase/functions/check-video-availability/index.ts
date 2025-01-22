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
    // Parse the request body
    let videoId;
    try {
      const body = await req.json();
      videoId = body.videoId;
      console.log('[check-video-availability] Received request for videoId:', videoId);
    } catch (error) {
      console.error('[check-video-availability] Error parsing request body:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request body',
          details: error.message 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    if (!videoId) {
      console.error('[check-video-availability] No videoId provided');
      return new Response(
        JSON.stringify({ error: 'Video ID is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Try to fetch video info from YouTube's oembed endpoint
    console.log('[check-video-availability] Checking video availability on YouTube:', videoId);
    const response = await fetch(
      `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`
    );

    const result = {
      available: response.ok,
      status: response.status,
      videoId,
      checkedAt: new Date().toISOString()
    };

    console.log('[check-video-availability] Check result:', result);

    // Update the video availability in the database
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (response.ok) {
      await supabaseAdmin
        .from('cached_videos')
        .update({ 
          is_available: true,
          last_availability_check: new Date().toISOString()
        })
        .eq('video_id', videoId);
    } else {
      await supabaseAdmin
        .from('cached_videos')
        .update({ 
          is_available: false,
          last_availability_check: new Date().toISOString(),
          last_error: `Video not available (HTTP ${response.status})`
        })
        .eq('video_id', videoId);
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('[check-video-availability] Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});