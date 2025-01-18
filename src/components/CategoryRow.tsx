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
  movies: Movie[]
  selectedVideoId: string | null;
  onVideoSelect: (videoId: string | null) => void;
  updateHighlyRated?: (movies: Movie[]) => void;
}

const CategoryRowComponent = ({ 
  title, 
  movies, 
  selectedVideoId, 
  onVideoSelect, 
  updateHighlyRated 
}: CategoryRowProps) => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies);
  const { isLoading } = useRelatedVideos(selectedVideoId, title, movies);

  const handleCloseVideo = useCallback(() => {
    onVideoSelect(null);
  }, [onVideoSelect]);

  useEffect(() => {
    // Only filter out movies without videoIds
    const validMovies = movies.filter(movie => movie.videoId);
    setFilteredMovies(validMovies.length > 0 ? validMovies : movies);
    
    // Still check video availability in the background
    checkVideoAvailability();
  }, [movies]);

  const isPlayingInThisRow = selectedVideoId && movies.some(movie => movie.videoId === selectedVideoId);

  return (
    <div className="mb-16">
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:text-center">
        {title} {isLoading && title === 'Comedy' && '(Loading...)'}
      </h2>
      <div className="relative px-4 md:px-16">
        <MovieCarousel
          movies={filteredMovies}
          onMovieSelect={onVideoSelect}
          isVideoPlaying={selectedVideoId !== null}
        />
        {isPlayingInThisRow && selectedVideoId && (
          <VideoPlayer videoId={selectedVideoId} onClose={handleCloseVideo} />
        )}
      </div>
    </div>
  );
};

export const CategoryRow = memo(CategoryRowComponent);

// Example implementation
<CategoryRow
  title="Your Section Title"
  movies={sectionMovies}
  selectedVideoId={selectedVideoId}
  onVideoSelect={(videoId) => setSelectedVideoId(videoId)}
/>
