import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { deepseekService } from '@/services/deepseek';

export const useHighlyRated = () => {
  return useQuery({
    queryKey: ['highlyRated'],
    queryFn: async () => {
      try {
        console.log('Fetching highly rated videos...');
        const { data: cachedVideos, error } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Highly Rated')
          .eq('is_available', true)
          .gt('views', 100000)
          .gt('like_ratio', 0.6)
          .gt('expires_at', new Date().toISOString())
          .order('views', { ascending: false })
          .limit(12);

        if (error) {
          console.error('Error fetching highly rated videos:', error);
          throw error;
        }

        if (!cachedVideos || cachedVideos.length === 0) {
          console.log('No highly rated videos found, using AI recommendations');
          
          const prompt = `Generate recommendations for highly rated Nollywood movies. 
            Consider factors like: view count, like ratio, and cultural relevance. 
            Focus on movies that have received positive audience feedback.`;

          const aiRecommendations = await deepseekService.generateResponse(prompt);
          console.log('AI Recommendations:', aiRecommendations);

          // Fallback to mock data if AI recommendations fail
          if (!aiRecommendations) {
            console.log('Using mock data as fallback');
            return MOCK_MOVIES.highlyRated;
          }

          // Process AI recommendations here
          // For now, return mock data as fallback
          return MOCK_MOVIES.highlyRated;
        }

        console.log(`Found ${cachedVideos.length} highly rated videos`);
        
        return cachedVideos.map(video => ({
          id: video.id,
          title: video.title,
          image: video.image,
          category: video.category,
          videoId: video.video_id
        }));
      } catch (error) {
        console.error('Error in highly rated query:', error);
        toast.error('Failed to load videos, showing placeholders');
        return MOCK_MOVIES.highlyRated;
      }
    },
    staleTime: 1000 * 60 * 30, // Consider data fresh for 30 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    retry: 1,
  });
};