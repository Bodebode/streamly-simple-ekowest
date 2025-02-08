
import { useEffect, useState } from 'react';
import { Navbar } from '@/layouts/Navbar';
import { MovieCard } from '@/components/MovieCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import { Movie } from '@/types/movies';

const MyList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyList = async () => {
      if (!user?.id) return;

      try {
        const { data: userMovies, error } = await supabase
          .from('user_movie_lists')
          .select(`
            movie_id,
            cached_videos (
              id,
              title,
              image,
              category,
              video_id
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        const formattedMovies: Movie[] = userMovies.map(item => ({
          id: item.cached_videos.id,
          title: item.cached_videos.title,
          image: item.cached_videos.image,
          category: item.cached_videos.category,
          videoId: item.cached_videos.video_id
        }));

        setMovies(formattedMovies);
      } catch (error) {
        console.error('Error fetching my list:', error);
        toast.error('Failed to load your list');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyList();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">My List</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Your list is empty</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add movies to your list by clicking the + button when hovering over a movie
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                image={movie.image}
                category={movie.category}
                videoId={movie.videoId}
                onMovieSelect={(videoId) => setSelectedVideoId(videoId)}
                isVideoPlaying={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;
