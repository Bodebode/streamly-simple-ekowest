import { useRef } from 'react';
import { Play } from 'lucide-react';

interface MoviePreviewProps {
  videoId: string;
  title: string;
  category: string;
  showTitle: boolean;
  onClick: () => void;
}

export const MoviePreview = ({ videoId, title, category, showTitle, onClick }: MoviePreviewProps) => {
  const previewPlayerRef = useRef<HTMLIFrameElement | null>(null);

  return (
    <div className="relative w-full h-full" onClick={onClick}>
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
  );
};