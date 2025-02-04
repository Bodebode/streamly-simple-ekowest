import { useEffect, useState } from 'react';

interface WatchTimerProps {
  startTime: number;
}

export const WatchTimer = ({ startTime }: WatchTimerProps) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    console.log('[WatchTimer] Initial start time:', new Date(startTime).toISOString());
    
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(seconds);
      console.log('[WatchTimer] Updated elapsed time:', seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
      Watch Time: {formatTime(elapsed)}
    </div>
  );
};