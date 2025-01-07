import { X } from 'lucide-react';
import { useEffect } from 'react';

interface VideoPlayerProps {
  videoId: string | null;
  onClose: () => void;
}

export const VideoPlayer = ({ videoId, onClose }: VideoPlayerProps) => {
  useEffect(() => {
    if (videoId) {
      console.log(`[VideoPlayer] Attempting to play video: ${videoId}`);
    }
  }, [videoId]);

  if (!videoId) return null;

  const handleIframeError = () => {
    console.error(`[VideoPlayer] Error loading video: ${videoId}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative w-full max-w-4xl aspect-video">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
          aria-label="Close video"
        >
          <X className="w-8 h-8" />
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
          onError={handleIframeError}
        />
      </div>
    </div>
  );
};