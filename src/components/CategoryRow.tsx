import { MovieCard } from './MovieCard';
import { VideoPlayer } from './VideoPlayer';
import { useState } from 'react';

interface CategoryRowProps {
  title: string;
  movies: Array<{
    id: number;
    title: string;
    image: string;
    category: string;
    videoId?: string;
  }>;
}

export const CategoryRow = ({ title, movies }: CategoryRowProps) => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

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
          />
        ))}
      </div>
      <VideoPlayer videoId={selectedVideoId} />
    </div>
  );
};