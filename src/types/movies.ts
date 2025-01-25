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
  id: string;  // Changed from number to string to match the database
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

// Add User type to fix auth store typing issues
export interface User {
  id: string;
  email?: string;
  name?: string;
  // Add other potential user properties
}