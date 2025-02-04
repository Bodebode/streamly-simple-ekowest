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
          creator_name: string | null
          criteria_met: Json | null
          cultural_elements: string[] | null
          duration: number | null
          expires_at: string | null
          id: string
          image: string
          is_available: boolean | null
          is_embeddable: boolean | null
          is_verified_creator: boolean | null
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
          creator_name?: string | null
          criteria_met?: Json | null
          cultural_elements?: string[] | null
          duration?: number | null
          expires_at?: string | null
          id: string
          image: string
          is_available?: boolean | null
          is_embeddable?: boolean | null
          is_verified_creator?: boolean | null
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
          creator_name?: string | null
          criteria_met?: Json | null
          cultural_elements?: string[] | null
          duration?: number | null
          expires_at?: string | null
          id?: string
          image?: string
          is_available?: boolean | null
          is_embeddable?: boolean | null
          is_verified_creator?: boolean | null
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
      messages: {
        Row: {
          channel: string
          content: string
          created_at: string
          id: string
          user_id: string
          username: string | null
        }
        Insert: {
          channel?: string
          content: string
          created_at?: string
          id?: string
          user_id: string
          username?: string | null
        }
        Update: {
          channel?: string
          content?: string
          created_at?: string
          id?: string
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          payment_intent_id: string | null
          payment_method: string
          reward_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          id?: string
          metadata?: Json | null
          payment_intent_id?: string | null
          payment_method: string
          reward_id: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_intent_id?: string | null
          payment_method?: string
          reward_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          is_edited: boolean | null
          post_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_edited?: boolean | null
          post_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_edited?: boolean | null
          post_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          is_edited: boolean | null
          likes_count: number | null
          replies_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_edited?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_edited?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      query_metrics: {
        Row: {
          category: string | null
          created_at: string | null
          execution_time: number
          id: string
          query_name: string
          rows_affected: number | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          execution_time: number
          id?: string
          query_name: string
          rows_affected?: number | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          execution_time?: number
          id?: string
          query_name?: string
          rows_affected?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "query_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_movie_lists: {
        Row: {
          added_at: string
          id: string
          movie_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          movie_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          movie_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_movie_lists_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "cached_videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_movie_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      watch_sessions: {
        Row: {
          created_at: string | null
          duration: number | null
          ended_at: string | null
          id: string
          is_valid: boolean | null
          points_earned: number | null
          started_at: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          ended_at?: string | null
          id?: string
          is_valid?: boolean | null
          points_earned?: number | null
          started_at?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          ended_at?: string | null
          id?: string
          is_valid?: boolean | null
          points_earned?: number | null
          started_at?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watch_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watch_sessions_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "cached_videos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_videos: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      increment_access_count: {
        Args: {
          video_id: string
        }
        Returns: undefined
      }
      log_query_metrics: {
        Args: {
          p_query_name: string
          p_execution_time: number
          p_rows_affected: number
          p_category: string
          p_user_id: string
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
      validate_yoruba_criteria: {
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
          p_thumbnail_url?: string
          p_is_embeddable?: boolean
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
