import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { MovieCardPreview } from './movie/MovieCardPreview';
import { MovieCardBase } from './movie/MovieCardBase';
import { toast } from 'sonner';

interface MovieCardProps {
  title: string;
  image: string;
  category: string;
  videoId?: string;
  onMovieSelect: (videoId: string) => void;
  isVideoPlaying: boolean;
}

const MovieCardComponent = ({ title, image, category, videoId, onMovieSelect, isVideoPlaying }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const titleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (titleTimerRef.current) {
      clearTimeout(titleTimerRef.current);
      titleTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  // Clear preview when video is playing anywhere
  useEffect(() => {
    if (isVideoPlaying) {
      setShowPreview(false);
      setShowTitle(true);
      clearTimers();
    }
  }, [isVideoPlaying, clearTimers]);

  const handleMouseEnter = useCallback(() => {
    if (!isVideoPlaying) {
      setIsHovered(true);
      if (videoId) {
        // Only start preview timer if no other video is playing
        hoverTimerRef.current = setTimeout(() => {
          const previewElements = document.querySelectorAll('iframe[src*="youtube.com"]');
          if (previewElements.length === 0) {
            setShowPreview(true);
          }
        }, 1400);
      }
    }
  }, [isVideoPlaying, videoId]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowPreview(false);
    setShowTitle(true);
    clearTimers();
  }, [clearTimers]);

  const handleClick = useCallback(() => {
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
  }, [videoId, onMovieSelect, clearTimers, title]);

  return (
    <div
      className={`relative movie-card w-full h-[210px] md:h-[300px] rounded-lg cursor-pointer ${isVideoPlaying ? 'pointer-events-none opacity-50' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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

export const MovieCard = memo(MovieCardComponent);