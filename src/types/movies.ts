export interface Movie {
  id: string;  // Changed from number to string
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

interface CriteriaMet {
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
}

export interface CachedMovie {
  id: string;
  title: string;
  image: string;
  category: string;
  video_id: string;
  access_count: number | null;
  cached_at: string | null;
  expires_at: string | null;
  is_available: boolean | null;
  last_availability_check: string | null;
  views: number | null;
  comments: number | null;
  duration?: number | null;
  video_quality?: string | null;
  language_tags?: string[] | null;
  channel_metadata?: Json | null;
  content_tags?: string[] | null;
  like_ratio?: number | null;
  cultural_elements?: string[] | null;
  storytelling_pattern?: string | null;
  setting_authenticity?: boolean | null;
  criteria_met?: CriteriaMet | null;
}

// Import Json type from Supabase types
import { Json } from '@/integrations/supabase/types';