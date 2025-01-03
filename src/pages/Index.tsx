import { Hero } from '../components/Hero';
import { CategoryRow } from '../components/CategoryRow';
import { Navbar } from '../components/Navbar';
import { EmailPopup } from '../components/EmailPopup';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

const MOCK_MOVIES = {
  trending: [
    {
      id: 1,
      title: "Do you Wanna Japa",
      image: `https://img.youtube.com/vi/Yg9z8lv1k_4/maxresdefault.jpg`,
      category: 'Trending',
      videoId: 'Yg9z8lv1k_4'
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
  highlyRated: [
    {
      id: 30,
      title: "Brotherhood",
      image: `https://img.youtube.com/vi/vTB0HL8vxB4/maxresdefault.jpg`,
      category: 'Highly Rated',
      videoId: 'vTB0HL8vxB4'
    },
    {
      id: 31,
      title: "Battle on Buka Street",
      image: `https://img.youtube.com/vi/jFoQ4RLPXQs/maxresdefault.jpg`,
      category: 'Highly Rated',
      videoId: 'jFoQ4RLPXQs'
    },
    {
      id: 32,
      title: "King of Thieves",
      image: `https://img.youtube.com/vi/mVtN4nUBhx4/maxresdefault.jpg`,
      category: 'Highly Rated',
      videoId: 'mVtN4nUBhx4'
    },
    {
      id: 33,
      title: "Gangs of Lagos",
      image: `https://img.youtube.com/vi/SMtT8MJEXtE/maxresdefault.jpg`,
      category: 'Highly Rated',
      videoId: 'SMtT8MJEXtE'
    },
    {
      id: 34,
      title: "Blood Sisters",
      image: `https://img.youtube.com/vi/QF6qmuqywXk/maxresdefault.jpg`,
      category: 'Highly Rated',
      videoId: 'QF6qmuqywXk'
    },
    {
      id: 35,
      title: "Anikulapo",
      image: `https://img.youtube.com/vi/RGVXBlyNZXo/maxresdefault.jpg`,
      category: 'Highly Rated',
      videoId: 'RGVXBlyNZXo'
    },
    {
      id: 36,
      title: "The Black Book",
      image: `https://img.youtube.com/vi/gKR3J0lFZVw/maxresdefault.jpg`,
      category: 'Highly Rated',
      videoId: 'gKR3J0lFZVw'
    }
  ],
  action: [
    {
      id: 10,
      title: `Action Movie 1`,
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728',  // Movie theater
      category: 'Action'
    },
    {
      id: 11,
      title: `Action Movie 2`,
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728',  // Movie theater
      category: 'Action'
    },
    {
      id: 12,
      title: `Action Movie 3`,
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728',  // Movie theater
      category: 'Action'
    },
    {
      id: 13,
      title: `Action Movie 4`,
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728',  // Movie theater
      category: 'Action'
    },
    {
      id: 14,
      title: `Action Movie 5`,
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728',  // Movie theater
      category: 'Action'
    },
    {
      id: 15,
      title: `Action Movie 6`,
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728',  // Movie theater
      category: 'Action'
    },
    {
      id: 16,
      title: `Action Movie 7`,
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728',  // Movie theater
      category: 'Action'
    }
  ],
  comedy: [
    {
      id: 20,
      title: `Comedy Movie 1`,
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',  // Cinema reels
      category: 'Comedy'
    },
    {
      id: 21,
      title: `Comedy Movie 2`,
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',  // Cinema reels
      category: 'Comedy'
    },
    {
      id: 22,
      title: `Comedy Movie 3`,
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',  // Cinema reels
      category: 'Comedy'
    },
    {
      id: 23,
      title: `Comedy Movie 4`,
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',  // Cinema reels
      category: 'Comedy'
    },
    {
      id: 24,
      title: `Comedy Movie 5`,
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',  // Cinema reels
      category: 'Comedy'
    },
    {
      id: 25,
      title: `Comedy Movie 6`,
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',  // Cinema reels
      category: 'Comedy'
    },
    {
      id: 26,
      title: `Comedy Movie 7`,
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',  // Cinema reels
      category: 'Comedy'
    }
  ]
};

const Index = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <Navbar />
      <EmailPopup />
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
          <CategoryRow title="Highly Rated" movies={MOCK_MOVIES.highlyRated} />
          <CategoryRow title="Action" movies={MOCK_MOVIES.action} />
          <CategoryRow title="Comedy" movies={MOCK_MOVIES.comedy} />
        </div>
      </div>
    </div>
  );
};

export default Index;
