import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useNewReleases = () => {
  return useQuery({
    queryKey: ['newReleases'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-new-releases');
      
      if (error) {
        console.error('Error fetching new releases:', error);
        toast.error('Failed to load new releases');
        throw error;
      }
      
      return data;
    },
  });
};