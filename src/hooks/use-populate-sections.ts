import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface UsePopulateSectionsProps {
  refetchYoruba: () => Promise<any>;
  refetchHighlyRated: () => Promise<any>;
  refetchNewReleases: () => Promise<any>;
  refetchSkits: () => Promise<any>;
}

export const usePopulateSections = ({
  refetchYoruba,
  refetchHighlyRated,
  refetchNewReleases,
  refetchSkits
}: UsePopulateSectionsProps) => {
  const [isPopulating, setIsPopulating] = useState(false);
  const queryClient = useQueryClient();

  const populateAllSections = async () => {
    if (isPopulating) return;
    
    try {
      setIsPopulating(true);
      const toastId = toast.loading('Fetching fresh content for all sections... This may take a minute.');
      
      // Fetch all sections in parallel
      const promises = [
        supabase.functions.invoke('populate-yoruba'),
        supabase.functions.invoke('get-highly-rated'),
        supabase.functions.invoke('get-new-releases'),
        supabase.functions.invoke('get-skits')
      ];

      const results = await Promise.allSettled(promises);
      
      let successCount = 0;
      let errorCount = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successCount++;
        } else {
          console.error(`Error in promise ${index}:`, result.reason);
          errorCount++;
        }
      });

      // Invalidate and refetch all queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['yorubaMovies'] }),
        queryClient.invalidateQueries({ queryKey: ['highlyRated'] }),
        queryClient.invalidateQueries({ queryKey: ['newReleases'] }),
        queryClient.invalidateQueries({ queryKey: ['skits'] })
      ]);

      // Refetch all sections
      await Promise.all([
        refetchYoruba(),
        refetchHighlyRated(),
        refetchNewReleases(),
        refetchSkits()
      ]);
      
      if (errorCount === 0) {
        toast.success('Successfully refreshed all sections', { id: toastId });
      } else {
        toast.warning(`Refreshed ${successCount} sections, ${errorCount} failed`, { id: toastId });
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to refresh content');
    } finally {
      setIsPopulating(false);
    }
  };

  return {
    isPopulating,
    populateAllSections
  };
};