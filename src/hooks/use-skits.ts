import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';

const removeDuplicates = (videos: any[]): any[] => {
  const seen = new Set<string>();
  return videos.filter(video => {
    const duplicate = seen.has(video.video_id);
    seen.add(video.video_id);
    return !duplicate && video.video_id && video.is_available;
  }).slice(0, 12);
};

export const useSkits = () => {
  return useQuery({
    queryKey: ['skits'],
    queryFn: async () => {
      try {
        const startTime = performance.now();
        
        const { data, error, count } = await supabase
          .from('cached_videos')
          .select('*', { count: 'exact' })
          .eq('category', 'Skits')
          .eq('is_available', true)
          .gt('expires_at', new Date().toISOString())
          .order('access_count', { ascending: false })
          .limit(24); // Increased limit to ensure enough unique videos
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        // Log query metrics
        await supabase.rpc('log_query_metrics', {
          p_query_name: 'fetch_skits',
          p_execution_time: executionTime,
          p_rows_affected: count || 0,
          p_category: 'Skits',
          p_user_id: (await supabase.auth.getUser()).data.user?.id
        });

        if (error) {
          console.error('Error fetching skits:', error);
          toast.error('Failed to load skits');
          return MOCK_MOVIES.skits;
        }

        if (!data || data.length === 0) {
          console.log('No skits found, using mock data');
          return MOCK_MOVIES.skits;
        }

        console.log(`Fetched skits in ${executionTime.toFixed(2)}ms`);

        // Filter for unique videos and ensure minimum count
        const uniqueVideos = removeDuplicates(data);
        
        if (uniqueVideos.length < 12) {
          console.log('Not enough unique skits, using mock data');
          return MOCK_MOVIES.skits;
        }

        // Increment access count for retrieved videos
        uniqueVideos.forEach(video => {
          supabase.rpc('increment_access_count', { video_id: video.id });
        });

        return uniqueVideos;
      } catch (error) {
        console.error('Error in skits query:', error);
        toast.error('Failed to load skits');
        return MOCK_MOVIES.skits;
      }
    },
    staleTime: 1000 * 60 * 30, // Consider data fresh for 30 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    retry: 1,
  });
};