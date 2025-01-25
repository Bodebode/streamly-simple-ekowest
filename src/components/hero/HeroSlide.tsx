import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

interface HeroSlideProps {
  type: 'video' | 'image';
  src: string;
  index: number;
  currentIndex: number;
  key: number;
}

export const HeroSlide = ({ type, src, index, currentIndex, key }: HeroSlideProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (type === 'video' && index === currentIndex && !isLoaded) {
      setIsLoaded(true);
    }
  }, [type, index, currentIndex, isLoaded]);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  };

  return (
    <div
      key={`${index}-${key}`}
      className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
        index === currentIndex ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {type === 'image' ? (
        <img
          src={src}
          alt={`Hero Slide ${index + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        (index === currentIndex || isLoaded) && (
          <video
            ref={videoRef}
            key={key}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
            onLoadedData={handleVideoLoad}
          >
            <source src={src} type="video/mp4" />
          </video>
        )
      )}
    </div>
  );
};