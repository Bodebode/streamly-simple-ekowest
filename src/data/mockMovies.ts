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
    id: "1",
    title: "The Matrix Code",
    image: "https://img.youtube.com/vi/pY4L5IXFXPA/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "pY4L5IXFXPA"
  },
  {
    id: "2",
    title: "Digital Dreams",
    image: "https://img.youtube.com/vi/grDl2G_3WuY/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "grDl2G_3WuY"
  },
  {
    id: "3",
    title: "Code Runner",
    image: "https://img.youtube.com/vi/yPnj3pjdf64/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "yPnj3pjdf64"
  },
  {
    id: "4",
    title: "Binary Sunset",
    image: "https://img.youtube.com/vi/mjUH1mE3l9U/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "mjUH1mE3l9U"
  },
  {
    id: "5",
    title: "Digital Noir",
    image: "https://img.youtube.com/vi/UPzXAvL36Ag/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "UPzXAvL36Ag"
  },
  {
    id: "6",
    title: "Code Warriors",
    image: "https://img.youtube.com/vi/2wiSLBpZpME/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "2wiSLBpZpME"
  },
  {
    id: "7",
    title: "Matrix Reloaded",
    image: "https://img.youtube.com/vi/mMM8_AFwxBE/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "mMM8_AFwxBE"
  },
  {
    id: "8",
    title: "Cyber Protocol",
    image: "https://img.youtube.com/vi/wwgEkkapi-0/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "wwgEkkapi-0"
  },
  {
    id: "9",
    title: "Neural Network",
    image: "https://img.youtube.com/vi/GoWZfsdd1yw/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "GoWZfsdd1yw"
  },
  {
    id: "10",
    title: "Digital Fortress",
    image: "https://img.youtube.com/vi/GfF4Dz_e3P4/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "GfF4Dz_e3P4"
  },
  {
    id: "11",
    title: "Quantum Code",
    image: "https://img.youtube.com/vi/Yg9z8lv1k_4/maxresdefault.jpg",
    category: "Highly Rated",
    videoId: "Yg9z8lv1k_4"
  }
];

const yorubaMovies = [
  {
    id: "1",
    title: "Digital Storm",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80",
    category: "Yoruba Movies"
  },
  {
    id: "2",
    title: "Code Breaker",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80",
    category: "Yoruba Movies"
  },
  {
    id: "3",
    title: "Matrix Revolution",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80",
    category: "Yoruba Movies"
  },
  {
    id: "4",
    title: "Cyber Chase",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80",
    category: "Yoruba Movies"
  },
  {
    id: "5",
    title: "Digital Warrior",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80",
    category: "Yoruba Movies"
  },
  {
    id: "6",
    title: "Code Master",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80",
    category: "Yoruba Movies"
  },
  {
    id: "7",
    title: "Binary Battle",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80",
    category: "Yoruba Movies"
  },
  {
    id: "8",
    title: "Cyber Assault",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80",
    category: "Yoruba Movies"
  },
  {
    id: "9",
    title: "Digital Defense",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80",
    category: "Yoruba Movies"
  },
  {
    id: "10",
    title: "Code Combat",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80",
    category: "Yoruba Movies"
  },
  {
    id: "11",
    title: "Binary Force",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80",
    category: "Yoruba Movies"
  },
  {
    id: "12",
    title: "Tech Warrior",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80",
    category: "Yoruba Movies"
  }
];

const skitsMovies = [
  {
    id: "1",
    title: "Funny Moments Compilation",
    image: "https://img.youtube.com/vi/3aQFM1ZtMG0/maxresdefault.jpg",
    category: "Skits",
    videoId: "3aQFM1ZtMG0"
  },
  {
    id: "2",
    title: "Stand-up Special",
    image: "https://img.youtube.com/vi/pY4L5IXFXPA/maxresdefault.jpg",
    category: "Skits",
    videoId: "pY4L5IXFXPA"
  },
  {
    id: "3",
    title: "Comedy Sketch Show",
    image: "https://img.youtube.com/vi/grDl2G_3WuY/maxresdefault.jpg",
    category: "Skits",
    videoId: "grDl2G_3WuY"
  },
  {
    id: "4",
    title: "Aki and Pawpaw: The Return",
    image: "https://img.youtube.com/vi/yPnj3pjdf64/maxresdefault.jpg",
    category: "Skits",
    videoId: "yPnj3pjdf64"
  },
  {
    id: "5",
    title: "Hilarious Pranks",
    image: "https://img.youtube.com/vi/mjUH1mE3l9U/maxresdefault.jpg",
    category: "Skits",
    videoId: "mjUH1mE3l9U"
  },
  {
    id: "6",
    title: "Comedy Central Presents",
    image: "https://img.youtube.com/vi/UPzXAvL36Ag/maxresdefault.jpg",
    category: "Skits",
    videoId: "UPzXAvL36Ag"
  },
  {
    id: "7",
    title: "Late Night Comedy",
    image: "https://img.youtube.com/vi/2wiSLBpZpME/maxresdefault.jpg",
    category: "Skits",
    videoId: "2wiSLBpZpME"
  },
  {
    id: "8",
    title: "Improv Comedy Show",
    image: "https://img.youtube.com/vi/mMM8_AFwxBE/maxresdefault.jpg",
    category: "Skits",
    videoId: "mMM8_AFwxBE"
  },
  {
    id: "9",
    title: "Comedy Club Special",
    image: "https://img.youtube.com/vi/wwgEkkapi-0/maxresdefault.jpg",
    category: "Skits",
    videoId: "wwgEkkapi-0"
  },
  {
    id: "10",
    title: "Best Stand-up Moments",
    image: "https://img.youtube.com/vi/GoWZfsdd1yw/maxresdefault.jpg",
    category: "Skits",
    videoId: "GoWZfsdd1yw"
  }
];

export const MOCK_MOVIES: MovieData = {
  trending: trendingMovies,
  highlyRated: highlyRatedMovies,
  yoruba: yorubaMovies,
  skits: skitsMovies
};