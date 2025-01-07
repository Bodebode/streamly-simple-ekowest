import { trendingMovies } from './movies/trending';
import { highlyRatedMovies } from './movies/highly-rated';
import { yorubaMovies } from './movies/yoruba';
import { skitsMovies } from './movies/skits';
import { MovieData } from '../types/movies';

export const MOCK_MOVIES: MovieData = {
  trending: trendingMovies,
  highlyRated: highlyRatedMovies,
  yoruba: yorubaMovies,
  skits: skitsMovies
};