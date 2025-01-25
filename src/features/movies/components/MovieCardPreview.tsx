import { truncateTitle } from '@/lib/utils';
import { YouTubePlayer } from '@/components/YouTubePlayer';

interface MovieCardPreviewProps {
  videoId: string;
  title: string;
  category: string;
  showTitle: boolean;
  onClick: () => void;
}

export const MovieCardPreview = ({ videoId, title, category, showTitle, onClick }: MovieCardPreviewProps) => {
  return (
    <div className="absolute inset-0 bg-black rounded-lg overflow-hidden" onClick={onClick}>
      <YouTubePlayer videoId={videoId} />
      {showTitle && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-lg font-bold">{truncateTitle(title)}</h3>
          <p className="text-sm text-koya-subtext">{category}</p>
        </div>
      )}
    </div>
  );
};