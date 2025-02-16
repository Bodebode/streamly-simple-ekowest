
import { useState, useEffect } from 'react';
import HeroSlide from './hero/HeroSlide';
import HeroControls from './hero/HeroControls';
import { Movie } from '@/types/movies';

interface HeroProps {
  movies: Movie[];
}

export const Hero = ({ movies }: HeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && !selectedVideoId) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % movies.length);
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, movies.length, selectedVideoId]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % movies.length);
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleVideoSelect = (videoId: string | null) => {
    setSelectedVideoId(videoId);
    setIsPlaying(false);
  };

  if (!movies.length) {
    return null;
  }

  const currentMovie = movies[currentSlide];

  return (
    <div className="relative w-full h-[75vh] overflow-hidden">
      <HeroSlide
        id={currentMovie.id}
        title={currentMovie.title}
        image={currentMovie.image}
        category={currentMovie.category}
        videoId={currentMovie.videoId}
        onVideoSelect={handleVideoSelect}
        isPlaying={selectedVideoId === currentMovie.videoId}
      />
      <HeroControls
        onPrev={handlePrevSlide}
        onNext={handleNextSlide}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        currentSlide={currentSlide + 1}
        totalSlides={movies.length}
      />
    </div>
  );
};

export default Hero;
