import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';

export const Hero = () => {
  const { theme } = useTheme();
  const videoUrl = theme === 'light' 
    ? 'https://yuisywwlzorzdrzvjlvm.supabase.co/storage/v1/object/public/videos/Ekowest_Hero_Vid_White.mp4'
    : 'https://yuisywwlzorzdrzvjlvm.supabase.co/storage/v1/object/public/videos/Ekowest_Hero_Vid_Dark.mp4';

  const slides = [
    {
      type: 'video',
      src: videoUrl,
      duration: 39000, // 39 seconds
    },
    {
      type: 'image',
      src: '/videos/file-20220908-13-nwxk17.avif',
      duration: 4000,
    },
    {
      type: 'image',
      src: '/videos/Netflix-slate-e1692222322682.jpg',
      duration: 4000,
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentSlide = slides[currentIndex];
      setCurrentIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, slides[currentIndex].duration);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden mb-16">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {slide.type === 'image' ? (
            <img
              src={slide.src}
              alt={`Hero Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            >
              <source src={slide.src} type="video/mp4" />
            </video>
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
    </div>
  );
};