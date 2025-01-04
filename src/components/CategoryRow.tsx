import { MovieCard } from './MovieCard';
import { VideoPlayer } from './VideoPlayer';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  const handleCloseVideo = () => {
    setSelectedVideoId(null);
  };

  useEffect(() => {
    const fetchRelatedVideos = async (videoId: string) => {
      try {
        const { data, error } = await supabase.functions.invoke('get-related-videos', {
          body: { videoId }
        });

        if (error) throw error;

        if (data && updateHighlyRated) {
          const relatedMovies: Movie[] = data.map((video: any, index: number) => ({
            id: index + 1000, // Unique ID to avoid conflicts
            title: video.title,
            image: video.thumbnail,
            category: 'Highly Rated',
            videoId: video.id
          }));
          updateHighlyRated(relatedMovies);
        }
      } catch (error) {
        console.error('Error fetching related videos:', error);
      }
    };

    if (selectedVideoId) {
      fetchRelatedVideos(selectedVideoId);
    }
  }, [selectedVideoId, updateHighlyRated]);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
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