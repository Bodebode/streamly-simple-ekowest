import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { MovieCardPreview } from './movie/MovieCardPreview';
import { MovieCardBase } from './movie/MovieCardBase';
import { Plus, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

interface MovieCardProps {
  id: string;
  title: string;
  image: string;
  category: string;
  videoId?: string;
  onMovieSelect: (videoId: string) => void;
  isVideoPlaying: boolean;
}

const MovieCardComponent = ({ id, title, image, category, videoId, onMovieSelect, isVideoPlaying }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [isInList, setIsInList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const titleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

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
    const checkIfInList = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('user_movie_lists')
        .select('movie_id')
        .eq('user_id', user.id)
        .eq('movie_id', id)
        .single();
      
      setIsInList(!!data);
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

  const toggleMyList = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user?.id) {
      toast.error('Please login to add movies to your list');
      return;
    }

    setIsLoading(true);
    try {
      if (isInList) {
        await supabase
          .from('user_movie_lists')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', id);
        
        setIsInList(false);
        toast.success('Removed from My List');
      } else {
        await supabase
          .from('user_movie_lists')
          .insert([{ user_id: user.id, movie_id: id }]);
        
        setIsInList(true);
        toast.success('Added to My List');
      }
    } catch (error) {
      console.error('Error toggling movie in list:', error);
      toast.error('Failed to update My List');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative movie-card w-full h-[210px] md:h-[300px] rounded-lg cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {user && (
        <button
          onClick={toggleMyList}
          disabled={isLoading}
          className={`absolute top-2 right-2 z-10 p-1.5 rounded-full 
            transition-colors duration-200
            ${isInList ? 'bg-green-500 hover:bg-green-600' : 'bg-black/50 hover:bg-black/70'}
            ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {isInList ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <Plus className="w-4 h-4 text-white" />
          )}
        </button>
      )}
      
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

export const MovieCard = memo(MovieCardComponent);