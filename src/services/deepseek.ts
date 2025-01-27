import { supabase } from '@/integrations/supabase/client';

export const deepseekService = {
  generateResponse: async (prompt: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-with-deepseek', {
        body: { prompt }
      });

      if (error) {
        console.error('Error calling Deepseek service:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in deepseek service:', error);
      throw error;
    }
  }
};