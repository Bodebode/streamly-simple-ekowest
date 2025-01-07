import { memo } from 'react';
import { MoviePreview } from './MoviePreview';

interface MovieCardPreviewProps {
  videoId: string;
  title: string;
  category: string;
  showTitle: boolean;
  onClick: () => void;
}

const MovieCardPreviewComponent = ({ videoId, title, category, showTitle, onClick }: MovieCardPreviewProps) => (
  <MoviePreview
    videoId={videoId}
    title={title}
    category={category}
    showTitle={showTitle}
    onClick={onClick}
  />
);

export const MovieCardPreview = memo(MovieCardPreviewComponent);