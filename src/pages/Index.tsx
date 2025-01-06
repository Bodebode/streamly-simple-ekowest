import { Hero } from '../components/Hero';
import { CategoryRow } from '../components/CategoryRow';
import { Navbar } from '../components/Navbar';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useHighlyRated } from '@/hooks/use-highly-rated';
import { useNewReleases } from '@/hooks/use-new-releases';
import { useSkits } from '@/hooks/use-skits';
import { useYorubaMovies } from '@/hooks/use-yoruba';
import { MOCK_MOVIES } from '../data/mockMovies';
import { useEffect, useRef, memo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Movie } from '../types/movies';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const transformCachedToMovie = (movies: any[]): Movie[] => {
  return movies.map(movie => ({
    id: parseInt(movie.id),
    title: movie.title,
    image: movie.image,
    category: movie.category,
    videoId: movie.video_id
  }));
};

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { data: highlyRatedVideos, isLoading: isLoadingHighlyRated } = useHighlyRated();
  const { data: newReleases, isLoading: isLoadingNewReleases } = useNewReleases();
  const { data: skits, isLoading: isLoadingSkits } = useSkits();
  const { data: yorubaMovies, isLoading: isLoadingYoruba, refetch: refetchYoruba } = useYorubaMovies();
  const newReleaseRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [isPopulating, setIsPopulating] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (location.hash === '#new-release' && newReleaseRef.current) {
      newReleaseRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [location.hash]);

  const populateYorubaMovies = async () => {
    if (isPopulating) return;
    
    try {
      setIsPopulating(true);
      const toastId = toast.loading('Fetching Yoruba movies from YouTube... This may take up to 30 seconds.');
      
      const { data, error } = await supabase.functions.invoke('populate-yoruba');
      
      if (error) {
        console.error('Error populating Yoruba movies:', error);
        toast.error('Failed to fetch Yoruba movies', { id: toastId });
        return;
      }

      console.log('Population response:', data);
      toast.success('Successfully fetched Yoruba movies', { id: toastId });
      
      // Invalidate and refetch the Yoruba movies query
      await queryClient.invalidateQueries({ queryKey: ['yorubaMovies'] });
      await refetchYoruba();
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch Yoruba movies');
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={populateYorubaMovies}
          disabled={isPopulating}
          className="rounded-full w-10 h-10 bg-white dark:bg-koya-card"
        >
          Y
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full w-10 h-10 bg-white dark:bg-koya-card"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      <div className="pt-16">
        <Hero />
        <div className="pb-8">
          <CategoryRow title="Trending Now" movies={MOCK_MOVIES.trending} />
          <CategoryRow 
            title="Highly Rated" 
            movies={highlyRatedVideos ? transformCachedToMovie(highlyRatedVideos) : MOCK_MOVIES.highlyRated}
          />
          <CategoryRow 
            title="Yoruba Movies" 
            movies={yorubaMovies || MOCK_MOVIES.yoruba}
          />
          <CategoryRow 
            title="Skits" 
            movies={skits ? transformCachedToMovie(skits) : MOCK_MOVIES.skits}
          />
          <div ref={newReleaseRef} id="new-release">
            <CategoryRow 
              title="New Release" 
              movies={newReleases ? transformCachedToMovie(newReleases) : []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Index);