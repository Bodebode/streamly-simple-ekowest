import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

export const useWatchSession = (videoId: string | null) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let startTime: number;

    const createSession = async () => {
      if (!videoId || !user) return;

      try {
        const { data, error } = await supabase
          .from('watch_sessions')
          .insert({
            user_id: user.id,
            video_id: videoId,
            started_at: new Date().toISOString(),
            duration: 0, // Initialize duration as 0
          })
          .select('id')
          .single();

        if (error) throw error;
        
        startTime = Date.now();
        setSessionId(data.id);
        setIsWatching(true);
        console.log('[WatchSession] Created new session:', data.id);
      } catch (error) {
        console.error('[WatchSession] Error creating session:', error);
        toast.error('Failed to start watch session');
      }
    };

    const updateDuration = async () => {
      if (!sessionId) return;

      const currentDuration = Math.floor((Date.now() - startTime) / 1000);
      
      try {
        const { error } = await supabase
          .from('watch_sessions')
          .update({
            duration: currentDuration,
            is_valid: true // Mark session as valid
          })
          .eq('id', sessionId);

        if (error) throw error;
        
        console.log('[WatchSession] Updated duration:', currentDuration);
      } catch (error) {
        console.error('[WatchSession] Error updating duration:', error);
      }
    };

    const endSession = async () => {
      if (!sessionId) return;

      try {
        const finalDuration = Math.floor((Date.now() - startTime) / 1000);
        
        const { error } = await supabase
          .from('watch_sessions')
          .update({
            ended_at: new Date().toISOString(),
            duration: finalDuration,
            is_valid: finalDuration >= 30 // Mark as valid only if watched for at least 30 seconds
          })
          .eq('id', sessionId);

        if (error) throw error;
        
        console.log('[WatchSession] Ended session:', sessionId, 'Duration:', finalDuration);
        setSessionId(null);
        setIsWatching(false);
      } catch (error) {
        console.error('[WatchSession] Error ending session:', error);
      }
    };

    if (videoId && !sessionId) {
      createSession();
      
      // Update duration more frequently (every 5 seconds)
      interval = setInterval(updateDuration, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      if (sessionId) {
        endSession();
      }
    };
  }, [videoId, user, sessionId]);

  return { isWatching };
};