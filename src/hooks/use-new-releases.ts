import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { CachedMovie, Movie } from '@/types/movies';
import { transformCachedToMovie } from '@/utils/movie-transforms';

export const useNewReleases = () => {
  return useQuery({
    queryKey: ['newReleases'],
    queryFn: async () => {
      try {
        console.log('Fetching new releases...');
        const { data, error } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'New Release')
          .eq('is_available', true)
          .gt('expires_at', new Date().toISOString())
          .gt('published_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
          .order('published_at', { ascending: false })
          .limit(12);
        
        if (error) {
          console.error('Error fetching new releases:', error);
          return MOCK_MOVIES.trending;
        }
        
        if (!data || data.length === 0) {
          console.log('No new releases found, using mock data');
          return MOCK_MOVIES.trending;
        }

        const movies = transformCachedToMovie(data as CachedMovie[]);
        console.log(`Found ${movies.length} new releases`);
        return movies;
      } catch (error) {
        console.error('Error in new releases query:', error);
        return MOCK_MOVIES.trending;
      }
    },
    initialData: MOCK_MOVIES.trending,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};