import { Play } from 'lucide-react';
import { useState } from 'react';

interface MovieThumbnailProps {
  title: string;
  image: string;
  category: string;
  videoId?: string;
  isHovered: boolean;
  isVideoPlaying: boolean;
}

export const MovieThumbnail = ({ title, image, category, videoId, isHovered, isVideoPlaying }: MovieThumbnailProps) => {
  const [thumbnailError, setThumbnailError] = useState(false);
  
  const thumbnailUrl = videoId 
    ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
    : image;

  return (
    <>
      <img
        src={thumbnailError ? image : thumbnailUrl}
        alt={title}
        className="w-full h-full object-cover rounded-lg"
        onError={() => setThumbnailError(true)}
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
  );
};