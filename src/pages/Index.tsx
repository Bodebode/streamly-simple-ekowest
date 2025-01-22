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
import { Movie } from '@/types/movies';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const { data: highlyRatedVideos, isLoading: isLoadingHighlyRated, refetch: refetchHighlyRated } = useHighlyRated();
  const { data: newReleases, isLoading: isLoadingNewReleases, refetch: refetchNewReleases } = useNewReleases();
  const { data: skits, isLoading: isLoadingSkits, refetch: refetchSkits } = useSkits();
  const { data: yorubaMovies, isLoading: isLoadingYoruba, refetch: refetchYoruba } = useYorubaMovies();
  const newReleaseRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { isPopulating, populateAllSections } = usePopulateSections({
    refetchYoruba,
    refetchHighlyRated,
    refetchNewReleases,
    refetchSkits
  });

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
          <CategoryRow 
            title="Trending Now" 
            movies={MOCK_MOVIES.trending as Movie[]}
            selectedVideoId={selectedVideoId}
            onVideoSelect={setSelectedVideoId}
          />
          <CategoryRow 
            title="Highly Rated" 
            movies={highlyRatedVideos ? transformCachedToMovie(highlyRatedVideos) : MOCK_MOVIES.highlyRated as Movie[]}
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
            movies={skits ? transformCachedToMovie(skits) : MOCK_MOVIES.skits as Movie[]}
            selectedVideoId={selectedVideoId}
            onVideoSelect={setSelectedVideoId}
          />
          <div ref={newReleaseRef}>
            <CategoryRow 
              title="New Release" 
              movies={newReleases ? transformCachedToMovie(newReleases) : MOCK_MOVIES.highlyRated as Movie[]}
              selectedVideoId={selectedVideoId}
              onVideoSelect={setSelectedVideoId}
            />
          </div>
        </div>
        <footer className="bg-background py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="https://www.youtube.com/t/terms">Terms of Service</a></li>
                  <li><a href="https://www.youtube.com/reporthistory">Report History</a></li>
                  <li><a href="https://www.youtube.com/howyoutubeworks/policies/community-guidelines/">Community Guidelines</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Privacy</h3>
                <ul className="space-y-2">
                  <li><a href="https://policies.google.com/privacy">Privacy Policy</a></li>
                  <li><a href="https://www.youtube.com/t/terms_dataprocessing">Data Processing Terms</a></li>
                  <li><a href="https://support.google.com/youtube/answer/7671399">Privacy Settings</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Safety</h3>
                <ul className="space-y-2">
                  <li><a href="https://support.google.com/youtube/answer/2802027">Report Content</a></li>
                  <li><a href="https://www.youtube.com/howyoutubeworks/policies/copyright/">Copyright</a></li>
                  <li><a href="https://support.google.com/youtube/answer/2801895">Safety Center</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="https://support.google.com/youtube/">Help Center</a></li>
                  <li><a href="https://support.google.com/youtube/gethelp">Contact Us</a></li>
                  <li><a href="https://www.youtube.com/creators/">Creator Support</a></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;