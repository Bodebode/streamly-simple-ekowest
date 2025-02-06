
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MINIMUM_VIDEOS = 12;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First check if we've refreshed content recently
    const { data: lastRefresh } = await supabase
      .from('query_metrics')
      .select('created_at')
      .eq('query_name', 'content_refresh')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const now = new Date();
    const lastRefreshTime = lastRefresh?.created_at ? new Date(lastRefresh.created_at) : null;
    const needsRefresh = !lastRefreshTime || (now.getTime() - new Date(lastRefreshTime).getTime() > CACHE_DURATION);

    console.log('Last refresh:', lastRefreshTime);
    console.log('Needs refresh:', needsRefresh);

    if (needsRefresh) {
      // Log the refresh attempt
      await supabase
        .from('query_metrics')
        .insert({
          query_name: 'content_refresh',
          category: 'content',
          execution_time: 0,
          rows_affected: 0
        });

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
        
        if (!count || count < MINIMUM_VIDEOS) {
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
    }

    return new Response(
      JSON.stringify({ 
        message: needsRefresh ? 'Content is up to date' : 'Content was refreshed recently',
        last_refresh: lastRefreshTime
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
