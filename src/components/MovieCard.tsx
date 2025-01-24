import { useState, useEffect } from 'react';
import { MovieCardPreview } from './movie/MovieCardPreview';
import { MovieCardBase } from './movie/MovieCardBase';
import { MovieCardActions } from './movie/MovieCardActions';
import { useMovieCardPreview } from './movie/MovieCardPreviewHandler';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import { MovieCardProps } from '@/types/movies';
import { VideoErrorBoundary } from './video/VideoErrorBoundary';

export const MovieCard = ({ 
  id, 
  title, 
  image, 
  category, 
  videoId, 
  onMovieSelect, 
  isVideoPlaying 
}: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showTitle, setShowTitle] = useState<boolean>(true);
  const [isInList, setIsInList] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
        
        if (error) throw error;
        setIsInList(!!data);
      } catch (error) {
        console.error('Error checking movie list status:', error);
        toast.error('Failed to check movie list status');
      }
    };

    checkIfInList();
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
      {user && (
        <MovieCardActions
          id={id}
          userId={user.id}
          isInList={isInList}
          isLoading={isLoading}
        />
      )}
      
      <VideoErrorBoundary>
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
      </VideoErrorBoundary>
    </div>
  );
};