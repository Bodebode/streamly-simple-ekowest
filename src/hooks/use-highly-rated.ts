import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { CachedMovie, Movie } from '@/types/movies';
import { transformCachedToMovie } from '@/utils/movie-transforms';

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
          .gt('expires_at', new Date().toISOString())
          .order('access_count', { ascending: false })
          .limit(12);
        
        if (error) {
          console.error('Error fetching highly rated videos:', error);
          return MOCK_MOVIES.highlyRated;
        }
        
        if (!data || data.length === 0) {
          console.log('No highly rated videos found, using mock data');
          return MOCK_MOVIES.highlyRated;
        }

        // Transform cached videos to Movie type
        const movies = transformCachedToMovie(data as CachedMovie[]);
        console.log(`Found ${movies.length} highly rated videos`);
        return movies;
      } catch (error) {
        console.error('Error in highly rated query:', error);
        return MOCK_MOVIES.highlyRated;
      }
    },
    initialData: MOCK_MOVIES.highlyRated,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};