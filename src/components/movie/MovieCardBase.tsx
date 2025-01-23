import { memo } from 'react';
import { MovieThumbnail } from './MovieThumbnail';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MovieCardBaseProps {
  title: string;
  image: string;
  category: string;
  videoId?: string;
  isHovered: boolean;
  isVideoPlaying: boolean;
  movieId: string;
  isInList: boolean;
  onListChange: (inList: boolean) => void;
}

const MovieCardBaseComponent = ({ 
  title, 
  image, 
  category, 
  videoId, 
  isHovered, 
  isVideoPlaying,
  movieId,
  isInList,
  onListChange
}: MovieCardBaseProps) => {
  const { user } = useAuth();

  const toggleMyList = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    try {
      if (isInList) {
        await supabase
          .from('user_movie_lists')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', movieId);
        
        toast.success('Removed from My List');
        onListChange(false);
      } else {
        await supabase
          .from('user_movie_lists')
          .insert([
            { user_id: user.id, movie_id: movieId }
          ]);
        
        toast.success('Added to My List');
        onListChange(true);
      }
    } catch (error) {
      toast.error('Failed to update My List');
      console.error('Error updating my list:', error);
    }
  };

  return (
    <div className="relative">
      <MovieThumbnail
        title={title}
        image={image}
        category={category}
        videoId={videoId}
        isHovered={isHovered}
        isVideoPlaying={isVideoPlaying}
      />
      {user && (
        <button
          onClick={toggleMyList}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200",
            isHovered ? "opacity-100" : "opacity-0",
            isInList ? "bg-koya-accent text-white" : "bg-black/60 text-white hover:bg-black/80"
          )}
        >
          {isInList ? (
            <BookmarkCheck className="w-5 h-5" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
};

export const MovieCardBase = memo(MovieCardBaseComponent);