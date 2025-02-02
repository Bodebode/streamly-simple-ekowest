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
  const [optimizedImage, setOptimizedImage] = useState<string>(image);

  const { handleMouseEnter, handleMouseLeave, clearTimers } = useMovieCardPreview({
    isVideoPlaying,
    videoId,
    onPreviewChange: setShowPreview,
    onTitleChange: setShowTitle
  });

  useEffect(() => {
    const loadOptimizedImage = async () => {
      if (image.startsWith('http')) {
        setOptimizedImage(image);
        return;
      }

      try {
        const { data } = await supabase
          .storage
          .from('videos')
          .getPublicUrl(image);
          
        if (!data?.publicUrl) {
          console.error('No public URL available for image');
          return;
        }
        
        setOptimizedImage(data.publicUrl);
      } catch (error) {
        console.error('Failed to load optimized image:', error);
        setOptimizedImage(image); // Fallback to original image
      }
    };

    loadOptimizedImage();
  }, [image]);

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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
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
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Play ${title} - ${category}`}
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
            image={optimizedImage}
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