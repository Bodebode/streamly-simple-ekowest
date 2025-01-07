import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { placeholderNewReleases } from '@/data/mockMovies';

export const useNewReleases = () => {
  return useQuery({
    queryKey: ['newReleases'],
    queryFn: async () => {
      try {
        // Get current date and dates for filtering
        const now = new Date();
        const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
        const fiveDaysAgo = new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000));

        // First, try to get the latest NollyFamilyTV video
        const { data: nollyFamilyVideo, error: nollyError } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'New Release')
          .eq('is_available', true)
          .eq('is_embeddable', true)
          .gte('views', 20000)
          .in('video_quality', ['1080p', '2160p', '1440p'])
          .gte('duration', 3600) // More than 1 hour
          .gte('published_at', fiveDaysAgo.toISOString())
          .ilike('channel_metadata->channel_id', '%nollyfamilytv%')
          .order('published_at', { ascending: false })
          .limit(1);

        // Then get other new releases
        const { data: otherVideos, error: othersError } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'New Release')
          .eq('is_available', true)
          .eq('is_embeddable', true)
          .gte('views', 20000)
          .in('video_quality', ['1080p', '2160p', '1440p'])
          .gte('published_at', threeDaysAgo.toISOString())
          .order('published_at', { ascending: false })
          .limit(11);

        if (nollyError || othersError) {
          console.error('Error fetching new releases:', nollyError || othersError);
          toast.error('Failed to load new releases, showing placeholders');
          return placeholderNewReleases;
        }

        let finalVideos = [];

        // Add NollyFamilyTV video first if available
        if (nollyFamilyVideo && nollyFamilyVideo.length > 0) {
          finalVideos.push(nollyFamilyVideo[0]);
        }

        // Add other videos, filtering out any potential duplicates
        if (otherVideos) {
          const filteredOthers = otherVideos.filter(video => 
            !finalVideos.some(v => v.video_id === video.video_id)
          );
          finalVideos = [...finalVideos, ...filteredOthers];
        }

        // If we don't have enough videos, pad with placeholders
        if (finalVideos.length < 12) {
          const neededPlaceholders = 12 - finalVideos.length;
          return [...finalVideos, ...placeholderNewReleases.slice(0, neededPlaceholders)];
        }

        // Increment access count for retrieved videos
        finalVideos.forEach(video => {
          supabase.rpc('increment_access_count', { video_id: video.id });
        });

        return finalVideos;
      } catch (error) {
        console.error('Error in new releases query:', error);
        toast.error('Failed to load new releases, showing placeholders');
        return placeholderNewReleases;
      }
    },
    staleTime: 1000 * 60 * 15, // Consider data fresh for 15 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 1,
  });
};