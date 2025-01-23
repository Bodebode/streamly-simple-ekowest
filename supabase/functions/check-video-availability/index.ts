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
    // If no body is provided, return 400
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405 
        }
      );
    }

    const { videoId } = await req.json();
    
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Video ID is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log(`Checking availability for video: ${videoId}`);

    // Try to fetch video info from YouTube's oembed endpoint
    const response = await fetch(
      `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`
    );

    const result = {
      available: response.ok,
      status: response.status,
      videoId
    };

    // Update video availability in the database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (response.ok) {
      console.log(`Video ${videoId} is available`);
      await supabase
        .from('cached_videos')
        .update({ 
          is_available: true,
          last_availability_check: new Date().toISOString()
        })
        .eq('video_id', videoId);
    } else {
      console.log(`Video ${videoId} is not available (status: ${response.status})`);
      await supabase
        .from('cached_videos')
        .update({ 
          is_available: false,
          last_availability_check: new Date().toISOString(),
          last_error: `YouTube returned status ${response.status}`
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
    console.error('Error checking video availability:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});