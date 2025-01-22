import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { placeholderNewReleases } from '@/data/placeholder-new-releases';
import { Movie } from '@/types/movies';

const fetchNewReleases = async (): Promise<Movie[]> => {
  try {
    const { data, error } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', 'New Release')
      .eq('is_available', true)
      .gt('expires_at', new Date().toISOString())
      .order('cached_at', { ascending: false })
      .limit(12);

    if (error) {
      console.error('Error fetching new releases:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return placeholderNewReleases;
    }

    // Transform to Movie type
    const validVideos = data.map(video => ({
      id: video.id,
      title: video.title,
      image: video.image,
      category: video.category,
      videoId: video.video_id
    }));

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