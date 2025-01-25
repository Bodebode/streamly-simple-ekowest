import { useEffect, useRef, useCallback } from 'react';

interface MovieCardPreviewHandlerProps {
  isVideoPlaying: boolean;
  videoId?: string;
  onPreviewChange: (show: boolean) => void;
  onTitleChange: (show: boolean) => void;
}

export const useMovieCardPreview = ({ 
  isVideoPlaying, 
  videoId, 
  onPreviewChange, 
  onTitleChange 
}: MovieCardPreviewHandlerProps) => {
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const titleTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleMouseEnter = useCallback(() => {
    if (!isVideoPlaying) {
      if (videoId) {
        hoverTimerRef.current = setTimeout(() => {
          const previewElements = document.querySelectorAll('iframe[src*="youtube.com"]');
          if (previewElements.length === 0) {
            onPreviewChange(true);
          }
        }, 1400);
      }
    }
  }, [isVideoPlaying, videoId, onPreviewChange]);

  const handleMouseLeave = useCallback(() => {
    onPreviewChange(false);
    onTitleChange(true);
    clearTimers();
  }, [clearTimers, onPreviewChange, onTitleChange]);

  return {
    handleMouseEnter,
    handleMouseLeave,
    clearTimers
  };
};