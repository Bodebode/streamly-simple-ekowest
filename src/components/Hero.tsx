import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { HeroSlide } from './hero/HeroSlide';
import { HeroControls } from './hero/HeroControls';
import { supabase } from '@/integrations/supabase/client';

export const Hero = () => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [themeKey, setThemeKey] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const loadVideo = async () => {
      const fileName = theme === 'light' ? 'Ekowest_Hero_Vid_White.mp4' : 'Ekowest_Hero_Vid_Dark.mp4';
      try {
        const { data } = await supabase
          .storage
          .from('videos')
          .getPublicUrl(fileName);
          
        if (!data?.publicUrl) {
          console.error('No public URL available for hero video');
          return;
        }
        
        setVideoUrl(data.publicUrl);
      } catch (error) {
        console.error('Failed to load hero video:', error);
      }
    };
    
    loadVideo();
  }, [theme]);

  const slides = [
    {
      type: 'video' as const,
      src: videoUrl,
      duration: 39000,  // Duration in milliseconds
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
          key={`${slide.id}-${themeKey}`}
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