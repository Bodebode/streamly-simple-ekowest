import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { VideoControls } from './video/VideoControls';
import { VideoIframe } from './video/VideoIframe';
import { VideoErrorBoundary } from './video/VideoErrorBoundary';
import { WatchTimer } from './video/WatchTimer';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useWatchSession } from '@/hooks/use-watch-session';

interface VideoPlayerProps {
  videoId: string | null;
  onClose: () => void;
}

export const VideoPlayer = ({ videoId, onClose }: VideoPlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDimmed, setIsDimmed] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Initialize watch session tracking
  const { isWatching } = useWatchSession(videoId);

  // Initialize focus trap
  useFocusTrap(containerRef, isFullscreen);

  useEffect(() => {
    if (videoId) {
      setStartTime(Date.now());
      previousFocusRef.current = document.activeElement as HTMLElement;
      containerRef.current?.focus();

      console.log(`[VideoPlayer] Attempting to play video: ${videoId}`);
      console.log('[VideoPlayer] Watch session active:', isWatching);
      console.log('[VideoPlayer] Start time:', new Date(startTime).toISOString());
      
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

      return () => {
        previousFocusRef.current?.focus();
      };
    }
  }, [videoId, onClose, isWatching, startTime]);

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
    document.body.classList.toggle('dimmed');
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
      <div className="absolute -top-10 w-full flex justify-between items-center">
        <WatchTimer startTime={startTime} />
        <VideoControls
          isFullscreen={isFullscreen}
          isDimmed={isDimmed}
          onFullscreen={handleFullscreen}
          onDimming={toggleDimming}
          onClose={onClose}
        />
      </div>
      <VideoErrorBoundary>
        <VideoIframe videoId={videoId} onError={handleIframeError} />
      </VideoErrorBoundary>
      {isWatching && (
        <div className="absolute bottom-4 right-4 bg-green-500 text-white px-2 py-1 rounded text-sm">
          Tracking Watch Time
        </div>
      )}
    </div>
  );
};