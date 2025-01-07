import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MINIMUM_VIDEOS = 12;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check counts for each category
    const categories = ['Highly Rated', 'Skits', 'New Release', 'Yoruba Movies'];
    const sectionsToRefresh = [];

    for (const category of categories) {
      const { count, error } = await supabase
        .from('cached_videos')
        .select('*', { count: 'exact', head: true })
        .eq('category', category)
        .eq('is_available', true)
        .gt('expires_at', new Date().toISOString());

      if (error) {
        console.error(`Error checking count for ${category}:`, error);
        continue;
      }

      console.log(`Category ${category} has ${count} videos`);
      
      if (count < MINIMUM_VIDEOS) {
        console.log(`${category} needs refresh (only ${count} videos)`);
        sectionsToRefresh.push(category);
      }
    }

    if (sectionsToRefresh.length > 0) {
      console.log('Refreshing sections:', sectionsToRefresh);
      
      const refreshPromises = sectionsToRefresh.map(category => {
        switch(category) {
          case 'Yoruba Movies':
            return supabase.functions.invoke('populate-yoruba');
          case 'Highly Rated':
            return supabase.functions.invoke('get-highly-rated');
          case 'New Release':
            return supabase.functions.invoke('get-new-releases');
          case 'Skits':
            return supabase.functions.invoke('get-skits');
          default:
            return Promise.resolve();
        }
      });

      await Promise.allSettled(refreshPromises);
      
      return new Response(
        JSON.stringify({ 
          message: 'Content refresh completed', 
          refreshed_sections: sectionsToRefresh 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ message: 'All sections have sufficient content' }),
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