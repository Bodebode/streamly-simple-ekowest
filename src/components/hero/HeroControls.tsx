
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

export interface HeroControlsProps {
  onPrev: () => void;
  onNext: () => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  currentSlide: number;
  totalSlides: number;
}

export const HeroControls = ({ 
  onPrev,
  onNext,
  isPlaying,
  onPlayPause,
  currentSlide,
  totalSlides
}: HeroControlsProps) => {
  return (
    <>
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-200 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-200 z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
        <button
          onClick={onPlayPause}
          className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-200"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <span className="text-white text-sm">
          {currentSlide} / {totalSlides}
        </span>
      </div>
    </>
  );
};
