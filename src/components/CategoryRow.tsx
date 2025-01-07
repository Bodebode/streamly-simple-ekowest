import { VideoPlayer } from './VideoPlayer';
import { useState, memo, useCallback, useEffect } from 'react';
import { MovieCarousel } from './movie/MovieCarousel';
import { useRelatedVideos } from '@/hooks/use-related-videos';

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
  const { isLoading } = useRelatedVideos(selectedVideoId, title, movies);

  const handleCloseVideo = useCallback(() => {
    setSelectedVideoId(null);
  }, []);

  // Automatically check thumbnails for Yoruba movies section
  useEffect(() => {
    if (title === 'Yoruba Movies') {
      console.log(`\n[Yoruba Movies Section] Checking ${movies.length} movies for thumbnail quality...`);
      movies.forEach(movie => {
        if (movie.videoId) {
          const maxResUrl = `https://img.youtube.com/vi/${movie.videoId}/maxresdefault.jpg`;
          const img = new Image();
          img.onload = () => {
            if (img.width === 120 && img.height === 90) {
              console.log(`[Yoruba Movie Quality Alert] "${movie.title}" (${movie.videoId}) has a low-quality thumbnail`);
            }
          };
          img.src = maxResUrl;
        }
      });
    }
  }, [title, movies]);

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:text-center">
        {title} {isLoading && title === 'Comedy' && '(Loading...)'}
      </h2>
      <div className="relative px-4 md:px-16">
        <MovieCarousel
          movies={movies}
          onMovieSelect={setSelectedVideoId}
          isVideoPlaying={selectedVideoId !== null}
        />
      </div>
      <VideoPlayer videoId={selectedVideoId} onClose={handleCloseVideo} />
    </div>
  );
};

export const CategoryRow = memo(CategoryRowComponent);