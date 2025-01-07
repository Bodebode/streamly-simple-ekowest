import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get videos that haven't been checked in the last hour
    const { data: videos, error: fetchError } = await supabaseClient
      .from('cached_videos')
      .select('id, video_id')
      .or('last_availability_check.is.null,last_availability_check.lt.' + new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .limit(50);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Checking availability for ${videos?.length} videos`);

    const checkResults = await Promise.all(
      (videos ?? []).map(async (video) => {
        try {
          const response = await fetch(
            `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${video.video_id}&format=json`
          );
          
          const isAvailable = response.ok;
          
          // Update video availability status
          const { error: updateError } = await supabaseClient
            .from('cached_videos')
            .update({
              is_available: isAvailable,
              last_availability_check: new Date().toISOString(),
              last_error: isAvailable ? null : 'Video unavailable',
            })
            .eq('id', video.id);

          if (updateError) {
            console.error(`Error updating video ${video.id}:`, updateError);
          }

          return { id: video.id, isAvailable };
        } catch (error) {
          console.error(`Error checking video ${video.id}:`, error);
          return { id: video.id, isAvailable: false, error };
        }
      })
    );

    return new Response(
      JSON.stringify({
        message: 'Video availability check completed',
        results: checkResults,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});