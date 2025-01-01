import { Hero } from '../components/Hero';
import { CategoryRow } from '../components/CategoryRow';
import { Navbar } from '../components/Navbar';

const MOCK_MOVIES = {
  trending: Array.from({ length: 10 }, (_, i) => ({
    id: i,
    title: `Trending Movie ${i + 1}`,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    category: 'Trending'
  })),
  action: Array.from({ length: 10 }, (_, i) => ({
    id: i + 10,
    title: `Action Movie ${i + 1}`,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    category: 'Action'
  })),
  comedy: Array.from({ length: 10 }, (_, i) => ({
    id: i + 20,
    title: `Comedy Movie ${i + 1}`,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    category: 'Comedy'
  }))
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Hero />
        <div className="pb-8">
          <CategoryRow title="Trending Now" movies={MOCK_MOVIES.trending} />
          <CategoryRow title="Action" movies={MOCK_MOVIES.action} />
          <CategoryRow title="Comedy" movies={MOCK_MOVIES.comedy} />
        </div>
      </div>
    </div>
  );
};

export default Index;