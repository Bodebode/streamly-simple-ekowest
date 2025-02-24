
import { useState, useEffect } from 'react';
import { MovieCardPreview } from './MovieCardPreview';
import { MovieCardBase } from './MovieCardBase';
import { useMovieCardPreview } from './MovieCardPreviewHandler';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

interface MovieCardProps {
  id: string;
  title: string;
  image: string;
  category: string;
  videoId?: string;
  onMovieSelect: (videoId: string | null) => void;
  isVideoPlaying: boolean;
}

export const MovieCard = ({ 
  id, 
  title, 
  image, 
  category, 
  videoId, 
  onMovieSelect, 
  isVideoPlaying 
}: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const { user } = useAuthStore();

  const { handleMouseEnter, handleMouseLeave, clearTimers } = useMovieCardPreview({
    isVideoPlaying,
    videoId,
    onPreviewChange: setShowPreview,
    onTitleChange: setShowTitle
  });

  useEffect(() => {
    if (isVideoPlaying) {
      setShowPreview(false);
      setShowTitle(true);
      clearTimers();
    }
  }, [isVideoPlaying, clearTimers]);

  const handleClick = () => {
    if (videoId) {
      console.log(`[MovieCard] Attempting to play video: ${title} (${videoId})`);
      onMovieSelect(videoId);
      setShowPreview(false);
      setShowTitle(true);
      clearTimers();
    } else {
      console.warn(`[MovieCard] No videoId available for: ${title}`);
      toast.error('This video is not available for playback');
    }
  };

  return (
    <div
      className="relative movie-card w-full h-[210px] md:h-[300px] rounded-lg cursor-pointer group"
      onMouseEnter={() => {
        setIsHovered(true);
        handleMouseEnter();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseLeave();
      }}
      onClick={handleClick}
    >
      {showPreview && videoId && !isVideoPlaying ? (
        <MovieCardPreview
          videoId={videoId}
          title={title}
          category={category}
          showTitle={showTitle}
          onClick={handleClick}
        />
      ) : (
        <MovieCardBase
          title={title}
          image={image}
          category={category}
          videoId={videoId}
          isHovered={isHovered}
          isVideoPlaying={isVideoPlaying}
        />
      )}
    </div>
  );
};
