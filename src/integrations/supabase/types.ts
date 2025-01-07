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
        Row: {
          access_count: number | null
          cached_at: string | null
          category: string
          channel_metadata: Json | null
          comments: number | null
          content_tags: string[] | null
          criteria_met: Json | null
          cultural_elements: string[] | null
          duration: number | null
          expires_at: string | null
          id: string
          image: string
          is_available: boolean | null
          language_tags: string[] | null
          last_availability_check: string | null
          last_error: string | null
          last_retry: string | null
          like_ratio: number | null
          published_at: string | null
          retry_count: number | null
          setting_authenticity: boolean | null
          storytelling_pattern: string | null
          title: string
          video_id: string
          video_quality: string | null
          views: number | null
        }
        Insert: {
          access_count?: number | null
          cached_at?: string | null
          category: string
          channel_metadata?: Json | null
          comments?: number | null
          content_tags?: string[] | null
          criteria_met?: Json | null
          cultural_elements?: string[] | null
          duration?: number | null
          expires_at?: string | null
          id: string
          image: string
          is_available?: boolean | null
          language_tags?: string[] | null
          last_availability_check?: string | null
          last_error?: string | null
          last_retry?: string | null
          like_ratio?: number | null
          published_at?: string | null
          retry_count?: number | null
          setting_authenticity?: boolean | null
          storytelling_pattern?: string | null
          title: string
          video_id: string
          video_quality?: string | null
          views?: number | null
        }
        Update: {
          access_count?: number | null
          cached_at?: string | null
          category?: string
          channel_metadata?: Json | null
          comments?: number | null
          content_tags?: string[] | null
          criteria_met?: Json | null
          cultural_elements?: string[] | null
          duration?: number | null
          expires_at?: string | null
          id?: string
          image?: string
          is_available?: boolean | null
          language_tags?: string[] | null
          last_availability_check?: string | null
          last_error?: string | null
          last_retry?: string | null
          like_ratio?: number | null
          published_at?: string | null
          retry_count?: number | null
          setting_authenticity?: boolean | null
          storytelling_pattern?: string | null
          title?: string
          video_id?: string
          video_quality?: string | null
          views?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_access_count: {
        Args: {
          video_id: string
        }
        Returns: undefined
      }
      refresh_video_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      set_category_expiration: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_yoruba_criteria:
        | {
            Args: {
              p_duration: number
              p_quality: string
              p_views: number
              p_language_tags: string[]
              p_channel_metadata: Json
              p_content_tags: string[]
              p_like_ratio: number
              p_cultural_elements: string[]
              p_storytelling_pattern: string
              p_setting_authenticity: boolean
            }
            Returns: Json
          }
        | {
            Args: {
              p_duration: number
              p_quality: string
              p_views: number
              p_language_tags: string[]
              p_channel_metadata: Json
              p_content_tags: string[]
              p_like_ratio: number
              p_cultural_elements: string[]
              p_storytelling_pattern: string
              p_setting_authenticity: boolean
              p_thumbnail_url: string
            }
            Returns: Json
          }
      your_function_name: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
