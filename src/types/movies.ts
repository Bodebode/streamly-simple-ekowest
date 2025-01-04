export interface Movie {
  id: number;
  title: string;
  image: string;
  category: string;
  videoId?: string;
}

export interface MovieData {
  trending: Movie[];
  highlyRated: Movie[];
  action: Movie[];
  comedy: Movie[];
}