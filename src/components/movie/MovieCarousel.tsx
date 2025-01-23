import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MovieCard } from '../MovieCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { memo } from 'react';
import { Movie } from '@/types/movies';

interface MovieCarouselProps {
  movies: Movie[];
  onMovieSelect: (videoId: string | null) => void;
  isVideoPlaying: boolean;
}

const MovieCarouselComponent = ({ movies, onMovieSelect, isVideoPlaying }: MovieCarouselProps) => {
  const isMobile = useIsMobile();

  // Filter out duplicates based on videoId and ensure exactly 12 movies
  const uniqueMovies = movies.filter((movie, index, self) =>
    index === self.findIndex((m) => m.videoId === movie.videoId)
  ).slice(0, 12); // Ensure exactly 12 movies are shown

  // If we have less than 12 movies, duplicate the existing ones until we reach 12
  const displayMovies = [...uniqueMovies];
  while (displayMovies.length < 12) {
    displayMovies.push(...uniqueMovies.slice(0, 12 - displayMovies.length));
  }

  console.log(`[MovieCarousel] Original movies count: ${movies.length}`);
  console.log(`[MovieCarousel] Display movies count after ensuring 12: ${displayMovies.length}`);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true, // Enable loop for better UX
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {displayMovies.map((movie, index) => (
          <CarouselItem 
            key={`movie-${movie.videoId || movie.id}-${index}`}
            className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 transition-transform duration-300 hover:scale-105"
          >
            <MovieCard
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