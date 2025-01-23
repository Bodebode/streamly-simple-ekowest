import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { MovieCardPreview } from './movie/MovieCardPreview';
import { MovieCardBase } from './movie/MovieCardBase';
import { toast } from 'sonner';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface MovieCardProps {
  title: string;
  image: string;
  category: string;
  videoId?: string;
  onMovieSelect: (videoId: string) => void;
  isVideoPlaying: boolean;
  id: string;
}

const MovieCardComponent = ({ 
  title, 
  image, 
  category, 
  videoId, 
  onMovieSelect, 
  isVideoPlaying,
  id 
}: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [isInList, setIsInList] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const titleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Check if movie is in user's list
      const checkMyList = async () => {
        const { data } = await supabase
          .from('user_movie_lists')
          .select('movie_id')
          .eq('user_id', user.id)
          .eq('movie_id', id)
          .single();
        
        setIsInList(!!data);
      };
      
      checkMyList();
    }
  }, [user, id]);

  const clearTimers = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (titleTimerRef.current) {
      clearTimeout(titleTimerRef.current);
      titleTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  useEffect(() => {
    if (isVideoPlaying) {
      setShowPreview(false);
      setShowTitle(true);
      clearTimers();
    }
  }, [isVideoPlaying, clearTimers]);

  const handleMouseEnter = useCallback(() => {
    if (!isVideoPlaying) {
      setIsHovered(true);
      if (videoId) {
        hoverTimerRef.current = setTimeout(() => {
          const previewElements = document.querySelectorAll('iframe[src*="youtube.com"]');
          if (previewElements.length === 0) {
            setShowPreview(true);
          }
        }, 1400);
      }
    }
  }, [isVideoPlaying, videoId]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowPreview(false);
    setShowTitle(true);
    clearTimers();
  }, [clearTimers]);

  const handleClick = useCallback(() => {
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
  }, [videoId, onMovieSelect, clearTimers, title]);

  return (
    <div
      className={`relative movie-card w-full h-[210px] md:h-[300px] rounded-lg cursor-pointer ${isVideoPlaying ? 'pointer-events-none opacity-50' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
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
          movieId={id}
          isInList={isInList}
          onListChange={setIsInList}
        />
      )}
    </div>
  );
};

export const MovieCard = memo(MovieCardComponent);