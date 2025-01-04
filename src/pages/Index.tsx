import { Hero } from '../components/Hero';
import { CategoryRow } from '../components/CategoryRow';
import { Navbar } from '../components/Navbar';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { MovieData } from '../types/movies';
import { MOCK_MOVIES } from '../data/mockMovies';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [highlyRatedMovies, setHighlyRatedMovies] = useState(MOCK_MOVIES.highlyRated);

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
            movies={highlyRatedMovies}
            updateHighlyRated={setHighlyRatedMovies}
          />
          <CategoryRow title="Action" movies={MOCK_MOVIES.action} />
          <CategoryRow title="Comedy" movies={MOCK_MOVIES.comedy} />
        </div>
      </div>
    </div>
  );
};

export default Index;