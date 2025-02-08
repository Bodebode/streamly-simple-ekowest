
import { Hero } from '../components/Hero';
import { CategoryRow } from '../features/movies/components/CategoryRow';
import { Moon, Sun, RefreshCw } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useHighlyRated } from '@/hooks/use-highly-rated';
import { useNewReleases } from '@/hooks/use-new-releases';
import { useSkits } from '@/hooks/use-skits';
import { useYorubaMovies } from '@/hooks/use-yoruba';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePopulateSections } from '@/hooks/use-populate-sections';
import { transformCachedToMovie } from '@/utils/movie-transforms';
import { CachedMovie } from '@/types/movies';
import { MainLayout } from '@/layouts/MainLayout';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { NOLLYWOOD_SERIES_CRITERIA } from '@/constants/nollywood-criteria';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const { data: highlyRatedVideos, isLoading: isLoadingHighlyRated, refetch: refetchHighlyRated } = useHighlyRated();
  const { data: newReleases, isLoading: isLoadingNewReleases, refetch: refetchNewReleases } = useNewReleases();
  const { data: skits, isLoading: isLoadingSkits, refetch: refetchSkits } = useSkits();
  const { data: yorubaMovies, isLoading: isLoadingYoruba, refetch: refetchYoruba } = useYorubaMovies();
  const [nollywoodSeries, setNollywoodSeries] = useState<CachedMovie[]>([]);

  const { isPopulating, populateAllSections } = usePopulateSections({
    refetchYoruba,
    refetchHighlyRated,
    refetchNewReleases,
    refetchSkits
  });

  useEffect(() => {
    const fetchNollywoodSeries = async () => {
      const { data: series, error } = await supabase
        .from('cached_videos')
        .select('*')
        .eq('category', NOLLYWOOD_SERIES_CRITERIA.category)
        .eq('is_available', NOLLYWOOD_SERIES_CRITERIA.isAvailable)
        .eq('is_embeddable', NOLLYWOOD_SERIES_CRITERIA.isEmbeddable)
        .gte('views', NOLLYWOOD_SERIES_CRITERIA.minViews)
        .gte('duration', NOLLYWOOD_SERIES_CRITERIA.minDuration)
        .limit(NOLLYWOOD_SERIES_CRITERIA.limit);

      if (error) {
        console.error('Error fetching Nollywood series:', error);
        return;
      }

      setNollywoodSeries(series || []);
    };

    fetchNollywoodSeries();
  }, []);

  useEffect(() => {
    const checkContentFreshness = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-section-counts');
        
        if (error) {
          console.error('Error checking content freshness:', error);
          return;
        }

        if (data?.refreshed_sections?.length > 0) {
          toast.success('Fresh content has been loaded for you!');
          await Promise.all([
            refetchHighlyRated(),
            refetchNewReleases(),
            refetchSkits(),
            refetchYoruba()
          ]);
        }
      } catch (error) {
        console.error('Error in content freshness check:', error);
      }
    };

    checkContentFreshness();
  }, []);

  const transformedHighlyRated = highlyRatedVideos 
    ? transformCachedToMovie(highlyRatedVideos as unknown as CachedMovie[])
    : [];

  return (
    <MainLayout showMainFooter>
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
            movies={MOCK_MOVIES.trending}
            selectedVideoId={selectedVideoId}
            onVideoSelect={setSelectedVideoId}
          />
          <CategoryRow 
            title="Highly Rated" 
            movies={transformedHighlyRated}
            selectedVideoId={selectedVideoId}
            onVideoSelect={setSelectedVideoId}
            refetchFunction={refetchHighlyRated}
          />
          <CategoryRow 
            title="Yoruba Movies" 
            movies={yorubaMovies || []}
            selectedVideoId={selectedVideoId}
            onVideoSelect={setSelectedVideoId}
            refetchFunction={refetchYoruba}
          />
          <CategoryRow 
            title="Nollywood Series" 
            movies={transformCachedToMovie(nollywoodSeries)}
            selectedVideoId={selectedVideoId}
            onVideoSelect={setSelectedVideoId}
          />
          <CategoryRow 
            title="Skits" 
            movies={skits ? transformCachedToMovie(skits as unknown as CachedMovie[]) : []}
            selectedVideoId={selectedVideoId}
            onVideoSelect={setSelectedVideoId}
            refetchFunction={refetchSkits}
          />
          <CategoryRow 
            title="New Release" 
            movies={newReleases ? transformCachedToMovie(newReleases as unknown as CachedMovie[]) : []}
            selectedVideoId={selectedVideoId}
            onVideoSelect={setSelectedVideoId}
            refetchFunction={refetchNewReleases}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
