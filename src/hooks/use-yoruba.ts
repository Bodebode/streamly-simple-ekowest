import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { CachedMovie, Movie } from '@/types/movies';
import { buildYorubaQuery } from '@/utils/query-builder';
import { 
  STRICT_CRITERIA, 
  RELAXED_QUALITY_CRITERIA, 
  RELAXED_DURATION_CRITERIA 
} from '@/constants/video-criteria';

export const useYorubaMovies = () => {
  return useQuery({
    queryKey: ['yorubaMovies'],
    queryFn: async () => {
      try {
        console.log('Starting Yoruba movies fetch with enhanced criteria validation...');
        
        // Try with strict criteria first
        const { data: strictVideos, error: strictError } = await buildYorubaQuery(
          supabase,
          STRICT_CRITERIA
        );

        if (strictError) {
          console.error('Error fetching Yoruba movies:', strictError);
          toast.error('Failed to load Yoruba movies');
          return MOCK_MOVIES.yoruba;
        }

        console.log(`Found ${strictVideos?.length || 0} videos meeting all enhanced criteria`);

        if (strictVideos && strictVideos.length > 0) {
          if (strictVideos.length < 8) {
            console.warn(`Only ${strictVideos.length} videos meet strict criteria. Consider content acquisition.`);
          }
          return transformVideosToMovies(strictVideos as unknown as CachedMovie[]);
        }

        // Try with relaxed quality criteria
        console.log('No videos meet strict criteria. Attempting with relaxed quality...');
        const { data: relaxedQualityVideos, error: relaxedQualityError } = await buildYorubaQuery(
          supabase,
          RELAXED_QUALITY_CRITERIA
        );

        if (relaxedQualityError) {
          console.error('Error fetching with relaxed quality:', relaxedQualityError);
          return MOCK_MOVIES.yoruba;
        }

        if (relaxedQualityVideos && relaxedQualityVideos.length > 0) {
          toast.info('Showing available content with relaxed quality criteria', {
            duration: 5000,
          });
          return transformVideosToMovies(relaxedQualityVideos as unknown as CachedMovie[]);
        }

        // Try with relaxed duration criteria
        console.log('No videos meet relaxed quality criteria. Attempting with relaxed duration...');
        const { data: relaxedDurationVideos, error: relaxedDurationError } = await buildYorubaQuery(
          supabase,
          RELAXED_DURATION_CRITERIA
        );

        if (relaxedDurationError) {
          console.error('Error fetching with relaxed duration:', relaxedDurationError);
          return MOCK_MOVIES.yoruba;
        }

        if (relaxedDurationVideos && relaxedDurationVideos.length > 0) {
          toast.info('Showing available content with relaxed duration criteria', {
            duration: 5000,
          });
          return transformVideosToMovies(relaxedDurationVideos as unknown as CachedMovie[]);
        }

        console.log('No videos found with any criteria, using mock data');
        toast.info('Showing sample content while we gather more high-quality videos', {
          duration: 5000,
        });
        return MOCK_MOVIES.yoruba;

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

const transformVideosToMovies = (videos: CachedMovie[]): Movie[] => {
  return videos.map((video, index) => ({
    id: index + 1,
    title: video.title,
    image: video.image,
    category: video.category,
    videoId: video.video_id
  }));
};