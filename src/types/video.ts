export interface CachedVideo {
  id: string;
  title: string;
  image: string;
  category: string;
  video_id: string;
  views?: number;
  comments?: number;
  duration?: number;
  published_at?: string;
  cached_at?: string;
  expires_at?: string;
  access_count?: number;
  last_error?: string;
  retry_count?: number;
  last_retry?: string;
  is_available?: boolean;
  last_availability_check?: string;
  video_quality?: string;
  language_tags?: string[];
  channel_metadata?: Record<string, any>;
  content_tags?: string[];
  like_ratio?: number;
  cultural_elements?: string[];
  storytelling_pattern?: string;
  setting_authenticity?: boolean;
  criteria_met?: Record<string, any>;
  is_embeddable?: boolean;
}

export interface PlaceholderVideo {
  id: string;
  title: string;
  image: string;
  category: string;
}