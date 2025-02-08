
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MINIMUM_VIDEOS = 12;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const REFRESH_COOLDOWN = 5 * 60 * 1000; // 5 minutes cooldown between refresh attempts

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get current refresh window (0-11)
    const currentHour = new Date().getHours();
    const currentWindow = Math.floor(currentHour / 2);
    console.log('Current refresh window:', currentWindow);

    // First check if we've refreshed content recently
    const { data: lastRefresh, error: refreshError } = await supabase
      .from('query_metrics')
      .select('created_at')
      .eq('query_name', 'content_refresh')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (refreshError && refreshError.code !== 'PGRST116') {
      console.error('Error checking last refresh:', refreshError);
      throw refreshError;
    }

    const now = new Date();
    const lastRefreshTime = lastRefresh?.created_at ? new Date(lastRefresh.created_at) : null;
    
    if (lastRefreshTime && (now.getTime() - new Date(lastRefreshTime).getTime() < REFRESH_COOLDOWN)) {
      console.log('Within cooldown period, skipping refresh check');
      return new Response(
        JSON.stringify({ 
          message: 'Content was refreshed recently',
          last_refresh: lastRefreshTime,
          next_refresh_allowed: new Date(lastRefreshTime.getTime() + REFRESH_COOLDOWN)
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Check counts for each category but only for the current refresh window
    const categories = ['Highly Rated', 'Skits', 'New Release', 'Yoruba Movies'];
    const sectionsToRefresh = [];

    for (const category of categories) {
      const { count, error } = await supabase
        .from('cached_videos')
        .select('*', { count: 'exact', head: true })
        .eq('category', category)
        .eq('refresh_window', currentWindow)
        .eq('is_available', true)
        .gt('expires_at', new Date().toISOString());

      if (error) {
        console.error(`Error checking count for ${category}:`, error);
        continue;
      }

      console.log(`Category ${category} has ${count} videos in refresh window ${currentWindow}`);
      
      if (!count || count < MINIMUM_VIDEOS) {
        console.log(`${category} needs refresh (only ${count} videos in window ${currentWindow})`);
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

      const results = await Promise.allSettled(refreshPromises);
      const refreshResults = results.map((result, index) => ({
        section: sectionsToRefresh[index],
        status: result.status,
        ...(result.status === 'rejected' ? { error: result.reason } : {})
      }));
      
      return new Response(
        JSON.stringify({ 
          message: 'Content refresh completed', 
          refreshed_sections: sectionsToRefresh,
          results: refreshResults,
          refresh_window: currentWindow
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: 'Content is up to date',
        refresh_window: currentWindow
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
