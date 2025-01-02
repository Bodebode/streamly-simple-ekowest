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
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previewPlayerRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // If a video is playing, disable any active previews
    if (isVideoPlaying) {
      setShowPreview(false);
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    }
  }, [isVideoPlaying]);

  const handleMouseEnter = () => {
    if (!isVideoPlaying) {
      setIsHovered(true);
      if (videoId) {
        hoverTimerRef.current = setTimeout(() => {
          setShowPreview(true);
        }, 2000);
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPreview(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const handleClick = () => {
    if (videoId) {
      onMovieSelect(videoId);
      setShowPreview(false);
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
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
        <div className="relative w-full h-full">
          <iframe
            ref={previewPlayerRef}
            className="w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}?start=85&end=115&autoplay=1&controls=0&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end">
              <h3 className="text-lg font-bold">{title}</h3>
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