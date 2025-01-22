export interface CachedVideo {
  id: string;
  title: string;
  image: string;
  category: string;
  video_id: string;
  views?: number;
  comments?: number;
  duration?: number;
  cached_at?: string;
  expires_at?: string;
}

export interface PlaceholderVideo {
  id: string;
  title: string;
  image: string;
  category: string;
}