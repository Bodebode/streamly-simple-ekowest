import { Json } from './database';

export interface DatabaseFunctions {
  cleanup_expired_videos: {
    Args: Record<PropertyKey, never>;
    Returns: undefined;
  };
  increment_access_count: {
    Args: {
      video_id: string;
    };
    Returns: undefined;
  };
  refresh_video_cache: {
    Args: Record<PropertyKey, never>;
    Returns: undefined;
  };
  set_category_expiration: {
    Args: Record<PropertyKey, never>;
    Returns: undefined;
  };
  validate_yoruba_criteria: ValidateYorubaCriteriaFunction;
  your_function_name: {
    Args: Record<PropertyKey, never>;
    Returns: undefined;
  };
}

type ValidateYorubaCriteriaFunction =
  | {
      Args: BaseValidateYorubaCriteriaArgs;
      Returns: Json;
    }
  | {
      Args: BaseValidateYorubaCriteriaArgs & { thumbnail_url: string };
      Returns: Json;
    }
  | {
      Args: BaseValidateYorubaCriteriaArgs & {
        thumbnail_url: string;
        is_embeddable: boolean;
      };
      Returns: Json;
    };

interface BaseValidateYorubaCriteriaArgs {
  p_duration: number;
  p_quality: string;
  p_views: number;
  p_language_tags: string[];
  p_channel_metadata: Json;
  p_content_tags: string[];
  p_like_ratio: number;
  p_cultural_elements: string[];
  p_storytelling_pattern: string;
  p_setting_authenticity: boolean;
}