import { MovieData } from '@/types/movies';

export const MOCK_MOVIES: MovieData = {
  trending: [
    {
      id: "1",  // Changed from number to string
      title: "The Wedding Party",
      image: "/videos/maxresdefault.jpg",
      category: "Comedy",
      videoId: "H-AfGh8gmiQ"
    },
    {
      id: "2",
      title: "King of Boys",
      image: "/videos/maxresdefault.jpg",
      category: "Drama",
      videoId: "H-AfGh8gmiQ"
    }
  ],
  highlyRated: [
    {
      id: "3",
      title: "Living in Bondage",
      image: "/videos/maxresdefault.jpg",
      category: "Drama",
      videoId: "H-AfGh8gmiQ"
    },
    {
      id: "4",
      title: "Osuofia in London",
      image: "/videos/maxresdefault.jpg",
      category: "Comedy",
      videoId: "H-AfGh8gmiQ"
    }
  ],
  yoruba: [
    {
      id: "5",
      title: "Aláàfin Ọ̀yọ́",
      image: "/videos/maxresdefault.jpg",
      category: "Historical",
      videoId: "H-AfGh8gmiQ"
    }
  ],
  skits: [
    {
      id: "6",
      title: "Funny Skit",
      image: "/videos/maxresdefault.jpg",
      category: "Comedy",
      videoId: "H-AfGh8gmiQ"
    }
  ]
};