import { CachedVideo } from '@/types/video';

export const isValidNewRelease = (video: CachedVideo): boolean => {
  const MINIMUM_DURATION = 45 * 60; // 45 minutes in seconds
  
  return (
    video.is_available === true &&
    video.video_id !== undefined &&
    video.duration !== undefined &&
    video.duration >= MINIMUM_DURATION
  );
};