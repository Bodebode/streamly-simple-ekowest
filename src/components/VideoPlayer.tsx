import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { VideoControls } from './video/VideoControls';
import { VideoIframe } from './video/VideoIframe';
import { VideoErrorBoundary } from './video/VideoErrorBoundary';
import { useFocusTrap } from '@/hooks/use-focus-trap';

interface VideoPlayerProps {
  videoId: string | null;
  onClose: () => void;
}

export const VideoPlayer = ({ videoId, onClose }: VideoPlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDimmed, setIsDimmed] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Initialize focus trap
  useFocusTrap(containerRef, isFullscreen);

  useEffect(() => {
    if (videoId) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus the container when it opens
      containerRef.current?.focus();

      console.log(`[VideoPlayer] Attempting to play video: ${videoId}`);
      
      fetch(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Video not available');
          }
          return response.json();
        })
        .catch(error => {
          console.error('[VideoPlayer] Error checking video availability:', error);
          toast.error('This video is not available');
          onClose();
        });

      // Cleanup function to restore focus
      return () => {
        previousFocusRef.current?.focus();
      };
    }
  }, [videoId, onClose]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen().catch(console.error);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, onClose]);

  const handleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.error('[VideoPlayer] Fullscreen error:', error);
        toast.error('Fullscreen mode is not supported');
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (error) {
        console.error('[VideoPlayer] Exit fullscreen error:', error);
      }
    }
  };

  const toggleDimming = () => {
    setIsDimmed(!isDimmed);
    document.body.style.backgroundColor = !isDimmed ? '#000' : '';
  };

  const handleIframeError = () => {
    console.error('[VideoPlayer] Error loading video iframe');
    toast.error('Error loading video');
    onClose();
  };

  if (!videoId) return null;

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto mt-24 mb-8" 
      ref={containerRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
    >
      <VideoControls
        isFullscreen={isFullscreen}
        isDimmed={isDimmed}
        onFullscreen={handleFullscreen}
        onDimming={toggleDimming}
        onClose={onClose}
      />
      <VideoErrorBoundary>
        <VideoIframe videoId={videoId} onError={handleIframeError} />
      </VideoErrorBoundary>
    </div>
  );
};