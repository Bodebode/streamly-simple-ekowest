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

  // Filter out duplicates based on id and ensure movies have videoIds
  const uniqueMovies = movies
    .filter((movie, index, self) => 
      movie.videoId && // Ensure movie has videoId
      index === self.findIndex((m) => m.id === movie.id) // Keep only first occurrence
    )
    .slice(0, 12); // Limit to 12 movies

  console.log(`[MovieCarousel] Total movies received: ${movies.length}`);
  console.log(`[MovieCarousel] Unique movies to display: ${uniqueMovies.length}`);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {uniqueMovies.map((movie) => (
          <CarouselItem 
            key={movie.id}
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