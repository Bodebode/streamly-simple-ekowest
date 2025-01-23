import { SupabaseClient } from '@supabase/supabase-js';
import { YorubaQueryCriteria } from '@/types/video-criteria';

export const buildYorubaQuery = (
  supabase: SupabaseClient,
  criteria: YorubaQueryCriteria
) => {
  let query = supabase
    .from('cached_videos')
    .select('*')
    .eq('category', criteria.category)
    .eq('is_available', criteria.isAvailable)
    .eq('is_embeddable', criteria.isEmbeddable)
    .gt('expires_at', new Date().toISOString())
    .gte('views', criteria.minViews)
    .order('access_count', { ascending: false })
    .limit(criteria.limit);

  if (criteria.minDuration) {
    query = query.gte('duration', criteria.minDuration);
  }

  if (criteria.minLikeRatio) {
    query = query.gte('like_ratio', criteria.minLikeRatio);
  }

  if (criteria.requireAuthenticity) {
    query = query.eq('setting_authenticity', true);
  }

  if (criteria.requireCulturalElements) {
    query = query.not('cultural_elements', 'is', null);
  }

  if (criteria.videoQualities?.length) {
    query = query.in('video_quality', criteria.videoQualities);
  }

  console.log('[Query Builder] Building query with criteria:', criteria);
  return query;
};