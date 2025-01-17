import { useState } from 'react';

const YOUTUBE_API_KEY = 'YOUR_API_KEY';

export const useYoutubeSearch = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchVideos = async (query: string) => {
    setIsLoading(true);
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&type=video&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    setResults(data.items);
    setIsLoading(false);
  };

  return { results, isLoading, searchVideos };
};
