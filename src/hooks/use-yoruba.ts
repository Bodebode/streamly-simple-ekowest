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
        console.log('Starting Yoruba movies fetch with criteria validation...');
        
        // First attempt with all criteria
        const { data: strictVideos, error: strictError } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Yoruba Movies')
          .eq('is_available', true)
          .eq('is_embeddable', true)
          .gt('expires_at', new Date().toISOString())
          .gte('duration', 2700)
          .gte('views', 100000)
          .in('video_quality', ['1080p', '2160p', '1440p'])
          .order('access_count', { ascending: false })
          .limit(12);

        if (strictError) {
          console.error('Error fetching Yoruba movies:', strictError);
          toast.error('Failed to load Yoruba movies');
          return MOCK_MOVIES.yoruba;
        }

        console.log(`Found ${strictVideos?.length || 0} videos meeting all criteria`);

        // If no strict results, try with relaxed quality
        if (!strictVideos || strictVideos.length === 0) {
          console.log('No videos meet strict criteria. Attempting with relaxed quality...');
          
          const { data: relaxedQualityVideos, error: relaxedQualityError } = await supabase
            .from('cached_videos')
            .select('*')
            .eq('category', 'Yoruba Movies')
            .eq('is_available', true)
            .eq('is_embeddable', true)
            .gt('expires_at', new Date().toISOString())
            .gte('duration', 2700)
            .gte('views', 100000)
            .order('access_count', { ascending: false })
            .limit(12);

          if (relaxedQualityError) {
            console.error('Error fetching with relaxed quality:', relaxedQualityError);
            return MOCK_MOVIES.yoruba;
          }

          console.log(`Found ${relaxedQualityVideos?.length || 0} videos with relaxed quality criteria`);

          // If still no results, try with relaxed duration
          if (!relaxedQualityVideos || relaxedQualityVideos.length === 0) {
            console.log('No videos meet relaxed quality criteria. Attempting with relaxed duration...');
            
            const { data: relaxedDurationVideos, error: relaxedDurationError } = await supabase
              .from('cached_videos')
              .select('*')
              .eq('category', 'Yoruba Movies')
              .eq('is_available', true)
              .eq('is_embeddable', true)
              .gt('expires_at', new Date().toISOString())
              .gte('views', 100000)
              .order('access_count', { ascending: false })
              .limit(12);

            if (relaxedDurationError) {
              console.error('Error fetching with relaxed duration:', relaxedDurationError);
              return MOCK_MOVIES.yoruba;
            }

            console.log(`Found ${relaxedDurationVideos?.length || 0} videos with relaxed duration criteria`);

            if (!relaxedDurationVideos || relaxedDurationVideos.length === 0) {
              console.log('No videos found with any criteria, using mock data');
              toast.info('Showing sample content while we gather more high-quality videos');
              return MOCK_MOVIES.yoruba;
            }

            toast.info('Showing available content with relaxed duration criteria');
            return transformVideosToMovies(relaxedDurationVideos);
          }

          toast.info('Showing available content with relaxed quality criteria');
          return transformVideosToMovies(relaxedQualityVideos);
        }

        // Transform and return the strict results
        return transformVideosToMovies(strictVideos);

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

const transformVideosToMovies = (videos: CachedMovie[]) => {
  return videos.map((video, index) => ({
    id: index + 1,
    title: video.title,
    image: video.image,
    category: video.category,
    videoId: video.video_id
  }));
};