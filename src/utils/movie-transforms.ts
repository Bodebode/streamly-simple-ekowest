import { CachedMovie, Movie } from '@/types/movies';

export const transformCachedToMovie = (videos: CachedMovie[] | Movie[]): Movie[] => {
  return videos.map((video, index) => ({
    id: index + 1, // Always use a number for id
    title: video.title,
    image: video.image,
    category: video.category,
    videoId: 'video_id' in video ? video.video_id : video.videoId
  }));
};