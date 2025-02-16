import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroControlsProps {
  onPrevSlide: () => void;
  onNextSlide: () => void;
}

export const HeroControls = ({ onPrevSlide, onNextSlide }: HeroControlsProps) => {
  return (
    <>
      <button
        onClick={onPrevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-200 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={onNextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-200 z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </>
  );
};