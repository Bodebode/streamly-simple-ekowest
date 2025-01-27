import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

interface HeroSlide {
  id: string; // Changed from number to string
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

const Hero = () => {
  const { user } = useAuth();
  const [slides, setSlides] = useState<HeroSlide[]>([]);

  useEffect(() => {
    const fetchSlides = async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*');

      if (error) {
        console.error('Error fetching hero slides:', error);
        return;
      }

      setSlides(data);
    };

    fetchSlides();
  }, []);

  return (
    <div className="hero">
      {slides.map(slide => (
        <div key={slide.id} className="hero-slide">
          <img src={slide.thumbnailUrl} alt={slide.title} />
          <h2>{slide.title}</h2>
          <p>{slide.description}</p>
          <a href={slide.videoUrl} className="btn">Watch Now</a>
        </div>
      ))}
    </div>
  );
};

export default Hero;
