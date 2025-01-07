import { X } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface VideoPlayerProps {
  videoId: string | null;
  onClose: () => void;
}

export const VideoPlayer = ({ videoId, onClose }: VideoPlayerProps) => {
  useEffect(() => {
    if (videoId) {
      console.log(`[VideoPlayer] Attempting to play video: ${videoId}`);
      
      // Check video availability with error handling
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
          // Don't show error toast for network issues as it might be temporary
          // Just log it for debugging
        });
    }
  }, [videoId, onClose]);

  if (!videoId) return null;

  const handleIframeError = () => {
    console.error(`[VideoPlayer] Error loading video: ${videoId}`);
    toast.error('Error loading video');
    onClose();
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-12 mb-8">
      <button
        onClick={onClose}
        className="absolute -top-10 right-0 text-white hover:text-gray-300"
        aria-label="Close video"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="aspect-video">
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