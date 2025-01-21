export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  watch_history?: WatchHistoryItem[];
  achievements?: Achievement[];
}

export interface WatchHistoryItem {
  videoId: string;
  title: string;
  watchedAt: string;
  rating?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}