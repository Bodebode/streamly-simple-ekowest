import { useState, useRef, useEffect } from 'react';
import { MoviePreview } from './movie/MoviePreview';
import { MovieThumbnail } from './movie/MovieThumbnail';

interface MovieCardProps {
  title: string;
  image: string;
  category: string;
  videoId?: string;
  onMovieSelect: (videoId: string) => void;
  isVideoPlaying: boolean;
}

export const MovieCard = ({ title, image, category, videoId, onMovieSelect, isVideoPlaying }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const titleTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isVideoPlaying) {
      setShowPreview(false);
      setShowTitle(true);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
    }
  }, [isVideoPlaying]);

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

  const handleMouseEnter = () => {
    if (!isVideoPlaying) {
      setIsHovered(true);
      if (videoId) {
        hoverTimerRef.current = setTimeout(() => {
          setShowPreview(true);
        }, 1400);
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPreview(false);
    setShowTitle(true);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (titleTimerRef.current) {
      clearTimeout(titleTimerRef.current);
      titleTimerRef.current = null;
    }
  };

  const handleClick = () => {
    if (videoId) {
      onMovieSelect(videoId);
      setShowPreview(false);
      setShowTitle(true);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
    }
  };

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