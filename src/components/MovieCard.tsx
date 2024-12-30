import { useState } from 'react';

interface MovieCardProps {
  title: string;
  image: string;
  category: string;
}

export const MovieCard = ({ title, image, category }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="movie-card w-[200px] h-[300px] rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover rounded-lg"
      />
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-75 p-4 flex flex-col justify-end rounded-lg">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-koya-subtext">{category}</p>
        </div>
      )}
    </div>
  );
};