export interface Movie {
  id: string;
  title: string;
  image: string;
  category: string;
  videoId: string;
}

export interface CategoryRowProps {
  title: string;
  movies: Movie[];
  selectedVideoId: string | null;
  onVideoSelect: (videoId: string | null) => void;
  updateHighlyRated?: () => void;
  refetchFunction?: () => void;
}

export interface MovieCardProps {
  id: string;
  title: string;
  image: string;
  category: string;
  videoId: string;
  onMovieSelect: (videoId: string | null) => void;
  isVideoPlaying: boolean;
}

export interface CachedMovie {
  id: string;
  title: string;
  image: string;
  category: string;
  video_id: string;
}