import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentlyWatchedStore {
  videos: Array<{
    id: string;
    videoId: string;
    title: string;
    category: string;
  }>;
  addVideo: (video: { id: string; videoId: string; title: string; category: string; }) => void;
}

export const useRecentlyWatched = create<RecentlyWatchedStore>()(
  persist(
    (set) => ({
      videos: [],
      addVideo: (video) => set((state) => ({
        videos: [video, ...state.videos.filter(v => v.id !== video.id)].slice(0, 10)
      }))
    }),
    {
      name: 'recently-watched'
    }
  )
);
