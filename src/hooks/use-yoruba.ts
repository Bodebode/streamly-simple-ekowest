import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { CachedMovie, Movie } from '@/types/movies';
import { buildYorubaQuery } from '@/utils/query-builder';
import { YORUBA_QUALITY_CRITERIA, YORUBA_DURATION_CRITERIA } from '@/constants/yoruba-criteria';
import { STRICT_CRITERIA } from '@/constants/video-criteria';

export const useYorubaMovies = () => {
  return useQuery({
    queryKey: ['yorubaMovies'],
    queryFn: async () => {
      try {
        console.log('Starting Yoruba movies fetch with updated criteria...');
        
        // Try with quality criteria first (more lenient now)
        const { data: qualityVideos, error: qualityError } = await buildYorubaQuery(
          supabase,
          YORUBA_QUALITY_CRITERIA
        );

        if (qualityError) {
          console.error('Error fetching with quality criteria:', qualityError);
          return MOCK_MOVIES.yoruba;
        }

        if (qualityVideos && qualityVideos.length >= 8) {
          console.log('✅ Using QUALITY criteria - found', qualityVideos.length, 'videos');
          console.log('Sample video stats:', qualityVideos[0]);
          return transformVideosToMovies(qualityVideos as unknown as CachedMovie[]);
        }

        console.log('Quality criteria not met, trying DURATION criteria:', YORUBA_DURATION_CRITERIA);
        // Try with duration criteria
        const { data: durationVideos, error: durationError } = await buildYorubaQuery(
          supabase,
          YORUBA_DURATION_CRITERIA
        );

        if (durationError) {
          console.error('Error fetching with duration criteria:', durationError);
          return MOCK_MOVIES.yoruba;
        }

        if (durationVideos && durationVideos.length > 0) {
          console.log('✅ Using DURATION criteria - found', durationVideos.length, 'videos');
          console.log('Sample video stats:', durationVideos[0]);
          toast.info('Showing available Yoruba content', {
            duration: 5000,
          });
          return transformVideosToMovies(durationVideos as unknown as CachedMovie[]);
        }

        console.log('❌ No videos found with any criteria, using mock data');
        return MOCK_MOVIES.yoruba;

      } catch (error) {
        console.error('Error in Yoruba movies query:', error);
        toast.error('Failed to load Yoruba movies');
        return MOCK_MOVIES.yoruba;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
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