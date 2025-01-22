import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { placeholderNewReleases } from '@/data/placeholder-new-releases';
import { isValidNewRelease } from '@/utils/video-validation';
import { CachedVideo } from '@/types/video';
import { Movie } from '@/types/movies';

const fetchNewReleases = async (): Promise<Movie[]> => {
  try {
    const { data, error } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'New Release')
      .eq('is_available', true)
      .gt('expires_at', new Date().toISOString())
      .order('cached_at', { ascending: false });

    if (error) {
      console.error('Error fetching new releases:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return placeholderNewReleases;
    }

    // Filter videos by duration and transform to Movie type
    const validVideos = data
      .filter(isValidNewRelease)
      .map(video => ({
        id: video.id,
        title: video.title,
        image: video.image,
        category: video.category,
        videoId: video.video_id
      }));

    // Update access counts in the background
    validVideos.forEach(video => {
      supabase.rpc('increment_access_count', { video_id: video.id });
    });

    // If we have less than 12 valid videos, pad with placeholders
    if (validVideos.length < 12) {
      const neededPlaceholders = 12 - validVideos.length;
      return [...validVideos, ...placeholderNewReleases.slice(0, neededPlaceholders)];
    }

    return validVideos;
  } catch (error) {
    console.error('Error in new releases query:', error);
    toast.error('Failed to load new releases, showing placeholders');
    return placeholderNewReleases;
  }
};

export const useNewReleases = () => {
  return useQuery({
    queryKey: ['newReleases'],
    queryFn: fetchNewReleases,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  });
};