import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RewardsStore {
  points: number;
  watchTime: number;
  addPoints: (amount: number) => void;
  addWatchTime: (minutes: number) => void;
}

export const useRewardsStore = create<RewardsStore>()(
  persist(
    (set) => ({
      points: 0,
      watchTime: 0,
      addPoints: (amount) => set((state) => ({ points: state.points + amount })),
      addWatchTime: (minutes) => set((state) => ({ watchTime: state.watchTime + minutes })),
    }),
    {
      name: 'ekowest-rewards',
    }
  )
);
