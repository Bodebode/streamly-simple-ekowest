import { truncateTitle } from '@/lib/utils';
import { useRewardsTracking } from '@/hooks/use-rewards-tracking';
import { useRewardsToast } from '@/components/RewardsToast';
import { useState, useEffect } from 'react';
import { useRewardsStore } from '@/stores/rewards-store';

interface MoviePreviewProps {
  videoId: string;
  title: string;
  category: string;
  showTitle: boolean;
  onClick: () => void;
}

export const MoviePreview = ({ videoId, title, category, showTitle, onClick }: MoviePreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { showRewardEarned } = useRewardsToast();
  const points = useRewardsStore((state) => state.points);
  
  useRewardsTracking(isPlaying);

  useEffect(() => {
    if (isPlaying && points > 0 && points % 10 === 0) {
      showRewardEarned(10);
    }
  }, [points, isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
    onClick();
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="relative flex-shrink-0 cursor-pointer group">
      <div 
        className="aspect-video w-[300px] bg-gray-800 rounded-lg overflow-hidden"
        onClick={handlePlay}
      >
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {showTitle && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-white font-semibold">{truncateTitle(title)}</h3>
          <p className="text-gray-300 text-sm">{category}</p>
        </div>
      )}
    </div>
  );
};