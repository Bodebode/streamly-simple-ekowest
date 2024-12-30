import { MovieCard } from './MovieCard';

interface CategoryRowProps {
  title: string;
  movies: Array<{
    id: number;
    title: string;
    image: string;
    category: string;
  }>;
}

export const CategoryRow = ({ title, movies }: CategoryRowProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 px-4">{title}</h2>
      <div className="category-row flex space-x-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            image={movie.image}
            category={movie.category}
          />
        ))}
      </div>
    </div>
  );
};