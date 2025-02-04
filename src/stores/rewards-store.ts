import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

interface RewardsStore {
  points: number;
  watchTime: number;
  addPoints: (amount: number) => void;
  addWatchTime: (minutes: number) => void;
  fetchWatchStats: () => Promise<void>;
}

export const useRewardsStore = create<RewardsStore>()(
  persist(
    (set) => ({
      points: 0,
      watchTime: 0,
      addPoints: (amount) => set((state) => ({ points: state.points + amount })),
      addWatchTime: (minutes) => set((state) => ({ watchTime: state.watchTime + minutes })),
      fetchWatchStats: async () => {
        const { data: sessions, error } = await supabase
          .from('watch_sessions')
          .select('duration, points_earned')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .eq('is_valid', true);

        if (error) {
          console.error('[RewardsStore] Error fetching watch stats:', error);
          return;
        }

        // Convert total seconds to minutes and sum up points
        const totalMinutes = sessions?.reduce((acc, session) => 
          acc + Math.floor((session.duration || 0) / 60), 0) || 0;
          
        const totalPoints = sessions?.reduce((acc, session) => 
          acc + (session.points_earned || 0), 0) || 0;

        console.log('[RewardsStore] Updated stats:', {
          watchTime: totalMinutes,
          points: totalPoints,
          rawSessions: sessions
        });

        set({ 
          watchTime: totalMinutes, 
          points: totalPoints 
        });
      }
    }),
    {
      name: 'ekowest-rewards',
    }
  )
);