import { useState, useEffect } from 'react';
import { Movie } from '@/types/movies';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MINIMUM_CARDS = 4; // Reduced from 6 to 4 to show more sections

export const useSectionVisibility = (
  title: string,
  movies: Movie[],
  refetchFunction?: () => Promise<any>
) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasAttemptedRefetch, setHasAttemptedRefetch] = useState(false);

  useEffect(() => {
    const checkVisibility = async () => {
      // Count all videos, not just playable ones
      const totalVideos = movies.length;
      
      if (totalVideos < MINIMUM_CARDS && !hasAttemptedRefetch && refetchFunction) {
        console.log(`[SectionVisibility] ${title} has only ${totalVideos} videos. Attempting refetch...`);
        
        try {
          await refetchFunction();
          setHasAttemptedRefetch(true);
        } catch (error) {
          console.error(`[SectionVisibility] Error refetching ${title}:`, error);
        }
      } else if (totalVideos < MINIMUM_CARDS) {
        console.log(`[SectionVisibility] Hiding ${title} section due to insufficient videos`);
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    checkVisibility();
  }, [title, movies, refetchFunction, hasAttemptedRefetch]);

  return isVisible;
};