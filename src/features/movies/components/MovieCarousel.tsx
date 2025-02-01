import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MovieCard } from './MovieCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { memo, useMemo } from 'react';
import { Movie } from '@/types/movies';

interface MovieCarouselProps {
  movies: Movie[];
  onMovieSelect: (videoId: string | null) => void;
  isVideoPlaying: boolean;
}

const MovieCarouselComponent = ({ movies, onMovieSelect, isVideoPlaying }: MovieCarouselProps) => {
  const isMobile = useIsMobile();

  // Memoize the filtered movies to prevent unnecessary re-renders
  const uniqueMovies = useMemo(() => {
    const seen = new Set<string>();
    return movies.reduce((acc: Movie[], current) => {
      if (!seen.has(current.videoId || '') && current.videoId && acc.length < 12) {
        seen.add(current.videoId);
        acc.push(current);
      }
      return acc;
    }, []);
  }, [movies]);

  console.log(`[MovieCarousel] Rendering with ${uniqueMovies.length} unique movies`);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: false,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {uniqueMovies.map((movie) => (
          <CarouselItem 
            key={`movie-${movie.videoId || movie.id}`}
            className="pl-2 md:pl-4 basis-[140px] md:basis-[200px] transition-transform duration-300 hover:scale-105"
          >
            <MovieCard
              id={movie.id}
              title={movie.title}
              image={movie.image}
              category={movie.category}
              videoId={movie.videoId}
              onMovieSelect={onMovieSelect}
              isVideoPlaying={isVideoPlaying}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {!isMobile && (
        <>
          <CarouselPrevious className="hidden md:flex -left-12 transition-opacity duration-300 hover:opacity-100 opacity-75" />
          <CarouselNext className="hidden md:flex -right-12 transition-opacity duration-300 hover:opacity-100 opacity-75" />
        </>
      )}
    </Carousel>
  );
};

export const MovieCarousel = memo(MovieCarouselComponent);