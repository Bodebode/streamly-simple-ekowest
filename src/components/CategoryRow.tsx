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
    const fetchRelatedVideos = async (videoId: string) => {
      try {
        // Only fetch related videos for Comedy section
        if (title !== 'Comedy') return;
        
        setIsLoading(true);
        console.log('Fetching related videos for:', videoId);
        
        const { data, error } = await supabase.functions.invoke('get-related-videos', {
          body: { videoId }
        });

        if (error) {
          console.error('Supabase function error:', error);
          toast.error('Failed to fetch related videos');
          throw error;
        }

        if (data) {
          console.log('Received related videos:', data);
          const relatedMovies: Movie[] = data.map((video: any, index: number) => ({
            id: index + 1000,
            title: video.title,
            image: video.thumbnail,
            category: 'Comedy',
            videoId: video.id
          }));
          
          console.log('Adding related movies:', relatedMovies);
          // Update the movies array with the new related videos
          movies.push(...relatedMovies);
        }
      } catch (error) {
        console.error('Error fetching related videos:', error);
        toast.error('Failed to load related videos');
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedVideoId) {
      console.log('Selected video ID:', selectedVideoId);
      fetchRelatedVideos(selectedVideoId);
    }
  }, [selectedVideoId, title]);

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:text-center">
        {title} {isLoading && title === 'Comedy' && '(Loading...)'}
      </h2>
      <div className="category-row flex space-x-4 px-4 md:px-16 pb-4 overflow-x-auto scrollbar-hide">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-none w-[140px] md:w-[200px]">
            <MovieCard
              title={movie.title}
              image={movie.image}
              category={movie.category}
              videoId={movie.videoId}
              onMovieSelect={setSelectedVideoId}
              isVideoPlaying={selectedVideoId !== null}
            />
          </div>
        ))}
      </div>
      <VideoPlayer videoId={selectedVideoId} onClose={handleCloseVideo} />
    </div>
  );
};