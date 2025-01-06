import { Movie } from '../types/movies';

interface MovieCollection {
  trending: Movie[];
  highlyRated: Movie[];
  yoruba: Movie[];
  skits: Movie[];
}

export const MOCK_MOVIES: MovieCollection = {
  trending: [
    {
      id: 1,
      title: "Trending Movie 1",
      image: "https://example.com/image1.jpg",
      category: "Trending",
      videoId: "abc123"
    },
    {
      id: 2,
      title: "Trending Movie 2",
      image: "https://example.com/image2.jpg",
      category: "Trending",
      videoId: "def456"
    }
  ],
  highlyRated: [
    {
      id: 3,
      title: "Highly Rated Movie 1",
      image: "https://example.com/image3.jpg",
      category: "Highly Rated",
      videoId: "ghi789"
    },
    {
      id: 4,
      title: "Highly Rated Movie 2",
      image: "https://example.com/image4.jpg",
      category: "Highly Rated",
      videoId: "jkl012"
    }
  ],
  yoruba: [
    {
      id: 5,
      title: "Yoruba Movie 1",
      image: "https://example.com/image5.jpg",
      category: "Yoruba",
      videoId: "mno345"
    },
    {
      id: 6,
      title: "Yoruba Movie 2",
      image: "https://example.com/image6.jpg",
      category: "Yoruba",
      videoId: "pqr678"
    }
  ],
  skits: [
    {
      id: 7,
      title: "Skit 1",
      image: "https://example.com/image7.jpg",
      category: "Skits",
      videoId: "stu901"
    },
    {
      id: 8,
      title: "Skit 2",
      image: "https://example.com/image8.jpg",
      category: "Skits",
      videoId: "vwx234"
    }
  ]
};
