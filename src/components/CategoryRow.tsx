import { VideoPlayer } from './VideoPlayer';
import { useState } from 'react';
import { MovieCarousel } from './movie/MovieCarousel';
import { useRelatedVideos } from '@/hooks/use-related-videos';
import { Movie } from '@/types/movies';

interface CategoryRowProps {
  title: string;
  movies: Movie[];
  updateHighlyRated?: (movies: Movie[]) => void;
}

export const CategoryRow = ({ title, movies, updateHighlyRated }: CategoryRowProps) => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const { isLoading } = useRelatedVideos(selectedVideoId, title, movies);

  console.log(`CategoryRow ${title} - Number of movies:`, movies?.length);

  const handleCloseVideo = () => {
    setSelectedVideoId(null);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:text-center">
        {title} {isLoading && title === 'Comedy' && '(Loading...)'}
      </h2>
      <div className="relative px-4 md:px-16">
        <MovieCarousel
          movies={movies || []}
          onMovieSelect={setSelectedVideoId}
          isVideoPlaying={selectedVideoId !== null}
        />
      </div>
      <VideoPlayer videoId={selectedVideoId} onClose={handleCloseVideo} />
    </div>
  );
};