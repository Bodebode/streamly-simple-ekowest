import { MovieCard } from './MovieCard';
import { VideoPlayer } from './VideoPlayer';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface Movie {
  id: number;
  title: string;
  image: string;
  category: string;
  videoId?: string;
}

interface CategoryRowProps {
  title: string;
  movies: Movie[];
  updateHighlyRated?: (movies: Movie[]) => void;
}

export const CategoryRow = ({ title, movies, updateHighlyRated }: CategoryRowProps) => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseVideo = () => {
    setSelectedVideoId(null);
  };

  useEffect(() => {
    const fetchNollywoodVideos = async () => {
      try {
        // Only fetch for Highly Rated section
        if (title !== 'Highly Rated') return;
        
        setIsLoading(true);
        console.log('Fetching Nollywood videos...');
        
        const { data, error } = await supabase.functions.invoke('get-related-videos', {
          body: {}
        });

        if (error) {
          console.error('Supabase function error:', error);
          toast.error('Failed to fetch Nollywood movies');
          throw error;
        }

        if (data && updateHighlyRated) {
          console.log('Received Nollywood videos:', data);
          const nollywoodMovies: Movie[] = data.map((video: any, index: number) => ({
            id: index + 1000,
            title: video.title,
            image: video.thumbnail,
            category: 'Highly Rated',
            videoId: video.id
          }));
          updateHighlyRated(nollywoodMovies);
        }
      } catch (error) {
        console.error('Error fetching Nollywood videos:', error);
        toast.error('Failed to load Nollywood movies');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNollywoodVideos();
  }, [title, updateHighlyRated]);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {title} {isLoading && title === 'Highly Rated' && '(Loading...)'}
      </h2>
      <div className="category-row flex space-x-4 justify-center">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            image={movie.image}
            category={movie.category}
            videoId={movie.videoId}
            onMovieSelect={setSelectedVideoId}
            isVideoPlaying={selectedVideoId !== null}
          />
        ))}
      </div>
      <VideoPlayer videoId={selectedVideoId} onClose={handleCloseVideo} />
    </div>
  );
};