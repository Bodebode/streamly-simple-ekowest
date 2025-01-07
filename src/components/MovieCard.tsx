import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { MoviePreview } from './movie/MoviePreview';
import { MovieThumbnail } from './movie/MovieThumbnail';
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

  useEffect(() => {
    if (isVideoPlaying) {
      setShowPreview(false);
      setShowTitle(true);
      clearTimers();
    }
  }, [isVideoPlaying, clearTimers]);

  useEffect(() => {
    if (showPreview) {
      titleTimerRef.current = setTimeout(() => {
        setShowTitle(false);
      }, 2000);
    } else {
      setShowTitle(true);
    }

    return () => {
      if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
    };
  }, [showPreview]);

  const handleMouseEnter = useCallback(() => {
    if (!isVideoPlaying) {
      setIsHovered(true);
      if (videoId) {
        hoverTimerRef.current = setTimeout(() => {
          setShowPreview(true);
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
        <MoviePreview
          videoId={videoId}
          title={title}
          category={category}
          showTitle={showTitle}
          onClick={handleClick}
        />
      ) : (
        <MovieThumbnail
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