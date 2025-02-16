
import { useEffect, useRef } from 'react';
import { Movie, CategoryRowProps } from '@/types/movies';
import { MovieCarousel } from './movie/MovieCarousel';

export const CategoryRow = ({
  title,
  movies,
  selectedVideoId,
  onVideoSelect,
  updateHighlyRated,
  refetchFunction
}: CategoryRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refetchFunction) {
      refetchFunction().then((newMovies: Movie[]) => {
        if (updateHighlyRated) {
          updateHighlyRated(newMovies);
        }
      });
    }
  }, [refetchFunction, updateHighlyRated]);

  const isVideoPlaying = selectedVideoId !== null;

  return (
    <div ref={rowRef} className="space-y-4 overflow-hidden">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <MovieCarousel
        movies={movies}
        onMovieSelect={onVideoSelect}
        isVideoPlaying={isVideoPlaying}
      />
    </div>
  );
};
