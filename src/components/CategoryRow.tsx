import { VideoPlayer } from './VideoPlayer';
import { useState, memo, useCallback, useEffect } from 'react';
import { MovieCarousel } from './movie/MovieCarousel';
import { useRelatedVideos } from '@/hooks/use-related-videos';
import { toast } from 'sonner';

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
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const { isLoading } = useRelatedVideos(selectedVideoId, title, movies);

  const handleCloseVideo = useCallback(() => {
    setSelectedVideoId(null);
  }, []);

  useEffect(() => {
    const checkThumbnailQuality = async (movie: Movie): Promise<boolean> => {
      if (!movie.videoId) return false;
      
      try {
        const img = new Image();
        const maxResUrl = `https://img.youtube.com/vi/${movie.videoId}/maxresdefault.jpg`;
        
        return new Promise((resolve) => {
          img.onload = () => {
            // YouTube returns a small 120x90 placeholder for non-existent maxresdefault
            const isHighQuality = !(img.width === 120 && img.height === 90);
            if (!isHighQuality) {
              console.log(`[Thumbnail Quality Alert] Low quality thumbnail detected for: "${movie.title}"`);
            }
            resolve(isHighQuality);
          };
          img.onerror = () => {
            console.log(`[Thumbnail Error] Failed to load thumbnail for: "${movie.title}"`);
            resolve(false);
          };
          img.src = maxResUrl;
        });
      } catch (error) {
        console.error(`[Thumbnail Error] Error checking thumbnail for: "${movie.title}"`, error);
        return false;
      }
    };

    const filterMovies = async () => {
      const validMovies = [];
      
      for (const movie of movies) {
        if (!movie.videoId) continue;
        
        const hasHighQualityThumbnail = await checkThumbnailQuality(movie);
        
        if (hasHighQualityThumbnail) {
          validMovies.push(movie);
        }
      }

      if (validMovies.length === 0) {
        toast.error(`No high-quality videos available in ${title} category`);
      }

      setFilteredMovies(validMovies);
    };

    filterMovies();
  }, [movies, title]);

  if (filteredMovies.length === 0) {
    return null;
  }

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