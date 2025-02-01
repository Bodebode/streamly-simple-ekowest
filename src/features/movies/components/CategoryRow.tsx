import { VideoPlayer } from '@/components/VideoPlayer';
import { useState, memo, useCallback, useEffect } from 'react';
import { MovieCarousel } from '@/components/movie/MovieCarousel';
import { useRelatedVideos } from '@/hooks/use-related-videos';
import { checkVideoAvailability } from '@/utils/video-validation';
import { Movie, CategoryRowProps } from '@/types/movies';
import { useSectionVisibility } from '@/hooks/use-section-visibility';

const CategoryRowComponent = ({ 
  title, 
  movies, 
  selectedVideoId, 
  onVideoSelect, 
  updateHighlyRated,
  refetchFunction 
}: CategoryRowProps) => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const { isLoading } = useRelatedVideos(selectedVideoId, title, movies);
  const isVisible = useSectionVisibility(title, filteredMovies, refetchFunction);

  const handleCloseVideo = useCallback(() => {
    onVideoSelect(null);
  }, [onVideoSelect]);

  useEffect(() => {
    // Optimize filtering by doing it once and memoizing the result
    const validMovies = movies.filter(movie => 
      movie.videoId && 
      (!selectedVideoId || movie.videoId !== selectedVideoId)
    );
    setFilteredMovies(validMovies.length > 0 ? validMovies : movies);
    
    // Check availability in background without blocking
    if (isVisible) {
      checkVideoAvailability();
    }
  }, [movies, selectedVideoId, isVisible]);

  const isPlayingInThisRow = selectedVideoId && movies.some(movie => movie.videoId === selectedVideoId);

  if (!isVisible) {
    return null;
  }

  return (
    <section 
      className="mb-16"
      aria-label={`${title} movie category`}
    >
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:text-center">
        {title} {isLoading && title === 'Comedy' && '(Loading...)'}
      </h2>
      <div 
        className="relative px-4 md:px-16"
        role="region"
        aria-label={`Scrollable ${title} movies`}
      >
        <MovieCarousel
          movies={filteredMovies}
          onMovieSelect={onVideoSelect}
          isVideoPlaying={selectedVideoId !== null}
        />
        {isPlayingInThisRow && selectedVideoId && (
          <VideoPlayer videoId={selectedVideoId} onClose={handleCloseVideo} />
        )}
      </div>
    </section>
  );
};

export const CategoryRow = memo(CategoryRowComponent);