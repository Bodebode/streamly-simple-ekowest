import { useState } from 'react';
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

  const handleClick = () => {
    if (videoId) {
      onMovieSelect(videoId);
    }
  };

  return (
    <div
      className="relative movie-card w-[200px] h-[300px] rounded-lg cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover rounded-lg"
      />
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