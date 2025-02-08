
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MINIMUM_VIDEOS = 12;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const REFRESH_COOLDOWN = 5 * 60 * 1000; // 5 minutes cooldown between refresh attempts
const MAX_REQUESTS_PER_WINDOW = 100; // Maximum requests per window
const RATE_LIMIT_WINDOW = 3600; // Window in seconds (1 hour)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check rate limit
    const { data: isWithinLimit, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        p_function_name: 'check_section_counts',
        p_max_requests: MAX_REQUESTS_PER_WINDOW,
        p_window_seconds: RATE_LIMIT_WINDOW
      });

    if (rateLimitError) {
      console.error('Error checking rate limit:', rateLimitError);
      throw new Error('Failed to check rate limit');
    }

    if (!isWithinLimit) {
      console.log('Rate limit exceeded');
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          message: 'Too many requests, please try again later'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429,
        }
      );
    }

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
      // Check if refresh is already in progress
      const { data: refreshStatus } = await supabase
        .from('cached_videos')
        .select('refresh_in_progress, last_refresh_attempt')
        .eq('category', category)
        .limit(1)
        .single();

      if (refreshStatus?.refresh_in_progress && 
          refreshStatus.last_refresh_attempt && 
          Date.now() - new Date(refreshStatus.last_refresh_attempt).getTime() < 60000) {
        console.log(`Refresh already in progress for ${category}, skipping`);
        continue;
      }

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
      
      const refreshPromises = sectionsToRefresh.map(async category => {
        // Mark refresh as in progress
        await supabase.rpc('mark_refresh_status', { 
          p_category: category, 
          p_status: true 
        });

        let result;
        try {
          switch(category) {
            case 'Yoruba Movies':
              result = await supabase.functions.invoke('populate-yoruba');
              break;
            case 'Highly Rated':
              result = await supabase.functions.invoke('get-highly-rated');
              break;
            case 'New Release':
              result = await supabase.functions.invoke('get-new-releases');
              break;
            case 'Skits':
              result = await supabase.functions.invoke('get-skits');
              break;
          }
        } finally {
          // Mark refresh as complete
          await supabase.rpc('mark_refresh_status', { 
            p_category: category, 
            p_status: false 
          });
        }
        return { category, result };
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
