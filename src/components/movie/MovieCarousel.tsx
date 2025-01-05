import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MovieCard } from '../MovieCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface Movie {
  id: number;
  title: string;
  image: string;
  category: string;
  videoId?: string;
}

interface MovieCarouselProps {
  movies: Movie[];
  onMovieSelect: (videoId: string | null) => void;
  isVideoPlaying: boolean;
}

export const MovieCarousel = ({ movies, onMovieSelect, isVideoPlaying }: MovieCarouselProps) => {
  const isMobile = useIsMobile();

  return (
    <Carousel
      opts={{
        align: "start",
        loop: false,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {movies.map((movie) => (
          <CarouselItem 
            key={movie.id} 
            className="pl-2 md:pl-4 basis-[140px] md:basis-[200px] transition-transform duration-300 hover:scale-105"
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