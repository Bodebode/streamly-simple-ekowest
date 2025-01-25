import { useTheme } from 'next-themes';

interface HeroSlideProps {
  type: 'video' | 'image';
  src: string;
  index: number;
  currentIndex: number;
  key: number;
}

export const HeroSlide = ({ type, src, index, currentIndex, key }: HeroSlideProps) => {
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
        />
      ) : (
        <video
          key={key}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
};