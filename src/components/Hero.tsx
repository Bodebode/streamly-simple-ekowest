import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { HeroSlide } from './hero/HeroSlide';

interface HeroData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

const Hero = () => {
  const { user } = useAuth();
  const [slides, setSlides] = useState<HeroData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchHighlyRatedVideos = async () => {
      const { data: videos, error } = await supabase
        .from('cached_videos')
        .select('*')
        .eq('category', 'Highly Rated')
        .limit(5);

      if (error) {
        console.error('Error fetching hero videos:', error);
        return;
      }

      const heroData = videos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.category,
        videoUrl: `https://www.youtube.com/watch?v=${video.video_id}`,
        thumbnailUrl: video.image
      }));

      setSlides(heroData);
    };

    fetchHighlyRatedVideos();
  }, []);

  return (
    <div className="relative w-full h-[60vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div key={slide.id} className={`absolute inset-0 transition-opacity duration-500 ${
          index === currentIndex ? 'opacity-100' : 'opacity-0'
        }`}>
          <img 
            src={slide.thumbnailUrl} 
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
            <div className="absolute bottom-0 left-0 p-8">
              <h2 className="text-4xl font-bold text-white mb-2">{slide.title}</h2>
              <p className="text-lg text-white/80 mb-4">{slide.description}</p>
              <a 
                href={slide.videoUrl} 
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch Now
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Hero;