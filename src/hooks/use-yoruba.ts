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
        console.log('Starting Yoruba movies fetch...');
        const { data: cachedVideos, error } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Yoruba Movies')
          .eq('is_available', true)  // Must be marked as available
          .eq('is_embeddable', true)  // Must be embeddable
          .gt('expires_at', new Date().toISOString())  // Must not be expired
          .gte('duration', 2700)  // At least 45 minutes (2700 seconds)
          .gte('views', 100000)  // At least 100,000 views
          .in('video_quality', ['1080p', '2160p', '1440p'])  // Must be high quality
          .order('access_count', { ascending: false })
          .limit(12);
        
        if (error) {
          console.error('Error fetching Yoruba movies:', error);
          toast.error('Failed to load Yoruba movies');
          return MOCK_MOVIES.yoruba;
        }

        console.log('Total Yoruba movies in database:', cachedVideos?.length);
        
        if (!cachedVideos || cachedVideos.length === 0) {
          console.log('No cached videos found or cache expired, triggering population...');
          
          const { error: populationError } = await supabase.functions.invoke('populate-yoruba');
          
          if (populationError) {
            console.error('Error triggering population:', populationError);
            toast.error('Failed to refresh video cache');
            return MOCK_MOVIES.yoruba;
          }
          
          return MOCK_MOVIES.yoruba;
        }

        // Transform the cached videos to Movie format
        const movies = cachedVideos.map((video, index) => ({
          id: index + 1,
          title: video.title,
          image: video.image,
          category: video.category,
          videoId: video.video_id
        }));

        console.log('Final valid movies count:', movies.length);
        
        if (movies.length === 0) {
          console.log('No videos found, using mock data');
          return MOCK_MOVIES.yoruba;
        }

        // Increment access count for cached videos
        movies.forEach(movie => {
          if (movie.videoId) {
            supabase.rpc('increment_access_count', { video_id: movie.videoId });
          }
        });

        return movies;

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