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
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_MOVIES } from '../data/mockMovies';
import { usePopulateSections } from '@/hooks/use-populate-sections';
import { transformCachedToMovie } from '@/utils/movie-transforms';
import { Movie, CachedMovie } from '@/types/movies';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const { data: highlyRatedVideos, isLoading: isLoadingHighlyRated, refetch: refetchHighlyRated } = useHighlyRated();
  const { data: newReleases, isLoading: isLoadingNewReleases, refetch: refetchNewReleases } = useNewReleases();
  const { data: skits, isLoading: isLoadingSkits, refetch: refetchSkits } = useSkits();
  const { data: yorubaMovies, isLoading: isLoadingYoruba, refetch: refetchYoruba } = useYorubaMovies();
  const newReleaseRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { isPopulating, populateAllSections } = usePopulateSections({
    refetchYoruba,
    refetchHighlyRated,
    refetchNewReleases,
    refetchSkits
  });

  useEffect(() => {
    if (location.hash === '#new-release' && newReleaseRef.current) {
      newReleaseRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [location.hash]);

  // Add effect to handle scrolling when video is selected
  useEffect(() => {
    if (selectedVideoId && playerRef.current) {
      const playerElement = playerRef.current;
      const elementRect = playerElement.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
      
      window.scrollTo({
        top: middle,
        behavior: 'smooth'
      });
    }
  }, [selectedVideoId]);

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
          {selectedVideoId && (
            <div ref={playerRef}>
              <CategoryRow 
                title="Now Playing"
                movies={[]}
                selectedVideoId={selectedVideoId}
                onVideoSelect={setSelectedVideoId}
              />
            </div>
          )}
          <CategoryRow 
            title="Trending Now" 
            movies={MOCK_MOVIES.trending}
            selectedVideoId={selectedVideoId}
            onVideoSelect={setSelectedVideoId}
          />
          <CategoryRow 
            title="Highly Rated" 
            movies={highlyRatedVideos ? transformCachedToMovie(highlyRatedVideos as CachedMovie[]) : MOCK_MOVIES.highlyRated}
            selectedVideoId={selectedVideoId}
            onVideoSelect={setSelectedVideoId}
          />
          <CategoryRow 
            title="Yoruba Movies" 
            movies={yorubaMovies || []}
            selectedVideoId={selectedVideoId}
            onVideoSelect={setSelectedVideoId}
          />
          <CategoryRow 
            title="Skits" 
            movies={skits ? transformCachedToMovie(skits as CachedMovie[]) : MOCK_MOVIES.skits}
            selectedVideoId={selectedVideoId}
            onVideoSelect={setSelectedVideoId}
          />
          <div ref={newReleaseRef} id="new-release">
            <CategoryRow 
              title="New Release" 
              movies={newReleases ? transformCachedToMovie(newReleases as CachedMovie[]) : []}
              selectedVideoId={selectedVideoId}
              onVideoSelect={setSelectedVideoId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;