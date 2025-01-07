interface VideoDetails {
  id: string;
  snippet: {
    title: string;
    thumbnails: {
      maxres?: { url: string };
      high: { url: string };
    };
    publishedAt: string;
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

export const validateAndTransformVideo = async (
  supabase: any,
  video: VideoDetails
) => {
  const thumbnailUrl = video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url;
  
  // Parse duration string to seconds
  const durationStr = video.contentDetails.duration;
  const matches = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(matches?.[1] || '0');
  const minutes = parseInt(matches?.[2] || '0');
  const seconds = parseInt(matches?.[3] || '0');
  const durationInSeconds = hours * 3600 + minutes * 60 + seconds;

  // Calculate like ratio
  const likes = parseInt(video.statistics.likeCount || '0');
  const views = parseInt(video.statistics.viewCount || '0');
  const likeRatio = views > 0 ? likes / views : 0;

  // Call validate_yoruba_criteria function with thumbnail
  const { data: criteriaResult, error: criteriaError } = await supabase
    .rpc('validate_yoruba_criteria', {
      p_duration: durationInSeconds,
      p_quality: '1080p',
      p_views: views,
      p_language_tags: ['yoruba'],
      p_channel_metadata: { is_yoruba_creator: true },
      p_content_tags: ['yoruba', 'movie'],
      p_like_ratio: likeRatio,
      p_cultural_elements: ['yoruba'],
      p_storytelling_pattern: 'traditional',
      p_setting_authenticity: true,
      p_thumbnail_url: thumbnailUrl
    });

  if (criteriaError) {
    console.error(`Error validating criteria for ${video.id}:`, criteriaError);
    return null;
  }

  return {
    id: crypto.randomUUID(),
    title: video.snippet.title,
    image: thumbnailUrl,
    category: 'Yoruba Movies',
    video_id: video.id,
    views: parseInt(video.statistics.viewCount),
    comments: parseInt(video.statistics.commentCount),
    duration: durationInSeconds,
    published_at: video.snippet.publishedAt,
    video_quality: '1080p',
    language_tags: ['yoruba'],
    channel_metadata: { is_yoruba_creator: true },
    content_tags: ['yoruba', 'movie'],
    like_ratio: likeRatio,
    cultural_elements: ['yoruba'],
    storytelling_pattern: 'traditional',
    setting_authenticity: true,
    is_available: true,
    cached_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    criteria_met: criteriaResult
  };
};