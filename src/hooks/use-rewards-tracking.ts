import { useEffect, useRef } from 'react';
import { useRewardsStore } from '@/stores/rewards-store';

export const useRewardsTracking = (isPlaying: boolean) => {
  const timeRef = useRef<NodeJS.Timeout>();
  const { addPoints, addWatchTime } = useRewardsStore();

  useEffect(() => {
    if (isPlaying) {
      timeRef.current = setInterval(() => {
        addPoints(1);
        addWatchTime(1);
      }, 60000); // Every minute
    }

    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, [isPlaying, addPoints, addWatchTime]);
};
