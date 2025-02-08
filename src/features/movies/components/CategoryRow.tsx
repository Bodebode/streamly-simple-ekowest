
import { VideoPlayer } from '@/components/VideoPlayer';
import { useState, memo, useCallback, useEffect } from 'react';
import { MovieCarousel } from '@/components/movie/MovieCarousel';
import { useRelatedVideos } from '@/hooks/use-related-videos';
import { checkVideoAvailability } from '@/utils/video-validation';
import { Movie, CategoryRowProps } from '@/types/movies';
import { useSectionVisibility } from '@/hooks/use-section-visibility';
import { prefetchVideos } from '@/utils/cache-manager';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryRowComponent = ({ 
  title, 
  movies, 
  selectedVideoId, 
  onVideoSelect, 
  updateHighlyRated,
  refetchFunction,
  isLoading 
}: CategoryRowProps) => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies);
  const { isLoading: isLoadingRelated } = useRelatedVideos(selectedVideoId, title, movies);
  const isVisible = useSectionVisibility(title, filteredMovies, refetchFunction);

  const handleCloseVideo = useCallback(() => {
    onVideoSelect(null);
  }, [onVideoSelect]);

  useEffect(() => {
    // Only use mock data as an absolute last resort
    const validMovies = movies.filter(movie => movie.videoId);
    if (validMovies.length > 0) {
      console.log(`[CategoryRow] ${title}: Using ${validMovies.length} valid movies from API`);
      setFilteredMovies(validMovies);
    } else if (title === 'Highly Rated' && (!movies || movies.length < 12)) {
      console.log(`[CategoryRow] ${title}: No valid movies found, attempting refetch`);
      if (refetchFunction) {
        refetchFunction();
      }
    }

    if (filteredMovies.length < 12) {
      prefetchVideos(title);
    }
    
    checkVideoAvailability();
  }, [movies, title, refetchFunction, filteredMovies.length]);

  if (!isVisible) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="mb-16">
        <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:text-center">{title}</h2>
        <div className="px-4 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="aspect-video w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="mb-16"
      aria-label={`${title} movie category`}
    >
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:text-center">
        {title} {isLoadingRelated && title === 'Comedy' && '(Loading...)'}
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
        {selectedVideoId && movies.some(movie => movie.videoId === selectedVideoId) && (
          <VideoPlayer videoId={selectedVideoId} onClose={handleCloseVideo} />
        )}
      </div>
    </section>
  );
};

export const CategoryRow = memo(CategoryRowComponent);
