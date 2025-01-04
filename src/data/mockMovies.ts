import { MovieData } from '../types/movies';

export const MOCK_MOVIES: MovieData = {
  trending: [
    {
      id: 1,
      title: "Trending Movie 1",
      image: "https://example.com/trending1.jpg",
      category: "Trending",
      videoId: "trending1"
    },
    {
      id: 2,
      title: "Trending Movie 2",
      image: "https://example.com/trending2.jpg",
      category: "Trending",
      videoId: "trending2"
    },
    {
      id: 3,
      title: "Trending Movie 3",
      image: "https://example.com/trending3.jpg",
      category: "Trending",
      videoId: "trending3"
    }
  ],
  highlyRated: [
    {
      id: 1,
      title: "Highly Rated Movie 1",
      image: "https://example.com/highlyrated1.jpg",
      category: "Highly Rated",
      videoId: "highlyrated1"
    },
    {
      id: 2,
      title: "Highly Rated Movie 2",
      image: "https://example.com/highlyrated2.jpg",
      category: "Highly Rated",
      videoId: "highlyrated2"
    },
    {
      id: 3,
      title: "Highly Rated Movie 3",
      image: "https://example.com/highlyrated3.jpg",
      category: "Highly Rated",
      videoId: "highlyrated3"
    }
  ],
  action: [
    {
      id: 1,
      title: "Action Movie 1",
      image: "https://example.com/action1.jpg",
      category: "Action",
      videoId: "action1"
    },
    {
      id: 2,
      title: "Action Movie 2",
      image: "https://example.com/action2.jpg",
      category: "Action",
      videoId: "action2"
    },
    {
      id: 3,
      title: "Action Movie 3",
      image: "https://example.com/action3.jpg",
      category: "Action",
      videoId: "action3"
    }
  ],
  comedy: [
    {
      id: 1,
      title: "Funny Moments Compilation",
      image: "https://i3.ytimg.com/vi/VB4CCHHYOqY/maxresdefault.jpg",
      category: "Comedy",
      videoId: "VB4CCHHYOqY"
    },
    {
      id: 2,
      title: "Stand-up Special",
      image: "https://i3.ytimg.com/vi/Ks-_Mh1QhMc/maxresdefault.jpg",
      category: "Comedy",
      videoId: "Ks-_Mh1QhMc"
    },
    {
      id: 3,
      title: "Comedy Sketch Show",
      image: "https://i3.ytimg.com/vi/8S0FDjFBj8o/maxresdefault.jpg",
      category: "Comedy",
      videoId: "8S0FDjFBj8o"
    }
  ]
};
