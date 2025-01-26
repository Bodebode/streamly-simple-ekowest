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
        const { data, error } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Skits')
          .eq('is_available', true)
          .gt('expires_at', new Date().toISOString())
          .order('access_count', { ascending: false })
          .limit(24); // Increased limit to ensure enough unique videos
        
        if (error) {
          console.error('Error fetching skits:', error);
          toast.error('Failed to load skits');
          return MOCK_MOVIES.skits;
        }

        if (!data || data.length === 0) {
          console.log('No skits found, using mock data');
          return MOCK_MOVIES.skits;
        }

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