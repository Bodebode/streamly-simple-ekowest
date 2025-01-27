import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';

export const useHighlyRated = () => {
  return useQuery({
    queryKey: ['highlyRated'],
    queryFn: async () => {
      try {
        console.log('Fetching highly rated videos...');
        const { data, error } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Highly Rated')
          .eq('is_available', true)
          .gt('views', 100000) // Lowered threshold to ensure we get some results
          .gt('like_ratio', 0.6) // Adjusted ratio to be more lenient
          .gt('expires_at', new Date().toISOString())
          .order('views', { ascending: false })
          .limit(12);
        
        if (error) {
          console.error('Error fetching highly rated videos:', error);
          toast.error('Failed to load videos, showing placeholders');
          return MOCK_MOVIES.highlyRated;
        }
        
        if (!data || data.length === 0) {
          console.log('No highly rated videos found, using mock data');
          return MOCK_MOVIES.highlyRated;
        }

        console.log(`Found ${data.length} highly rated videos:`, data);
        
        // Transform cached videos to match Movie interface
        const transformedData = data.map(video => ({
          id: video.id,
          title: video.title,
          image: video.image,
          category: video.category,
          videoId: video.video_id
        }));

        // Increment access count for retrieved videos
        data.forEach(video => {
          supabase.rpc('increment_access_count', { video_id: video.id });
        });

        return transformedData;
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