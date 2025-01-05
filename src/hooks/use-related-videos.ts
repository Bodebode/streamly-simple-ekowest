import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface Movie {
  id: number;
  title: string;
  image: string;
  category: string;
  videoId?: string;
}

export const useRelatedVideos = (selectedVideoId: string | null, category: string, movies: Movie[]) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRelatedVideos = async (videoId: string) => {
      try {
        if (category !== 'Comedy') return;
        
        setIsLoading(true);
        console.log('Fetching related videos for:', videoId);
        
        // First try to get cached related videos
        const { data: cachedVideos, error: cacheError } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Related')
          .neq('video_id', videoId)
          .order('access_count', { ascending: false })
          .limit(7);

        if (cachedVideos && cachedVideos.length >= 5) {
          console.log('Using cached related videos:', cachedVideos.length);
          // Update access count for retrieved videos
          const videoIds = cachedVideos.map(video => video.id);
          for (const id of videoIds) {
            await supabase.rpc('increment_access_count', { video_id: id });
          }

          const relatedMovies = cachedVideos.map(video => ({
            id: parseInt(video.id),
            title: video.title,
            image: video.image,
            category: 'Comedy',
            videoId: video.video_id
          }));

          movies.push(...relatedMovies);
          return;
        }

        const { data, error } = await supabase.functions.invoke('get-related-videos', {
          body: { videoId }
        });

        if (error) {
          console.error('Supabase function error:', error);
          toast.error('Failed to fetch related videos');
          throw error;
        }

        if (data) {
          console.log('Received related videos:', data);
          const relatedMovies: Movie[] = data.map((video: any, index: number) => ({
            id: index + 1000,
            title: video.title,
            image: video.thumbnail,
            category: 'Comedy',
            videoId: video.id
          }));
          
          console.log('Adding related movies:', relatedMovies);
          movies.push(...relatedMovies);
        }
      } catch (error) {
        console.error('Error fetching related videos:', error);
        toast.error('Failed to load related videos');
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedVideoId) {
      console.log('Selected video ID:', selectedVideoId);
      fetchRelatedVideos(selectedVideoId);
    }
  }, [selectedVideoId, category, movies]);

  return { isLoading };
};