
import { useState, useEffect } from 'react';
import { MovieCardPreview } from './MovieCardPreview';
import { MovieCardBase } from './MovieCardBase';
import { MovieCardActions } from './MovieCardActions';
import { useMovieCardPreview } from './MovieCardPreviewHandler';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

interface MovieCardProps {
  id: string;
  title: string;
  image: string;
  category: string;
  videoId?: string;
  onMovieSelect: (videoId: string) => void;
  isVideoPlaying: boolean;
}

export const MovieCard = ({ 
  id, 
  title, 
  image, 
  category, 
  videoId, 
  onMovieSelect, 
  isVideoPlaying 
}: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [isInList, setIsInList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  const { handleMouseEnter, handleMouseLeave, clearTimers } = useMovieCardPreview({
    isVideoPlaying,
    videoId,
    onPreviewChange: setShowPreview,
    onTitleChange: setShowTitle
  });

  useEffect(() => {
    const checkIfInList = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('user_movie_lists')
          .select('movie_id')
          .eq('user_id', user.id)
          .eq('movie_id', id)
          .single();
        
        if (error) {
          console.error('Error checking movie list status:', error);
          return;
        }
        setIsInList(!!data);
      } catch (error) {
        console.error('Error in movie list check:', error);
      }
    };

    if (user?.id) {
      checkIfInList();
    }
  }, [user?.id, id]);

  useEffect(() => {
    if (isVideoPlaying) {
      setShowPreview(false);
      setShowTitle(true);
      clearTimers();
    }
  }, [isVideoPlaying, clearTimers]);

  const handleClick = () => {
    if (videoId) {
      console.log(`[MovieCard] Attempting to play video: ${title} (${videoId})`);
      onMovieSelect(videoId);
      setShowPreview(false);
      setShowTitle(true);
      clearTimers();
    } else {
      console.warn(`[MovieCard] No videoId available for: ${title}`);
      toast.error('This video is not available for playback');
    }
  };

  return (
    <div
      className="relative movie-card w-full h-[210px] md:h-[300px] rounded-lg cursor-pointer group"
      onMouseEnter={() => {
        setIsHovered(true);
        handleMouseEnter();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseLeave();
      }}
      onClick={handleClick}
    >
      <MovieCardActions
        id={id}
        userId={user?.id}
        isInList={isInList}
        isLoading={isLoading}
      />
      
      {showPreview && videoId && !isVideoPlaying ? (
        <MovieCardPreview
          videoId={videoId}
          title={title}
          category={category}
          showTitle={showTitle}
          onClick={handleClick}
        />
      ) : (
        <MovieCardBase
          title={title}
          image={image}
          category={category}
          videoId={videoId}
          isHovered={isHovered}
          isVideoPlaying={isVideoPlaying}
        />
      )}
    </div>
  );
};
