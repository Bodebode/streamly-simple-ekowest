export interface Movie {
  id: number;
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

export interface CachedMovie {
  id: string;
  title: string;
  image: string;
  category: string;
  video_id?: string;
  access_count: number;
  cached_at: string;
  expires_at: string;
  is_available: boolean;
  last_availability_check: string;
  views: number;
  comments: number;
  duration?: number;
  video_quality?: string;
  language_tags?: string[];
  channel_metadata?: {
    is_yoruba_creator?: boolean;
    [key: string]: any;
  };
  content_tags?: string[];
  like_ratio?: number;
  cultural_elements?: string[];
  storytelling_pattern?: string;
  setting_authenticity?: boolean;
  criteria_met?: {
    essential: {
      duration: boolean;
      quality: boolean;
      views: boolean;
    };
    non_essential: {
      title_description: boolean;
      channel: boolean;
      language: boolean;
      distribution: boolean;
      upload_date: boolean;
      like_ratio: boolean;
      comments: boolean;
      cultural_elements: boolean;
      storytelling: boolean;
      settings: boolean;
    };
    meets_criteria: boolean;
  };
}