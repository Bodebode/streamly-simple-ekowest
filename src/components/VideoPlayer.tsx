import { X, Maximize } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface VideoPlayerProps {
  videoId: string | null;
  onClose: () => void;
}

export const VideoPlayer = ({ videoId, onClose }: VideoPlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoId) {
      console.log(`[VideoPlayer] Attempting to play video: ${videoId}`);
      document.body.classList.add('dimmed');
      
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

      return () => {
        document.body.classList.remove('dimmed');
      };
    }
  }, [videoId, onClose]);

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

  const handleIframeError = () => {
    console.error(`[VideoPlayer] Error loading video: ${videoId}`);
    toast.error('Error loading video');
    onClose();
  };

  if (!videoId) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-12 mb-8" ref={containerRef}>
      <div className="absolute -top-10 right-0 flex items-center gap-4">
        <button
          onClick={handleFullscreen}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <Maximize className="w-6 h-6" />
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