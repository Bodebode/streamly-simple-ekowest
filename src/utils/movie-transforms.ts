import { CachedMovie, Movie } from '@/types/movies';

export const transformCachedToMovie = (videos: CachedMovie[] | Movie[]): Movie[] => {
  return videos.map((video): Movie => ({
    id: typeof video.id === 'number' ? video.id : String(video.id),
    title: video.title,
    image: video.image,
    category: video.category,
    videoId: 'video_id' in video ? video.video_id : video.videoId
  }));
};