import { Play } from 'lucide-react';
import { HeroAnimation } from './HeroAnimation';

export const Hero = () => {
  return (
    <div className="relative h-[50vh] md:h-[80vh] mb-8">
      <HeroAnimation 
        fallback={
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000&q=80"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        }
      />
      <div className="absolute inset-0 bg-gradient-to-t from-koya-background via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 text-white">Featured Title</h1>
        <p className="text-sm md:text-xl text-koya-subtext mb-4 md:mb-6 max-w-2xl">
          Experience the latest blockbuster with stunning visuals and an engaging storyline that will keep you on the edge of your seat.
        </p>
        <button className="bg-koya-accent hover:bg-opacity-80 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg flex items-center gap-2 transition-colors text-sm md:text-base">
          <Play className="w-4 h-4 md:w-5 md:h-5" />
          Play Now
        </button>
      </div>
    </div>
  );
};