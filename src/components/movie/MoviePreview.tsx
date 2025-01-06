import { truncateTitle } from '@/lib/utils';

interface MoviePreviewProps {
  videoId: string;
  title: string;
  category: string;
  showTitle: boolean;
  onClick: () => void;
}

export const MoviePreview = ({ videoId, title, category, showTitle, onClick }: MoviePreviewProps) => {
  return (
    <div className="relative w-full h-full" onClick={onClick}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg"
      />
      {showTitle && (
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-4">
          <h3 className="text-lg font-bold text-white">{truncateTitle(title)}</h3>
          <p className="text-sm text-gray-300">{category}</p>
        </div>
      )}
    </div>
  );
};