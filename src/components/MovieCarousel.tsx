import { useState, useEffect } from 'react';
import { MovieCard } from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '@/types/movies';

interface MovieCarouselProps {
  title?: string;
  movies: Movie[];
  onRefresh?: () => void;
}

export const MovieCarousel = ({ title, movies, onRefresh }: MovieCarouselProps) => {
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const moviesPerPage = 6;

  useEffect(() => {
    const uniqueMovies = movies.filter((movie, index, self) =>
      index === self.findIndex((m) => m.id === movie.id)
    );
    
    console.log('[MovieCarousel] Original movies count:', movies.length);
    console.log('[MovieCarousel] Unique movies count after filtering:', uniqueMovies.length);
    
    setDisplayedMovies(uniqueMovies);
  }, [movies]);

  const nextPage = () => {
    setCurrentPage((prev) => 
      prev + 1 >= Math.ceil(displayedMovies.length / moviesPerPage) ? 0 : prev + 1
    );
  };

  const prevPage = () => {
    setCurrentPage((prev) => 
      prev - 1 < 0 ? Math.ceil(displayedMovies.length / moviesPerPage) - 1 : prev - 1
    );
  };

  const visibleMovies = displayedMovies.slice(
    currentPage * moviesPerPage,
    (currentPage + 1) * moviesPerPage
  );

  return (
    <div className="relative">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      <div className="flex overflow-hidden">
        <div className="flex gap-4 transition-transform duration-300">
          {visibleMovies.map((movie) => (
            <MovieCard 
              key={movie.id}
              title={movie.title}
              image={movie.image}
              category={movie.category}
              videoId={movie.videoId}
              onMovieSelect={() => {}}
              isVideoPlaying={false}
            />
          ))}
        </div>
      </div>
      {displayedMovies.length > moviesPerPage && (
        <>
          <button
            onClick={prevPage}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextPage}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      )}
    </div>
  );
};