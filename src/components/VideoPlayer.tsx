import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { VideoControls } from './video/VideoControls';
import { VideoIframe } from './video/VideoIframe';

interface VideoPlayerProps {
  videoId: string | null;
  onClose: () => void;
}

export const VideoPlayer = ({ videoId, onClose }: VideoPlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoId) {
      console.log(`[VideoPlayer] Attempting to play video: ${videoId}`);
      
      fetch(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`)
        .then(response => {
          if (!response.ok) {
            console.error(`[VideoPlayer] Video ${videoId} is not available`);
            toast.error('This video is not available for playback');
            onClose();
          }
        })
        .catch(error => {
          console.error(`[VideoPlayer] Error checking video availability:`, error);
          toast.error('Unable to verify video availability');
        });
    }
  }, [videoId, onClose]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => {
            console.error(`[VideoPlayer] Error exiting fullscreen:`, err);
            toast.error('Unable to exit fullscreen mode');
          });
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => {
          console.error(`[VideoPlayer] Error attempting to enable fullscreen:`, err);
          toast.error('Unable to enter fullscreen mode');
        });
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => {
          console.error(`[VideoPlayer] Error attempting to exit fullscreen:`, err);
          toast.error('Unable to exit fullscreen mode');
        });
    }
  };

  const toggleDimming = () => {
    setIsDimmed(!isDimmed);
    if (!isDimmed) {
      document.body.classList.add('dimmed');
    } else {
      document.body.classList.remove('dimmed');
    }
  };

  const handleIframeError = () => {
    console.error(`[VideoPlayer] Error loading video: ${videoId}`);
    toast.error('Error loading video');
    onClose();
  };

  if (!videoId) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-24 mb-8" ref={containerRef}>
      <VideoControls
        isFullscreen={isFullscreen}
        isDimmed={isDimmed}
        onFullscreen={handleFullscreen}
        onDimming={toggleDimming}
        onClose={onClose}
      />
      <VideoIframe videoId={videoId} onError={handleIframeError} />
    </div>
  );
};