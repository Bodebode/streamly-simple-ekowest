import { CachedVideo } from '@/types/video';
import { Movie } from '@/types/movies';

export const transformCachedToMovie = (videos: CachedVideo[]): Movie[] => {
  return videos.map((video, index) => ({
    id: video.id || index + 1,
    title: video.title,
    image: video.image,
    category: video.category,
    videoId: video.video_id
  }));
};