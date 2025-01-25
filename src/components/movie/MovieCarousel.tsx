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
import { MovieCarouselProps, Movie } from '@/types/movies';
import { VideoErrorBoundary } from '../video/VideoErrorBoundary';

const MovieCarouselComponent = ({ movies, onMovieSelect, isVideoPlaying }: MovieCarouselProps) => {
  const isMobile = useIsMobile();

  // Remove any duplicates based on videoId and ensure we have valid videos
  const uniqueMovies = movies?.reduce((acc: Movie[], current) => {
    const isDuplicate = acc.some(movie => movie.videoId === current.videoId);
    if (!isDuplicate && current.videoId && acc.length < 12) {
      acc.push(current);
    }
    return acc;
  }, []) || [];

  console.log(`[MovieCarousel] Original movies count: ${movies?.length || 0}`);
  console.log(`[MovieCarousel] Unique movies count after filtering: ${uniqueMovies.length}`);

  if (!movies || movies.length === 0) {
    return (
      <div className="flex items-center justify-center h-[210px] md:h-[300px] text-gray-500">
        No videos available in this section
      </div>
    );
  }

  return (
    <VideoErrorBoundary>
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
        {!isMobile && uniqueMovies.length > 0 && (
          <>
            <CarouselPrevious className="hidden md:flex -left-12 transition-opacity duration-300 hover:opacity-100 opacity-75" />
            <CarouselNext className="hidden md:flex -right-12 transition-opacity duration-300 hover:opacity-100 opacity-75" />
          </>
        )}
      </Carousel>
    </VideoErrorBoundary>
  );
};

export const MovieCarousel = memo(MovieCarouselComponent);