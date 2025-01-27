import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { HeroSlide } from './hero/HeroSlide';
import { HeroControls } from './hero/HeroControls';

export const Hero = () => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [themeKey, setThemeKey] = useState(0);

  const videoUrl = theme === 'light' 
    ? 'https://yuisywwlzorzdrzvjlvm.supabase.co/storage/v1/object/public/videos/Ekowest_Hero_Vid_White.mp4'
    : 'https://yuisywwlzorzdrzvjlvm.supabase.co/storage/v1/object/public/videos/Ekowest_Hero_Vid_Dark.mp4';

  const slides = [
    {
      type: 'video' as const,
      src: videoUrl,
      duration: 39000,
      id: 'hero-1'
    },
    {
      type: 'image' as const,
      src: '/videos/file-20220908-13-nwxk17.avif',
      duration: 4000,
      id: 'hero-2'
    },
    {
      type: 'image' as const,
      src: '/videos/Netflix-slate-e1692222322682.jpg',
      duration: 4000,
      id: 'hero-3'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, slides[currentIndex].duration);

    return () => clearInterval(timer);
  }, [currentIndex, slides]);

  useEffect(() => {
    setThemeKey(prev => prev + 1);
  }, [theme]);

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
        <HeroSlide
          key={`${index}-${themeKey}`}
          type={slide.type}
          src={slide.src}
          index={index}
          currentIndex={currentIndex}
        />
      ))}

      <div className="absolute bottom-16 left-16 z-10">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Ekowest TV
        </h1>
        <p className="text-xl text-white">
          Experience the best of Nigerian entertainment
        </p>
      </div>

      <HeroControls onPrevSlide={prevSlide} onNextSlide={nextSlide} />
    </div>
  );
};