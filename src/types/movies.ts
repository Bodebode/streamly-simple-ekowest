export interface CachedMovie {
  id: string;
  title: string;
  image: string;
  category: string;
  video_id?: string;
  views?: number;
  comments?: number;
  duration?: number;
  published_at?: string;
  cached_at?: string;
  expires_at?: string;
  access_count?: number;
  is_available?: boolean;
  video_quality?: string;
}

export interface Movie {
  id: string;  // Changed from number to string to match database
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

export interface User {
  id: string;
  email?: string;
  name?: string;
}

export interface MovieCardProps {
  id: string;  // Changed from number to string
  title: string;
  image: string;
  category: string;
  videoId?: string;
  onMovieSelect: (videoId: string) => void;
  isVideoPlaying: boolean;
}

export interface CategoryRowProps {
  title: string;
  movies: Movie[];
  selectedVideoId: string | null;
  onVideoSelect: (videoId: string | null) => void;
  updateHighlyRated?: (movies: Movie[]) => void;
}

export interface MovieCarouselProps {
  movies: Movie[];
  onMovieSelect: (videoId: string | null) => void;
  isVideoPlaying: boolean;
}