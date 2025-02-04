import { memo } from 'react';
import { truncateTitle } from '@/lib/utils';

interface MovieCardPreviewProps {
  videoId: string;
  title: string;
  category: string;
  showTitle: boolean;
  onClick: () => void;
}

const MovieCardPreviewComponent = ({ videoId, title, category, showTitle, onClick }: MovieCardPreviewProps) => {
  // First truncate the title using the existing function
  const truncatedTitle = truncateTitle(title);
  
  // Then limit to first 3 words for preview
  const previewTitle = truncatedTitle.split(' ').slice(0, 3).join(' ');

  return (
    <div className="relative w-full h-full" onClick={onClick}>
      <iframe
        className="w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&start=85&end=120&modestbranding=1&showinfo=0&rel=0&loop=1&playlist=${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg">
        {showTitle && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white">{previewTitle}</h3>
            <p className="text-sm text-koya-subtext mb-2">{category}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const MovieCardPreview = memo(MovieCardPreviewComponent);