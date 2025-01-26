import { MovieData } from '../types/movies';

const trendingMovies = [
  {
    id: "1",
    title: "Do you Wanna Japa",
    image: "https://img.youtube.com/vi/Yg9z8lv1k_4/maxresdefault.jpg",
    category: "Trending",
    videoId: "Yg9z8lv1k_4"
  },
  {
    id: "12",
    title: "The Ghost Chase",
    image: "https://img.youtube.com/vi/3aQFM1ZtMG0/maxresdefault.jpg",
    category: "Trending",
    videoId: "3aQFM1ZtMG0"
  },
  {
    id: "3",
    title: "Love me again",
    image: "https://img.youtube.com/vi/pY4L5IXFXPA/maxresdefault.jpg",
    category: "Trending",
    videoId: "pY4L5IXFXPA"
  },
  {
    id: "4",
    title: "Black Ashes",
    image: "https://img.youtube.com/vi/grDl2G_3WuY/maxresdefault.jpg",
    category: "Trending",
    videoId: "grDl2G_3WuY"
  },
  {
    id: "5",
    title: "The Estate Cleaner",
    image: "https://img.youtube.com/vi/yPnj3pjdf64/maxresdefault.jpg",
    category: "Trending",
    videoId: "yPnj3pjdf64"
  },
  {
    id: "6",
    title: "Mercy",
    image: "https://img.youtube.com/vi/mjUH1mE3l9U/maxresdefault.jpg",
    category: "Trending",
    videoId: "mjUH1mE3l9U"
  },
  {
    id: "7",
    title: "When Love Spins",
    image: "https://img.youtube.com/vi/UPzXAvL36Ag/maxresdefault.jpg",
    category: "Trending",
    videoId: "UPzXAvL36Ag"
  },
  {
    id: "8",
    title: "Meet The Parents",
    image: "https://img.youtube.com/vi/2wiSLBpZpME/maxresdefault.jpg",
    category: "Trending",
    videoId: "2wiSLBpZpME"
  },
  {
    id: "9",
    title: "Agbeke Emi Oba",
    image: "https://img.youtube.com/vi/mMM8_AFwxBE/maxresdefault.jpg",
    category: "Trending",
    videoId: "mMM8_AFwxBE"
  },
  {
    id: "10",
    title: "Butterflies",
    image: "https://img.youtube.com/vi/wwgEkkapi-0/maxresdefault.jpg",
    category: "Trending",
    videoId: "wwgEkkapi-0"
  },
  {
    id: "11",
    title: "Beauty of Broken Things",
    image: "https://img.youtube.com/vi/GoWZfsdd1yw/maxresdefault.jpg",
    category: "Trending",
    videoId: "GoWZfsdd1yw"
  },
  {
    id: "2",
    title: "Love Unplanned",
    image: "https://img.youtube.com/vi/GfF4Dz_e3P4/maxresdefault.jpg",
    category: "Trending",
    videoId: "GfF4Dz_e3P4"
  }
];

const highlyRatedMovies = [
  {
    id: "hr1",
    title: "The Matrix Code",
    image: "https://img.youtube.com/vi/pY4L5IXFXPA/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "pY4L5IXFXPA",
    views: 750000,
    likeRatio: 0.85
  },
  {
    id: "hr2",
    title: "Digital Dreams",
    image: "https://img.youtube.com/vi/grDl2G_3WuY/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "grDl2G_3WuY",
    views: 600000,
    likeRatio: 0.9
  },
  {
    id: "hr3",
    title: "Code Runner",
    image: "https://img.youtube.com/vi/yPnj3pjdf64/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "yPnj3pjdf64",
    views: 520000,
    likeRatio: 0.82
  },
  {
    id: "hr4",
    title: "Binary Sunset",
    image: "https://img.youtube.com/vi/mjUH1mE3l9U/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "mjUH1mE3l9U",
    views: 800000,
    likeRatio: 0.88
  },
  {
    id: "hr5",
    title: "Digital Noir",
    image: "https://img.youtube.com/vi/UPzXAvL36Ag/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "UPzXAvL36Ag",
    views: 650000,
    likeRatio: 0.9
  },
  {
    id: "hr6",
    title: "Code Warriors",
    image: "https://img.youtube.com/vi/2wiSLBpZpME/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "2wiSLBpZpME",
    views: 700000,
    likeRatio: 0.87
  },
  {
    id: "hr7",
    title: "Matrix Reloaded",
    image: "https://img.youtube.com/vi/mMM8_AFwxBE/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "mMM8_AFwxBE",
    views: 900000,
    likeRatio: 0.91
  },
  {
    id: "hr8",
    title: "Cyber Protocol",
    image: "https://img.youtube.com/vi/wwgEkkapi-0/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "wwgEkkapi-0",
    views: 550000,
    likeRatio: 0.84
  },
  {
    id: "hr9",
    title: "Neural Network",
    image: "https://img.youtube.com/vi/GoWZfsdd1yw/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "GoWZfsdd1yw",
    views: 620000,
    likeRatio: 0.86
  },
  {
    id: "hr10",
    title: "Digital Fortress",
    image: "https://img.youtube.com/vi/GfF4Dz_e3P4/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "GfF4Dz_e3P4",
    views: 580000,
    likeRatio: 0.83
  },
  {
    id: "hr11",
    title: "Quantum Code",
    image: "https://img.youtube.com/vi/Yg9z8lv1k_4/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "Yg9z8lv1k_4",
    views: 720000,
    likeRatio: 0.89
  }
];

const skitsMovies = [
  {
    id: "s1",
    title: "Funny Moments Compilation",
    image: "https://img.youtube.com/vi/3aQFM1ZtMG0/maxresdefault.jpg",
    category: "Skits",
    videoId: "3aQFM1ZtMG0",
    duration: 480, // 8 minutes
    views: 15000
  },
  {
    id: "s2",
    title: "Stand-up Special",
    image: "https://img.youtube.com/vi/pY4L5IXFXPA/maxresdefault.jpg",
    category: "Skits",
    videoId: "pY4L5IXFXPA",
    duration: 300, // 5 minutes
    views: 25000
  },
  {
    id: "s3",
    title: "Comedy Sketch Show",
    image: "https://img.youtube.com/vi/grDl2G_3WuY/maxresdefault.jpg",
    category: "Skits",
    videoId: "grDl2G_3WuY",
    duration: 600, // 10 minutes
    views: 12000
  },
  {
    id: "s4",
    title: "Aki and Pawpaw: The Return",
    image: "https://img.youtube.com/vi/yPnj3pjdf64/maxresdefault.jpg",
    category: "Skits",
    videoId: "yPnj3pjdf64",
    duration: 540, // 9 minutes
    views: 18000
  },
  {
    id: "s5",
    title: "Hilarious Pranks",
    image: "https://img.youtube.com/vi/mjUH1mE3l9U/maxresdefault.jpg",
    category: "Skits",
    videoId: "mjUH1mE3l9U",
    duration: 420, // 7 minutes
    views: 22000
  },
  {
    id: "s6",
    title: "Comedy Central Presents",
    image: "https://img.youtube.com/vi/UPzXAvL36Ag/maxresdefault.jpg",
    category: "Skits",
    videoId: "UPzXAvL36Ag",
    duration: 300, // 5 minutes
    views: 30000
  },
  {
    id: "s7",
    title: "Late Night Comedy",
    image: "https://img.youtube.com/vi/2wiSLBpZpME/maxresdefault.jpg",
    category: "Skits",
    videoId: "2wiSLBpZpME",
    duration: 600, // 10 minutes
    views: 15000
  },
  {
    id: "s8",
    title: "Improv Comedy Show",
    image: "https://img.youtube.com/vi/mMM8_AFwxBE/maxresdefault.jpg",
    category: "Skits",
    videoId: "mMM8_AFwxBE",
    duration: 480, // 8 minutes
    views: 17000
  },
  {
    id: "s9",
    title: "Comedy Club Special",
    image: "https://img.youtube.com/vi/wwgEkkapi-0/maxresdefault.jpg",
    category: "Skits",
    videoId: "wwgEkkapi-0",
    duration: 300, // 5 minutes
    views: 20000
  },
  {
    id: "s10",
    title: "Best Stand-up Moments",
    image: "https://img.youtube.com/vi/GoWZfsdd1yw/maxresdefault.jpg",
    category: "Skits",
    videoId: "GoWZfsdd1yw",
    duration: 600, // 10 minutes
    views: 25000
  }
];

const newReleases = [
  {
    id: "nr1",
    title: "Latest Action Movie",
    image: "https://img.youtube.com/vi/Yg9z8lv1k_4/maxresdefault.jpg",
    category: "New Release",
    videoId: "Yg9z8lv1k_4",
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  },
  {
    id: "nr2",
    title: "Fresh Comedy",
    image: "https://img.youtube.com/vi/3aQFM1ZtMG0/maxresdefault.jpg",
    category: "New Release",
    videoId: "3aQFM1ZtMG0",
    publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
  },
  {
    id: "nr3",
    title: "New Thriller",
    image: "https://img.youtube.com/vi/pY4L5IXFXPA/maxresdefault.jpg",
    category: "New Release",
    videoId: "pY4L5IXFXPA",
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  },
  {
    id: "nr4",
    title: "Exciting Drama",
    image: "https://img.youtube.com/vi/grDl2G_3WuY/maxresdefault.jpg",
    category: "New Release",
    videoId: "grDl2G_3WuY",
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    id: "nr5",
    title: "Romantic Comedy",
    image: "https://img.youtube.com/vi/yPnj3pjdf64/maxresdefault.jpg",
    category: "New Release",
    videoId: "yPnj3pjdf64",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: "nr6",
    title: "Action Packed Adventure",
    image: "https://img.youtube.com/vi/mjUH1mE3l9U/maxresdefault.jpg",
    category: "New Release",
    videoId: "mjUH1mE3l9U",
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  }
];

export const MOCK_MOVIES: MovieData = {
  trending: trendingMovies,
  highlyRated: highlyRatedMovies,
  yoruba: [],
  skits: skitsMovies,
  newReleases
};
