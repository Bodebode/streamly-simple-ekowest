import { useState, useEffect } from 'react';
import { Movie } from '@/types/movies';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MINIMUM_CARDS = 6;

export const useSectionVisibility = (
  title: string,
  movies: Movie[],
  refetchFunction?: () => Promise<any>
) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasAttemptedRefetch, setHasAttemptedRefetch] = useState(false);

  useEffect(() => {
    const checkVisibility = async () => {
      // Count playable videos (ones with videoId)
      const playableVideos = movies.filter(movie => movie.videoId).length;
      
      if (playableVideos < MINIMUM_CARDS && !hasAttemptedRefetch && refetchFunction) {
        console.log(`[SectionVisibility] ${title} has only ${playableVideos} playable videos. Attempting refetch...`);
        
        try {
          await refetchFunction();
          setHasAttemptedRefetch(true);
        } catch (error) {
          console.error(`[SectionVisibility] Error refetching ${title}:`, error);
        }
      } else if (playableVideos < MINIMUM_CARDS) {
        console.log(`[SectionVisibility] Hiding ${title} section due to insufficient playable videos`);
        setIsVisible(false);
        
        // Notify backend about the issue
        try {
          await supabase.functions.invoke('check-section-counts');
        } catch (error) {
          console.error('[SectionVisibility] Error invoking section check:', error);
        }
      } else {
        setIsVisible(true);
      }
    };

    checkVisibility();
  }, [title, movies, refetchFunction, hasAttemptedRefetch]);

  return isVisible;
};