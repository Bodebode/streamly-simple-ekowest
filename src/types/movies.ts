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

export interface User {
  id: string;
  email?: string;
  name?: string;
}