import { Hero } from '../components/Hero';
import { CategoryRow } from '../components/CategoryRow';
import { Navbar } from '../components/Navbar';

const MOCK_MOVIES = {
  trending: [
    {
      id: 1,
      title: "I Don Japa",
      image: `https://img.youtube.com/vi/CpnhWKrIrwE/maxresdefault.jpg`,
      category: 'Trending',
      videoId: 'CpnhWKrIrwE'
    },
    {
      id: 3,
      title: "Love Unplanned",
      image: `https://img.youtube.com/vi/GfF4Dz_e3P4/maxresdefault.jpg`,
      category: 'Trending',
      videoId: 'GfF4Dz_e3P4'
    },
    {
      id: 4,
      title: "Love me again",
      image: `https://img.youtube.com/vi/pY4L5IXFXPA/maxresdefault.jpg`,
      category: 'Trending',
      videoId: 'pY4L5IXFXPA'
    },
    {
      id: 5,
      title: "Black Ashes",
      image: `https://img.youtube.com/vi/grDl2G_3WuY/maxresdefault.jpg`,
      category: 'Trending',
      videoId: 'grDl2G_3WuY'
    },
    {
      id: 6,
      title: "The Estate Cleaner",
      image: `https://img.youtube.com/vi/yPnj3pjdf64/maxresdefault.jpg`,
      category: 'Trending',
      videoId: 'yPnj3pjdf64'
    },
    {
      id: 7,
      title: "Mercy",
      image: `https://img.youtube.com/vi/mjUH1mE3l9U/maxresdefault.jpg`,
      category: 'Trending',
      videoId: 'mjUH1mE3l9U'
    },
    {
      id: 9,
      title: "When Love Spins",
      image: `https://img.youtube.com/vi/UPzXAvL36Ag/maxresdefault.jpg`,
      category: 'Trending',
      videoId: 'UPzXAvL36Ag'
    }
  ],
  action: Array.from({ length: 7 }, (_, i) => ({
    id: i + 10,
    title: `Action Movie ${i + 1}`,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    category: 'Action'
  })),
  comedy: Array.from({ length: 7 }, (_, i) => ({
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