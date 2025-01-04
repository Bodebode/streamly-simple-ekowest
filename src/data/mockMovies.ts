import { trendingMovies } from './movies/trending';
import { highlyRatedMovies } from './movies/highly-rated';
import { actionMovies } from './movies/action';
import { comedyMovies } from './movies/comedy';
import { MovieData } from '../types/movies';

export const MOCK_MOVIES: MovieData = {
  trending: trendingMovies,
  highlyRated: highlyRatedMovies,
  action: actionMovies,
  comedy: comedyMovies
};