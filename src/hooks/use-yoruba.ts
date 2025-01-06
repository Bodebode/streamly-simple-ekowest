import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { CachedMovie } from '@/types/movies';

export const useYorubaMovies = () => {
  return useQuery({
    queryKey: ['yorubaMovies'],
    queryFn: async () => {
      try {
        console.log('Fetching Yoruba movies from database...');
        const { data, error } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Yoruba Movies')
          .eq('is_available', true)
          .gt('expires_at', new Date().toISOString())
          .order('access_count', { ascending: false })
          .limit(12);
        
        if (error) {
          console.error('Error fetching Yoruba movies:', error);
          toast.error('Failed to load Yoruba movies');
          return MOCK_MOVIES.yoruba;
        }
        
        console.log('Found Yoruba movies in database:', data);
        
        if (!data || data.length === 0) {
          console.log('No Yoruba movies found in database, using mock data');
          return MOCK_MOVIES.yoruba;
        }

        // Filter videos that meet the criteria
        const validVideos = data.filter(video => {
          const criteria = video.criteria_met as { meets_criteria: boolean } | null;
          if (!criteria?.meets_criteria) {
            console.log('Video failed criteria:', video.title);
            return false;
          }
          return true;
        });

        if (validVideos.length === 0) {
          console.log('No valid Yoruba movies found after criteria check, using mock data');
          return MOCK_MOVIES.yoruba;
        }

        // Transform the data to match the Movie type
        return validVideos.map(video => ({
          id: parseInt(video.id),
          title: video.title,
          image: video.image,
          category: video.category,
          videoId: video.video_id
        }));

      } catch (error) {
        console.error('Error in Yoruba movies query:', error);
        toast.error('Failed to load Yoruba movies');
        return MOCK_MOVIES.yoruba;
      }
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    retry: 1,
  });
};