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
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previewPlayerRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoId) {
      hoverTimerRef.current = setTimeout(() => {
        setShowPreview(true);
      }, 2000); // Changed from 2500 to 2000 milliseconds
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
          src={`https://www.youtube.com/embed/${videoId}?start=85&end=115&autoplay=1&controls=0&modestbranding=1`} // Removed mute=1
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
      )}
      {isHovered && (
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
    </div>
  );
};