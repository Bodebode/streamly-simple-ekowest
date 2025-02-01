import { supabase } from '@/integrations/supabase/client';

export const prefetchVideos = async (category: string) => {
  try {
    const { data: videos, error } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', category)
      .eq('is_available', true)
      .order('views', { ascending: false })
      .limit(24);

    if (error) {
      console.error(`Error prefetching ${category} videos:`, error);
      return;
    }

    if (videos && videos.length > 0) {
      console.log(`Prefetched ${videos.length} ${category} videos`);
      return videos;
    }
  } catch (error) {
    console.error(`Error in prefetch for ${category}:`, error);
  }
};

export const updateVideoCache = async (videoId: string) => {
  try {
    const { error } = await supabase
      .rpc('increment_access_count', { video_id: videoId });

    if (error) {
      console.error('Error updating video cache:', error);
    }
  } catch (error) {
    console.error('Error in updateVideoCache:', error);
  }
};