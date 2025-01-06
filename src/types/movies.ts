export interface Movie {
  id: number;
  title: string;
  image: string;
  category: string;
  videoId?: string;
}

export interface CachedMovie {
  id: string;
  title: string;
  image: string;
  category: string;
  videoId?: string;
  access_count: number;
  cached_at: string;
  expires_at: string;
  is_available: boolean;
  last_availability_check: string;
  views: number;
  comments: number;
  duration?: number;
}

export interface MovieData {
  trending: Movie[];
  highlyRated: Movie[];
  yoruba: Movie[];
  skits: Movie[];
}