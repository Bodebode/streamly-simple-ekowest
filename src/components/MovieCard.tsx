import { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';

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
  const previewPlayerRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      if (titleTimerRef.current) {
        clearTimeout(titleTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVideoPlaying) {
      setShowPreview(false);
      setShowTitle(true);
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      if (titleTimerRef.current) {
        clearTimeout(titleTimerRef.current);
      }
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
      if (titleTimerRef.current) {
        clearTimeout(titleTimerRef.current);
      }
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
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      if (titleTimerRef.current) {
        clearTimeout(titleTimerRef.current);
      }
    }
  };

  return (
    <div
      className={`relative movie-card w-[200px] h-[300px] rounded-lg cursor-pointer ${isVideoPlaying ? 'pointer-events-none opacity-50' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {showPreview && videoId && !isVideoPlaying ? (
        <div className="relative w-full h-full" onClick={handleClick}>
          <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <iframe
              ref={previewPlayerRef}
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${videoId}?start=85&end=115&autoplay=1&controls=0&modestbranding=1&disablekb=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          <div className="absolute inset-0">
            <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end">
              {showTitle && (
                <h3 className="text-lg font-bold animate-fade-out transition-opacity duration-[4s]">{title}</h3>
              )}
              <p className="text-sm text-koya-subtext mb-2">{category}</p>
              <button className="bg-koya-accent hover:bg-opacity-80 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors pointer-events-auto">
                <Play className="w-4 h-4" />
                Watch Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
          {isHovered && !isVideoPlaying && (
            <div className="absolute inset-0 bg-black bg-opacity-75 p-4 flex flex-col justify-end rounded-lg">
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm text-koya-subtext mb-2">{category}</p>
              {videoId && (
                <button className="bg-koya-accent hover:bg-opacity-80 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Play className="w-4 h-4" />
                  Watch Now
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};