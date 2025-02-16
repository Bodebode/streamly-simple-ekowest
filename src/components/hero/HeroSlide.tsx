
import { useTheme } from 'next-themes';

export interface HeroSlideProps {
  type?: 'video' | 'image';
  title: string;
  image: string;
  category: string;
  videoId?: string;
  onVideoSelect: (videoId: string | null) => void;
  isPlaying: boolean;
}

export const HeroSlide = ({ 
  title,
  image,
  category,
  videoId,
  onVideoSelect,
  isPlaying
}: HeroSlideProps) => {
  const { theme } = useTheme();

  return (
    <div className="relative w-full h-full">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-lg mb-4">{category}</p>
        {videoId && (
          <button
            onClick={() => onVideoSelect(isPlaying ? null : videoId)}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full transition-colors"
          >
            {isPlaying ? 'Stop Playing' : 'Play Now'}
          </button>
        )}
      </div>
    </div>
  );
};
