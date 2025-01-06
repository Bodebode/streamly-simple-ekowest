import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface CachedVideo {
  id: string;
  title: string;
  image: string;
  category: string;
  video_id: string;
  views: number;
  comments: number;
  cached_at: string;
  expires_at: string;
  access_count: number;
  retry_count: number;
  last_retry: string | null;
  last_error: string | null;
}

export const initSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(supabaseUrl, supabaseKey);
};

export const fetchCachedVideos = async (supabase: any) => {
  console.log('Attempting to fetch cached videos');
  const { data: cachedVideos, error: cacheError } = await supabase
    .from('cached_videos')
    .select('*')
    .eq('category', 'Highly Rated')
    .gt('expires_at', new Date().toISOString())
    .order('access_count', { ascending: false })
    .limit(12);

  if (cacheError) {
    console.error('Cache fetch error:', cacheError);
    return null;
  }

  if (cachedVideos?.length > 0) {
    console.log(`Found ${cachedVideos.length} cached videos`);
    cachedVideos.forEach(video => {
      supabase.rpc('increment_access_count', { video_id: video.id });
    });
  }

  return cachedVideos;
};

export const fetchExpiredCache = async (supabase: any) => {
  console.log('Fetching expired cache as fallback');
  const { data: expiredCache } = await supabase
    .from('cached_videos')
    .select('*')
    .eq('category', 'Highly Rated')
    .order('cached_at', { ascending: false })
    .limit(12);

  return expiredCache;
};

export const truncateTitle = (title: string): string => {
  const slashIndex = title.search(/\/?[^/]*\//)
  const separatorIndex = title.search(/[-|(]/)
  const cutoffIndex = (slashIndex !== -1 && (separatorIndex === -1 || slashIndex < separatorIndex))
    ? slashIndex
    : separatorIndex;
  return cutoffIndex !== -1 ? title.substring(0, cutoffIndex).trim() : title;
};