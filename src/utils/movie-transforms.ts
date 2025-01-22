import { CachedMovie, Movie } from '@/types/movies';

export const transformCachedToMovie = (videos: CachedMovie[] | Movie[]): Movie[] => {
  return videos.map((video, index) => ({
    id: index + 1,
    title: video.title,
    image: video.image,
    category: video.category,
    videoId: 'video_id' in video ? video.video_id : undefined
  }));
};