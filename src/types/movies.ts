
export interface Movie {
  id: string;
  title: string;
  image: string;
  category: string;
  videoId?: string;
}

export interface MovieData {
  trending: Movie[];
  highlyRated: Movie[];
  yoruba: Movie[];
  skits: Movie[];
}

export interface CategoryRowProps {
  title: string;
  movies: Movie[];
  selectedVideoId: string | null;
  onVideoSelect: (videoId: string | null) => void;
  updateHighlyRated?: (movies: Movie[]) => void;
  refetchFunction?: () => Promise<any>;
}

export interface MovieCarouselProps {
  movies: Movie[];
  onMovieSelect: (videoId: string | null) => void;
  isVideoPlaying: boolean;
}

export interface MovieCardProps {
  id: string;
  title: string;
  image: string;
  category: string;
  videoId?: string;
  onMovieSelect: (videoId: string | null) => void;
  isVideoPlaying: boolean;
}

export interface CachedMovie {
  id: string;
  title: string;
  image: string;
  category: string;
  video_id: string;
  views?: number;
  comments?: number;
  cached_at?: string;
  expires_at?: string;
  access_count?: number;
  is_available?: boolean;
}

export interface User {
  id: string;
  email?: string;
  username?: string;
  avatar_url?: string;
}
