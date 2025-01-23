import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';

export const Hero = () => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      type: 'video',
      src: '/videos/Ekowest Hero vid - Dark.mp4',
      darkOnly: true,
      duration: 10000,
    },
    {
      type: 'video',
      src: '/videos/Ekowest Hero vid - White.mp4',
      lightOnly: true,
      duration: 10000,
    }
  ];

  const filteredSlides = slides.filter(slide => {
    if (theme === 'dark') {
      return !slide.lightOnly;
    }
    return !slide.darkOnly;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === filteredSlides.length - 1 ? 0 : prevIndex + 1
      );
    }, filteredSlides[currentIndex]?.duration || 10000);

    return () => clearInterval(timer);
  }, [currentIndex, filteredSlides]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === filteredSlides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? filteredSlides.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden mb-16">
      {filteredSlides.map((slide, index) => (
        <div
          key={`${index}-${theme}`}
          className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {slide.type === 'video' ? (
            <video
              key={`video-${theme}-${index}`}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={slide.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={slide.src}
              alt={`Hero Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      {/* Hero Text Overlay */}
      <div className="absolute bottom-16 left-16 z-10">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Ekowest TV
        </h1>
        <p className="text-xl text-white">
          Experience the best of Nigerian entertainment
        </p>
      </div>

      {filteredSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-200 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-200 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};