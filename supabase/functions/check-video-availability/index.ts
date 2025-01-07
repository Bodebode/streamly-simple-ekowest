import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
};

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    console.log('Starting video availability check...');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get videos that haven't been checked in the last hour
    const { data: videos, error: fetchError } = await supabase
      .from('cached_videos')
      .select('id, video_id, title')
      .or('last_availability_check.is.null,last_availability_check.lt.' + new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .limit(50);

    if (fetchError) {
      console.error('Error fetching videos:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${videos?.length || 0} videos to check`);

    // Process videos in parallel
    const updates = await Promise.all((videos || []).map(async (video) => {
      try {
        const response = await fetch(
          `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${video.video_id}&format=json`
        );

        const isAvailable = response.ok;
        console.log(`Video ${video.title} (${video.video_id}) availability: ${isAvailable}`);

        // Update video status in database
        const { error: updateError } = await supabase
          .from('cached_videos')
          .update({
            is_available: isAvailable,
            last_availability_check: new Date().toISOString(),
            last_error: isAvailable ? null : 'Video unavailable'
          })
          .eq('id', video.id);

        if (updateError) {
          console.error(`Error updating video ${video.id}:`, updateError);
          return { id: video.id, success: false, error: updateError };
        }

        return { id: video.id, success: true, available: isAvailable };
      } catch (error) {
        console.error(`Error checking video ${video.id}:`, error);
        return { id: video.id, success: false, error };
      }
    }));

    const successCount = updates.filter(u => u.success).length;
    const failureCount = updates.length - successCount;

    console.log(`Completed availability check. Success: ${successCount}, Failures: ${failureCount}`);

    return new Response(
      JSON.stringify({ 
        message: 'Video availability check completed',
        results: updates
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in video availability check:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});