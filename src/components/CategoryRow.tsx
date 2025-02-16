
import { VideoPlayer } from './VideoPlayer';
import { useState, memo, useCallback, useEffect } from 'react';
import { MovieCarousel } from './movie/MovieCarousel';
import { useRelatedVideos } from '@/hooks/use-related-videos';
import { checkVideoAvailability } from '@/utils/video-validation';
import { Movie, CategoryRowProps } from '@/types/movies';
import { useSectionVisibility } from '@/hooks/use-section-visibility';
import { prefetchVideos, updateVideoCache } from '@/utils/cache-manager';

const CategoryRowComponent = ({ 
  title, 
  movies, 
  selectedVideoId, 
  onVideoSelect, 
  updateHighlyRated,
  refetchFunction 
}: CategoryRowProps) => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies);
  const { isLoading } = useRelatedVideos(selectedVideoId, title, movies);
  const isVisible = useSectionVisibility(title, filteredMovies, refetchFunction);

  const handleCloseVideo = useCallback(() => {
    onVideoSelect(null);
  }, [onVideoSelect]);

  const handleVideoSelect = useCallback((videoId: string | null) => {
    if (videoId) {
      updateVideoCache(videoId);
    }
    onVideoSelect(videoId);
  }, [onVideoSelect]);

  useEffect(() => {
    if (filteredMovies.length < 12) {
      prefetchVideos(title);
    }
    
    const validMovies = movies.filter(movie => movie.videoId);
    setFilteredMovies(validMovies.length > 0 ? validMovies : movies);
    
    checkVideoAvailability();
  }, [movies, title]);

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
          onMovieSelect={handleVideoSelect}
          isVideoPlaying={selectedVideoId !== null}
        />
        {selectedVideoId && movies.some(movie => movie.videoId === selectedVideoId) && (
          <VideoPlayer videoId={selectedVideoId} onClose={handleCloseVideo} />
        )}
      </div>
    </section>
  );
};

export const CategoryRow = memo(CategoryRowComponent);
