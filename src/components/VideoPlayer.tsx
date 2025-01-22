import { X, Maximize, Minimize, Sun, Moon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

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
      
      // Check video availability
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
      <div className="absolute -top-10 right-0 flex items-center gap-4">
        <button
          onClick={toggleDimming}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label={isDimmed ? "Brighten screen" : "Dim screen"}
        >
          {isDimmed ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
        <button
          onClick={handleFullscreen}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
        </button>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Close video"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="w-full h-full rounded-lg"
          onError={handleIframeError}
        />
      </div>
    </div>
  );
};