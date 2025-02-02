import { MovieData } from '@/types/movies';

export const MOCK_MOVIES: MovieData = {
  trending: [
    {
      id: "1",  // Changed from number to string
      title: "Ijogbon",
      image: "/videos/Ijogbon.jpg",
      category: "trending"
    },
    {
      id: "2",
      title: "Brotherhood",
      image: "/videos/Netflix-slate-e1692222322682.jpg",
      category: "trending"
    },
    {
      id: "3",
      title: "Citation",
      image: "/videos/file-20220908-13-nwxk17.avif",
      category: "trending"
    }
  ],
  highlyRated: [
    {
      id: "4",
      title: "King of Boys",
      image: "/videos/maxresdefault.jpg",
      category: "highly-rated"
    }
  ],
  yoruba: [],
  skits: []
};