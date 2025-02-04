import { useEffect, useRef } from 'react';
import { useRewardsStore } from '@/stores/rewards-store';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

export const useRewardsTracking = (isPlaying: boolean) => {
  const timeRef = useRef<NodeJS.Timeout>();
  const { addPoints, addWatchTime } = useRewardsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (isPlaying && user) {
      // Award points every minute of watching
      timeRef.current = setInterval(async () => {
        // Verify active watch sessions before awarding points
        const { data: sessions, error } = await supabase
          .from('watch_sessions')
          .select('duration, points_earned')
          .eq('user_id', user.id)
          .is('ended_at', null)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('[RewardsTracking] Error checking session:', error);
          return;
        }

        if (sessions && sessions.length > 0) {
          const session = sessions[0];
          
          // Only award points if the session is valid (more than 45 seconds in the last minute)
          if (session.duration && session.duration >= 45) {
            addPoints(1);
            addWatchTime(1);
            
            // Update points earned in the session
            const { error: updateError } = await supabase
              .from('watch_sessions')
              .update({
                points_earned: (session.points_earned || 0) + 1,
              })
              .eq('user_id', user.id)
              .is('ended_at', null);

            if (updateError) {
              console.error('[RewardsTracking] Error updating points:', updateError);
            }
          }
        }
      }, 60000); // Check every minute
    }

    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, [isPlaying, user, addPoints, addWatchTime]);
};