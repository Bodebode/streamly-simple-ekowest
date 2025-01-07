import { VideoPlayer } from './VideoPlayer';
import { useState, memo, useCallback, useEffect } from 'react';
import { MovieCarousel } from './movie/MovieCarousel';
import { useRelatedVideos } from '@/hooks/use-related-videos';
import { toast } from 'sonner';
import { checkThumbnailQuality, checkVideoAvailability } from '@/utils/video-validation';

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
    const filterMovies = async () => {
      const validMovies = [];
      let lowQualityCount = 0;
      
      for (const movie of movies) {
        if (!movie.videoId) continue;
        
        const hasHighQualityThumbnail = await checkThumbnailQuality(movie);
        
        if (hasHighQualityThumbnail) {
          validMovies.push(movie);
        } else {
          lowQualityCount++;
        }
      }

      // Only show toast if all videos are low quality
      if (validMovies.length === 0 && lowQualityCount > 0) {
        console.log(`All ${lowQualityCount} videos in ${title} category have low quality thumbnails`);
        toast.error(`No high-quality videos available in ${title} category`);
        // Use original movies as fallback when all are filtered out
        setFilteredMovies(movies);
      } else {
        setFilteredMovies(validMovies.length > 0 ? validMovies : movies);
      }

      await checkVideoAvailability();
    };

    filterMovies();
  }, [movies, title]);

  // Don't return null, always show the section
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