import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useHighlyRated } from '@/hooks/use-highly-rated';
import { useNewReleases } from '@/hooks/use-new-releases';
import { useSkits } from '@/hooks/use-skits';
import { useYorubaMovies } from '@/hooks/use-yoruba';
import { CategoryRow } from '../features/movies/components/CategoryRow';
import { MOCK_MOVIES } from '../data/mockMovies';

const Hero = () => {
  const { theme, setTheme } = useTheme();
  const { data: highlyRatedVideos, isLoading: isLoadingHighlyRated } = useHighlyRated();
  const { data: newReleases, isLoading: isLoadingNewReleases } = useNewReleases();
  const { data: skits, isLoading: isLoadingSkits } = useSkits();
  const { data: yorubaMovies, isLoading: isLoadingYoruba } = useYorubaMovies();

  useEffect(() => {
    // Fetch data or perform any side effects here
  }, []);

  // Update the type in the handleVideoSelect function
  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  return (
    <div className="hero">
      <h1 className="text-4xl font-bold">Welcome to the Movie App</h1>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          Toggle Theme
        </Button>
      </div>
      <CategoryRow 
        title="Trending Now" 
        movies={MOCK_MOVIES.trending}
        selectedVideoId={selectedVideoId}
        onVideoSelect={handleVideoSelect}
      />
      <CategoryRow 
        title="Highly Rated" 
        movies={highlyRatedVideos || []}
        selectedVideoId={selectedVideoId}
        onVideoSelect={handleVideoSelect}
      />
      <CategoryRow 
        title="Yoruba Movies" 
        movies={yorubaMovies || []}
        selectedVideoId={selectedVideoId}
        onVideoSelect={handleVideoSelect}
      />
      <CategoryRow 
        title="Skits" 
        movies={skits || []}
        selectedVideoId={selectedVideoId}
        onVideoSelect={handleVideoSelect}
      />
      <CategoryRow 
        title="New Releases" 
        movies={newReleases || []}
        selectedVideoId={selectedVideoId}
        onVideoSelect={handleVideoSelect}
      />
    </div>
  );
};

export default Hero;
