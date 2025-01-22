import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching skits from cached_videos table...')

    // Query cached videos for skits
    const { data: skits, error } = await supabaseClient
      .from('cached_videos')
      .select('*')
      .eq('category', 'Skits')
      .eq('is_available', true)
      .gt('expires_at', new Date().toISOString())
      .order('access_count', { ascending: false })
      .limit(12)

    if (error) {
      console.error('Error fetching skits:', error)
      throw error
    }

    console.log(`Found ${skits?.length ?? 0} skits`)

    // If no cached videos found, return mock data
    if (!skits || skits.length === 0) {
      const { data: mockSkits } = await supabaseClient
        .from('cached_videos')
        .insert([
          {
            title: "Funny Moments Compilation",
            image: "https://img.youtube.com/vi/3aQFM1ZtMG0/maxresdefault.jpg",
            category: "Skits",
            video_id: "3aQFM1ZtMG0",
            is_available: true,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          }
        ])
        .select()

      console.log('Returning mock skits data')
      return new Response(
        JSON.stringify(mockSkits),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Return the found skits
    return new Response(
      JSON.stringify(skits),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in get-skits function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})