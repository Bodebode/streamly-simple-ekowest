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
          .eq('is_available', true)
          .gt('expires_at', new Date().toISOString());
        
        if (error) {
          console.error('Error fetching Yoruba movies:', error);
          toast.error('Failed to load Yoruba movies');
          return MOCK_MOVIES.yoruba;
        }

        console.log('Raw cached videos count:', cachedVideos?.length);
        
        if (!cachedVideos || cachedVideos.length === 0) {
          console.log('No cached videos found, using mock data');
          return MOCK_MOVIES.yoruba;
        }

        // Transform and validate the data with detailed logging
        const movies = cachedVideos
          .filter(video => {
            const criteria = video.criteria_met as { 
              essential: {
                duration: boolean;
                quality: boolean;
                views: boolean;
              };
              non_essential: {
                title_description: boolean;
                channel: boolean;
                language: boolean;
                distribution: boolean;
                upload_date: boolean;
                like_ratio: boolean;
                comments: boolean;
                cultural_elements: boolean;
                storytelling: boolean;
                settings: boolean;
              };
              meets_criteria: boolean;
            } | null;

            if (!criteria?.meets_criteria) {
              console.log('\nVideo failed criteria check:', video.title);
              console.log('Essential criteria results:');
              if (criteria) {
                console.log(`Duration (${video.duration}s): ${criteria.essential.duration ? 'PASS' : 'FAIL'} (need ≥1800s)`);
                console.log(`Quality (${video.video_quality}): ${criteria.essential.quality ? 'PASS' : 'FAIL'} (need 1080p+)`);
                console.log(`Views (${video.views}): ${criteria.essential.views ? 'PASS' : 'FAIL'} (need ≥400000)`);
                
                const passedNonEssential = Object.entries(criteria.non_essential)
                  .filter(([_, passed]) => passed).length;
                console.log(`Non-essential criteria passed: ${passedNonEssential}/10 (need at least 4)`);
                
                if (video.like_ratio) {
                  console.log(`Like ratio: ${video.like_ratio} (target: ≥0.8)`);
                }
              }
              return false;
            }
            return true;
          })
          .map((video, index) => ({
            id: index + 1,
            title: video.title,
            image: video.image,
            category: video.category,
            videoId: video.video_id
          }));

        console.log('\nFinal valid movies count:', movies.length);
        if (movies.length > 0) {
          console.log('First valid movie:', movies[0].title);
        }

        if (movies.length === 0) {
          console.log('No videos passed criteria, using mock data');
          return MOCK_MOVIES.yoruba;
        }

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