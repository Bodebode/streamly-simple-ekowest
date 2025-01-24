/**
 * Convert ISO 8601 duration to seconds
 * @param duration ISO 8601 duration string (e.g., "PT2M30S")
 * @returns duration in seconds
 */
export const parseDuration = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match?.[1] || '0');
  const minutes = parseInt(match?.[2] || '0');
  const seconds = parseInt(match?.[3] || '0');
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Format seconds to human readable duration
 * @param seconds duration in seconds
 * @returns formatted duration string (e.g., "2:30")
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const MIN_DURATION_SECONDS = 150; // 2 minutes and 30 seconds

export const isValidDuration = (duration: number): boolean => {
  return duration >= MIN_DURATION_SECONDS;
};