export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cached_videos: {
        Row: CachedVideosRow;
        Insert: CachedVideosInsert;
        Update: CachedVideosUpdate;
        Relationships: [];
      };
      profiles: {
        Row: ProfilesRow;
        Insert: ProfilesInsert;
        Update: ProfilesUpdate;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: DatabaseFunctions;
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export interface CachedVideosRow {
  id: string;
  title: string;
  image: string;
  category: string;
  video_id: string;
  views: number | null;
  comments: number | null;
  duration: number | null;
  published_at: string | null;
  cached_at: string | null;
  expires_at: string | null;
  access_count: number | null;
  last_error: string | null;
  retry_count: number | null;
  last_retry: string | null;
  is_available: boolean | null;
  last_availability_check: string | null;
  video_quality: string | null;
  language_tags: string[] | null;
  channel_metadata: Json | null;
  content_tags: string[] | null;
  like_ratio: number | null;
  cultural_elements: string[] | null;
  storytelling_pattern: string | null;
  setting_authenticity: boolean | null;
  criteria_met: Json | null;
  is_embeddable: boolean | null;
}

export interface ProfilesRow {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
}

export type CachedVideosInsert = CachedVideosRow;
export type CachedVideosUpdate = Partial<CachedVideosRow>;
export type ProfilesInsert = ProfilesRow;
export type ProfilesUpdate = Partial<ProfilesRow>;