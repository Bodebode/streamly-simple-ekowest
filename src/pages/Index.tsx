import { Hero } from '../components/Hero';
import { CategoryRow } from '../components/CategoryRow';
import { Navbar } from '../components/Navbar';
import { Moon, Sun, RefreshCw } from 'lucide-react';
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
  const { data: highlyRatedVideos, isLoading: isLoadingHighlyRated, refetch: refetchHighlyRated } = useHighlyRated();
  const { data: newReleases, isLoading: isLoadingNewReleases, refetch: refetchNewReleases } = useNewReleases();
  const { data: skits, isLoading: isLoadingSkits, refetch: refetchSkits } = useSkits();
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

  const populateAllSections = async () => {
    if (isPopulating) return;
    
    try {
      setIsPopulating(true);
      const toastId = toast.loading('Fetching fresh content for all sections... This may take a minute.');
      
      // Fetch all sections in parallel
      const promises = [
        supabase.functions.invoke('populate-yoruba'),
        supabase.functions.invoke('get-highly-rated'),
        supabase.functions.invoke('get-new-releases'),
        supabase.functions.invoke('get-skits')
      ];

      const results = await Promise.allSettled(promises);
      
      let successCount = 0;
      let errorCount = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successCount++;
        } else {
          console.error(`Error in promise ${index}:`, result.reason);
          errorCount++;
        }
      });

      // Invalidate and refetch all queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['yorubaMovies'] }),
        queryClient.invalidateQueries({ queryKey: ['highlyRated'] }),
        queryClient.invalidateQueries({ queryKey: ['newReleases'] }),
        queryClient.invalidateQueries({ queryKey: ['skits'] })
      ]);

      // Refetch all sections
      await Promise.all([
        refetchYoruba(),
        refetchHighlyRated(),
        refetchNewReleases(),
        refetchSkits()
      ]);
      
      if (errorCount === 0) {
        toast.success('Successfully refreshed all sections', { id: toastId });
      } else {
        toast.warning(`Refreshed ${successCount} sections, ${errorCount} failed`, { id: toastId });
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to refresh content');
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
          onClick={populateAllSections}
          disabled={isPopulating}
          className="rounded-full w-10 h-10 bg-white dark:bg-koya-card"
        >
          <RefreshCw className={`h-5 w-5 ${isPopulating ? 'animate-spin' : ''}`} />
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
            movies={yorubaMovies || []}
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