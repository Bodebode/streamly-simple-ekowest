import { memo } from 'react';
import { truncateTitle } from '@/lib/utils';
import { Play } from 'lucide-react';

interface MovieCardPreviewProps {
  videoId: string;
  title: string;
  category: string;
  showTitle: boolean;
  onClick: () => void;
}

const MovieCardPreviewComponent = ({ videoId, title, category, showTitle, onClick }: MovieCardPreviewProps) => {
  return (
    <div className="relative w-full h-full" onClick={onClick}>
      <iframe
        className="w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&start=85&end=120&modestbranding=1&showinfo=0&rel=0&loop=1&playlist=${videoId}&mute=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg">
        <button 
          className="absolute top-4 left-4 bg-koya-accent hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-500 animate-fade-in"
          onClick={onClick}
        >
          <Play className="w-4 h-4" />
          Watch Now
        </button>
        {showTitle && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white">{truncateTitle(title)}</h3>
            <p className="text-sm text-koya-subtext mb-2">{category}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const MovieCardPreview = memo(MovieCardPreviewComponent);