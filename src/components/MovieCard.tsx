import { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';

interface MovieCardProps {
  title: string;
  image: string;
  category: string;
  videoId?: string;
  onMovieSelect: (videoId: string) => void;
}

export const MovieCard = ({ title, image, category, videoId, onMovieSelect }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const overlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previewPlayerRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      if (overlayTimerRef.current) {
        clearTimeout(overlayTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoId) {
      hoverTimerRef.current = setTimeout(() => {
        setShowPreview(true);
        setShowOverlay(false);
        
        // Set timer to show overlay 4 seconds before preview ends
        overlayTimerRef.current = setTimeout(() => {
          setShowOverlay(true);
        }, 26000); // 30 seconds preview - 4 seconds = 26 seconds
      }, 1500); // Reduced from 2500 to 1500ms
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPreview(false);
    setShowOverlay(true);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current);
      overlayTimerRef.current = null;
    }
  };

  const handleClick = () => {
    if (videoId) {
      onMovieSelect(videoId);
    }
  };

  return (
    <div
      className="relative movie-card w-[200px] h-[300px] rounded-lg cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {showPreview && videoId ? (
        <iframe
          ref={previewPlayerRef}
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}?start=85&end=115&autoplay=1&controls=0&modestbranding=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
      )}
      {(isHovered && showOverlay) && (
        <div className="absolute inset-0 bg-black bg-opacity-75 p-4 flex flex-col justify-end rounded-lg">
          <h3 className="text-lg font-bold animate-scroll">{title}</h3>
          <p className="text-sm text-koya-subtext mb-2">{category}</p>
          {videoId && (
            <button className="bg-koya-accent hover:bg-opacity-80 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Play className="w-4 h-4" />
              Watch Now
            </button>
          )}
        </div>
      )}
    </div>
  );
};