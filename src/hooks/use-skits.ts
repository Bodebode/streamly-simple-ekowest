import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';

export const useSkits = () => {
  return useQuery({
    queryKey: ['skits'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Skits')
          .eq('is_available', true)
          .gt('expires_at', new Date().toISOString())
          .order('access_count', { ascending: false })
          .limit(12);
        
        if (error) {
          console.error('Error fetching skits:', error);
          toast.error('Failed to load skits');
          return MOCK_MOVIES.skits;
        }

        if (!data || data.length === 0) {
          return MOCK_MOVIES.skits;
        }

        // Increment access count for retrieved videos
        data.forEach(video => {
          supabase.rpc('increment_access_count', { video_id: video.id });
        });

        return data;
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