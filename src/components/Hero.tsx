import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { VideoUpload } from './VideoUpload';
import { useAuth } from './AuthProvider';

export const Hero = () => {
  const [slides, setSlides] = useState<Array<{
    type: 'image' | 'video';
    src: string;
    duration: number;
  }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const loadVideos = async () => {
      try {
        // First, load the default slides
        const defaultSlides = [
          {
            type: 'image' as const,
            src: '/videos/file-20220908-13-nwxk17.avif',
            duration: 4000,
          },
          {
            type: 'image' as const,
            src: '/videos/Netflix-slate-e1692222322682.jpg',
            duration: 4000,
          },
          {
            type: 'video' as const,
            src: '/videos/wbd-hero-animation_24_0_0.second copy.mp4',
            duration: 10000,
          }
        ];

        // Then, fetch videos from Supabase storage
        const { data: storageFiles, error } = await supabase.storage
          .from('hero_videos')
          .list();

        if (error) {
          console.error('Error fetching videos:', error);
          setSlides(defaultSlides);
          return;
        }

        // Get public URLs for all videos
        const storageSlides = await Promise.all(
          storageFiles.map(async (file) => {
            const { data: { publicUrl } } = supabase.storage
              .from('hero_videos')
              .getPublicUrl(file.name);

            return {
              type: 'video' as const,
              src: publicUrl,
              duration: 10000, // Default duration for uploaded videos
            };
          })
        );

        // Combine default and storage slides
        setSlides([...defaultSlides, ...storageSlides]);
      } catch (error) {
        console.error('Error in loadVideos:', error);
        // Fallback to default slides if there's an error
        setSlides([
          {
            type: 'image',
            src: '/videos/file-20220908-13-nwxk17.avif',
            duration: 4000,
          },
          {
            type: 'image',
            src: '/videos/Netflix-slate-e1692222322682.jpg',
            duration: 4000,
          },
          {
            type: 'video',
            src: '/videos/wbd-hero-animation_24_0_0.second copy.mp4',
            duration: 10000,
          }
        ]);
      }
    };

    loadVideos();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      const currentSlide = slides[currentIndex];
      setCurrentIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, slides[currentIndex].duration);

    return () => clearInterval(timer);
  }, [currentIndex, slides]);

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

  if (slides.length === 0) {
    return <div>Loading...</div>;
  }

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

      {/* Upload Button - Only shown to authenticated users */}
      {user && (
        <div className="absolute top-4 right-4 z-20">
          <VideoUpload />
        </div>
      )}
    </div>
  );
};