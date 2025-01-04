import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSkits = () => {
  return useQuery({
    queryKey: ['skits'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-skits', {
        query: {
          min_length: 0,
          max_length: 42,
          min_views: 4000
        }
      });
      
      if (error) {
        console.error('Error fetching skits:', error);
        toast.error('Failed to load skits');
        throw error;
      }
      
      return data;
    },
  });
};