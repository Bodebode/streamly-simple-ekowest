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
        console.log('Starting Yoruba movies fetch with enhanced criteria validation...');
        
        // Try with strict criteria first
        const { data: strictVideos, error: strictError } = await buildYorubaQuery(
          supabase,
          { ...STRICT_CRITERIA, limit: 24 } // Increased limit to ensure we get enough unique videos
        );

        if (strictError) {
          console.error('Error fetching Yoruba movies:', strictError);
          toast.error('Failed to load Yoruba movies');
          return MOCK_MOVIES.yoruba;
        }

        if (strictVideos && strictVideos.length >= 12) {
          const uniqueVideos = removeDuplicates(strictVideos as unknown as CachedMovie[]);
          if (uniqueVideos.length >= 12) {
            console.log(`Found ${uniqueVideos.length} unique videos with strict criteria`);
            return transformVideosToMovies(uniqueVideos);
          }
        }

        // Try with Yoruba quality criteria
        const { data: qualityVideos, error: qualityError } = await buildYorubaQuery(
          supabase,
          { ...YORUBA_QUALITY_CRITERIA, limit: 24 }
        );

        if (qualityError) {
          console.error('Error fetching with quality criteria:', qualityError);
          return MOCK_MOVIES.yoruba;
        }

        if (qualityVideos) {
          const uniqueQualityVideos = removeDuplicates(qualityVideos as unknown as CachedMovie[]);
          if (uniqueQualityVideos.length >= 12) {
            console.log(`Found ${uniqueQualityVideos.length} unique videos with quality criteria`);
            return transformVideosToMovies(uniqueQualityVideos);
          }
        }

        // Try with Yoruba duration criteria
        const { data: durationVideos, error: durationError } = await buildYorubaQuery(
          supabase,
          { ...YORUBA_DURATION_CRITERIA, limit: 24 }
        );

        if (durationError) {
          console.error('Error fetching with duration criteria:', durationError);
          return MOCK_MOVIES.yoruba;
        }

        if (durationVideos) {
          const uniqueDurationVideos = removeDuplicates(durationVideos as unknown as CachedMovie[]);
          if (uniqueDurationVideos.length > 0) {
            console.log(`Found ${uniqueDurationVideos.length} unique videos with duration criteria`);
            if (uniqueDurationVideos.length < 12) {
              toast.info('Showing available content with relaxed criteria', {
                duration: 5000,
              });
            }
            return transformVideosToMovies(uniqueDurationVideos);
          }
        }

        console.log('No videos found with any criteria, using mock data');
        return MOCK_MOVIES.yoruba;

      } catch (error) {
        console.error('Error in Yoruba movies query:', error);
        toast.error('Failed to load Yoruba movies');
        return MOCK_MOVIES.yoruba;
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });
};

const removeDuplicates = (videos: CachedMovie[]): CachedMovie[] => {
  const seen = new Set<string>();
  return videos.filter(video => {
    const duplicate = seen.has(video.video_id);
    seen.add(video.video_id);
    return !duplicate && video.video_id && video.is_available;
  }).slice(0, 12); // Ensure we only return up to 12 videos
};

const transformVideosToMovies = (videos: CachedMovie[]): Movie[] => {
  return videos.map((video) => ({
    id: video.id,
    title: video.title,
    image: video.image,
    category: video.category,
    videoId: video.video_id
  }));
};