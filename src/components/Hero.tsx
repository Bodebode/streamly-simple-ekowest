import { Play } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative h-[80vh] mb-8">
      <img
        src="https://images.unsplash.com/photo-1608889825103-eb5ed706fc64"
        alt="African Cinema"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-koya-background via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 p-8 w-full">
        <h1 className="text-5xl font-bold mb-4">Featured Title</h1>
        <p className="text-xl text-koya-subtext mb-6 max-w-2xl">
          Experience the latest blockbuster with stunning visuals and an engaging storyline that will keep you on the edge of your seat.
        </p>
        <button className="bg-koya-accent hover:bg-opacity-80 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors">
          <Play className="w-5 h-5" />
          Play Now
        </button>
      </div>
    </div>
  );
};