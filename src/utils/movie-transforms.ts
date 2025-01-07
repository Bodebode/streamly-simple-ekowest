import { CachedMovie, Movie } from '@/types/movies';

export const transformCachedToMovie = (videos: CachedMovie[] | Movie[]): Movie[] => {
  return videos.map((video) => ({
    id: video.id,  // No need to create a numeric id anymore
    title: video.title,
    image: video.image,
    category: video.category,
    videoId: 'video_id' in video ? video.video_id : undefined
  }));
};