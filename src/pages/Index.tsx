import { Hero } from '../components/Hero';
import { CategoryRow } from '../components/CategoryRow';
import { Navbar } from '../components/Navbar';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useHighlyRated } from '@/hooks/use-highly-rated';
import { useNewReleases } from '@/hooks/use-new-releases';
import { useSkits } from '@/hooks/use-skits';
import { MOCK_MOVIES } from '../data/mockMovies';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { data: highlyRatedVideos, isLoading: isLoadingHighlyRated } = useHighlyRated();
  const { data: newReleases, isLoading: isLoadingNewReleases } = useNewReleases();
  const { data: skits, isLoading: isLoadingSkits } = useSkits();
  const newReleaseRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#new-release' && newReleaseRef.current) {
      newReleaseRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [location.hash, newReleases]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="fixed bottom-4 right-4 z-50">
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
            movies={highlyRatedVideos || MOCK_MOVIES.highlyRated}
          />
          <CategoryRow title="Yoruba Movies" movies={MOCK_MOVIES.yoruba} />
          <CategoryRow 
            title="Skits" 
            movies={skits || MOCK_MOVIES.skits} 
          />
          <div ref={newReleaseRef} id="new-release">
            <CategoryRow 
              title="New Release" 
              movies={newReleases || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;