import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';

export const useHighlyRated = () => {
  return useQuery({
    queryKey: ['highlyRated'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Highly Rated')
          .eq('is_available', true)
          .gt('expires_at', new Date().toISOString())
          .order('access_count', { ascending: false })
          .limit(12);
        
        if (error) {
          console.error('Error fetching highly rated videos:', error);
          toast.error('Failed to load videos, showing placeholders');
          return MOCK_MOVIES.highlyRated;
        }
        
        if (!data || data.length === 0) {
          console.log('No highly rated videos found, using placeholders');
          return MOCK_MOVIES.highlyRated;
        }

        // Increment access count for retrieved videos
        data.forEach(video => {
          supabase.rpc('increment_access_count', { video_id: video.id });
        });

        return data;
      } catch (error) {
        console.error('Error in highly rated query:', error);
        toast.error('Failed to load videos, showing placeholders');
        return MOCK_MOVIES.highlyRated;
      }
    },
    staleTime: 1000 * 60 * 30, // Consider data fresh for 30 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    retry: 1,
  });
};