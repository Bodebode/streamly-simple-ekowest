import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get videos that haven't been checked in the last hour
    const { data: videos, error: fetchError } = await supabase
      .from('cached_videos')
      .select('id, video_id')
      .or('last_availability_check.is.null,last_availability_check.lt.' + new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .limit(50) // Process in batches to manage API quota

    if (fetchError) {
      console.error('Error fetching videos:', fetchError)
      throw fetchError
    }

    if (!videos || videos.length === 0) {
      return new Response(JSON.stringify({ message: 'No videos to check' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log(`Checking availability for ${videos.length} videos`)

    const unavailableVideos: string[] = []
    
    // Check each video's availability using YouTube's oEmbed endpoint
    // This doesn't count against our API quota
    for (const video of videos) {
      try {
        const response = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${video.video_id}&format=json`
        )
        
        const isAvailable = response.ok

        await supabase
          .from('cached_videos')
          .update({
            is_available: isAvailable,
            last_availability_check: new Date().toISOString(),
            last_error: isAvailable ? null : 'Video unavailable',
          })
          .eq('id', video.id)

        if (!isAvailable) {
          console.log(`Video ${video.video_id} is no longer available`)
          unavailableVideos.push(video.video_id)
        }
      } catch (error) {
        console.error(`Error checking video ${video.video_id}:`, error)
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Availability check completed',
        checked: videos.length,
        unavailable: unavailableVideos.length,
        unavailableIds: unavailableVideos,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in check-video-availability:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})