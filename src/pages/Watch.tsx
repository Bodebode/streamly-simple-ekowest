import { useParams } from 'react-router-dom';
import { MoviePlayer } from '../components/movie/MoviePlayer';

export const Watch = () => {
  const { videoId } = useParams();
  
  return (
    <div className="pt-16">
      <MoviePlayer videoId={videoId!} />
    </div>
  );
};

export default Watch;