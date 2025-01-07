import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { CachedMovie, Movie } from '@/types/movies';

export const useYorubaMovies = () => {
  return useQuery({
    queryKey: ['yorubaMovies'],
    queryFn: async () => {
      try {
        console.log('Starting Yoruba movies fetch with enhanced criteria validation...');
        
        // First attempt with all strict criteria including cultural elements
        const { data: strictVideos, error: strictError } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Yoruba Movies')
          .eq('is_available', true)
          .eq('is_embeddable', true)
          .gt('expires_at', new Date().toISOString())
          .gte('duration', 2700)
          .gte('views', 100000)
          .gte('like_ratio', 0.005)
          .eq('setting_authenticity', true)
          .not('cultural_elements', 'is', null)
          .in('video_quality', ['1080p', '2160p', '1440p'])
          .order('access_count', { ascending: false })
          .limit(12);

        if (strictError) {
          console.error('Error fetching Yoruba movies:', strictError);
          toast.error('Failed to load Yoruba movies');
          return MOCK_MOVIES.yoruba;
        }

        console.log(`Found ${strictVideos?.length || 0} videos meeting all enhanced criteria`);

        // If we have strict results but less than optimal, log for monitoring
        if (strictVideos && strictVideos.length > 0 && strictVideos.length < 8) {
          console.warn(`Only ${strictVideos.length} videos meet strict criteria. Consider content acquisition.`);
        }

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
            .gte('like_ratio', 0.005)
            .eq('setting_authenticity', true)
            .not('cultural_elements', 'is', null)
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
              .gte('like_ratio', 0.005)
              .eq('setting_authenticity', true)
              .not('cultural_elements', 'is', null)
              .order('access_count', { ascending: false })
              .limit(12);

            if (relaxedDurationError) {
              console.error('Error fetching with relaxed duration:', relaxedDurationError);
              return MOCK_MOVIES.yoruba;
            }

            console.log(`Found ${relaxedDurationVideos?.length || 0} videos with relaxed duration criteria`);

            if (!relaxedDurationVideos || relaxedDurationVideos.length === 0) {
              console.log('No videos found with any criteria, using mock data');
              toast.info('Showing sample content while we gather more high-quality videos', {
                duration: 5000,
              });
              return MOCK_MOVIES.yoruba;
            }

            toast.info('Showing available content with relaxed duration criteria', {
              duration: 5000,
            });
            return transformVideosToMovies(relaxedDurationVideos as unknown as CachedMovie[]);
          }

          toast.info('Showing available content with relaxed quality criteria', {
            duration: 5000,
          });
          return transformVideosToMovies(relaxedQualityVideos as unknown as CachedMovie[]);
        }

        // Transform and return the strict results
        return transformVideosToMovies(strictVideos as unknown as CachedMovie[]);

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