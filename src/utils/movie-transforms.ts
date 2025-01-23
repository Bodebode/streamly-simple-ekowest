import { CachedMovie, Movie } from '@/types/movies';

export const transformCachedToMovie = (videos: CachedMovie[] | Movie[]): Movie[] => {
  return videos.map((video) => ({
    id: 'video_id' in video ? video.video_id || video.id : video.id,
    title: video.title,
    image: video.image,
    category: video.category,
    videoId: 'video_id' in video ? video.video_id : undefined
  }));
};