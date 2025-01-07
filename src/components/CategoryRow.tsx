import { VideoPlayer } from './VideoPlayer';
import { useState, memo, useCallback, useEffect } from 'react';
import { MovieCarousel } from './movie/MovieCarousel';
import { useRelatedVideos } from '@/hooks/use-related-videos';
import { checkVideoAvailability } from '@/utils/video-validation';

interface Movie {
  id: number;
  title: string;
  image: string;
  category: string;
  videoId?: string;
}

interface CategoryRowProps {
  title: string;
  movies: Movie[];
  updateHighlyRated?: (movies: Movie[]) => void;
}

const CategoryRowComponent = ({ title, movies, updateHighlyRated }: CategoryRowProps) => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies);
  const { isLoading } = useRelatedVideos(selectedVideoId, title, movies);

  const handleCloseVideo = useCallback(() => {
    setSelectedVideoId(null);
  }, []);

  useEffect(() => {
    // Only filter out movies without videoIds
    const validMovies = movies.filter(movie => movie.videoId);
    setFilteredMovies(validMovies.length > 0 ? validMovies : movies);
    
    // Still check video availability in the background
    checkVideoAvailability();
  }, [movies]);

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:text-center">
        {title} {isLoading && title === 'Comedy' && '(Loading...)'}
      </h2>
      <div className="relative px-4 md:px-16">
        <MovieCarousel
          movies={filteredMovies}
          onMovieSelect={setSelectedVideoId}
          isVideoPlaying={selectedVideoId !== null}
        />
        {selectedVideoId && <VideoPlayer videoId={selectedVideoId} onClose={handleCloseVideo} />}
      </div>
    </div>
  );
};

export const CategoryRow = memo(CategoryRowComponent);