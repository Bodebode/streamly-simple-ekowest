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

    const createSession = async () => {
      if (!videoId || !user) return;

      try {
        const { data, error } = await supabase
          .from('watch_sessions')
          .insert({
            user_id: user.id,
            video_id: videoId,
          })
          .select('id')
          .single();

        if (error) throw error;
        
        setSessionId(data.id);
        setIsWatching(true);
        console.log('[WatchSession] Created new session:', data.id);
      } catch (error) {
        console.error('[WatchSession] Error creating session:', error);
        toast.error('Failed to start watch session');
      }
    };

    const endSession = async () => {
      if (!sessionId) return;

      try {
        const { error } = await supabase
          .from('watch_sessions')
          .update({
            ended_at: new Date().toISOString(),
            duration: Math.floor((Date.now() - startTime) / 1000),
          })
          .eq('id', sessionId);

        if (error) throw error;
        
        console.log('[WatchSession] Ended session:', sessionId);
        setSessionId(null);
        setIsWatching(false);
      } catch (error) {
        console.error('[WatchSession] Error ending session:', error);
      }
    };

    const startTime = Date.now();

    if (videoId && !sessionId) {
      createSession();
      
      // Set up activity check interval
      interval = setInterval(() => {
        // Update session duration periodically
        if (sessionId) {
          supabase
            .from('watch_sessions')
            .update({
              duration: Math.floor((Date.now() - startTime) / 1000),
            })
            .eq('id', sessionId)
            .then(({ error }) => {
              if (error) {
                console.error('[WatchSession] Error updating duration:', error);
              }
            });
        }
      }, 30000); // Update every 30 seconds
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