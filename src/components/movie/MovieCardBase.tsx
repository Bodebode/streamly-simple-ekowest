import { memo } from 'react';
import { MovieThumbnail } from './MovieThumbnail';

interface MovieCardBaseProps {
  title: string;
  image: string;
  category: string;
  videoId?: string;
  isHovered: boolean;
  isVideoPlaying: boolean;
}

const MovieCardBaseComponent = ({ title, image, category, videoId, isHovered, isVideoPlaying }: MovieCardBaseProps) => (
  <MovieThumbnail
    title={title}
    image={image}
    category={category}
    videoId={videoId}
    isHovered={isHovered}
    isVideoPlaying={isVideoPlaying}
  />
);

export const MovieCardBase = memo(MovieCardBaseComponent);