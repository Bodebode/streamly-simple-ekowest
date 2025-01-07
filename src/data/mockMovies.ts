import { trendingMovies } from './movies/trending';
import { highlyRatedMovies } from './movies/highly-rated';
import { yorubaMovies } from './movies/yoruba';
import { skitsMovies } from './movies/skits';
import { MovieData } from '../types/movies';

export const placeholderNewReleases = [
  {
    id: "new-1",
    title: "Latest Nollywood Release",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    category: "New Release",
    videoId: "placeholder-1"
  },
  {
    id: "new-2",
    title: "Fresh Nollywood Drama",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    category: "New Release",
    videoId: "placeholder-2"
  },
  {
    id: "new-3",
    title: "New Nigerian Cinema",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    category: "New Release",
    videoId: "placeholder-3"
  }
];

export const MOCK_MOVIES: MovieData = {
  trending: trendingMovies,
  highlyRated: highlyRatedMovies,
  yoruba: yorubaMovies,
  skits: skitsMovies
};