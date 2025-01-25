import { toast } from 'sonner';

interface VideoIframeProps {
  videoId: string;
  onError: () => void;
}

export const VideoIframe = ({ videoId, onError }: VideoIframeProps) => {
  return (
    <div className="aspect-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        className="w-full h-full rounded-lg"
        onError={onError}
      />
    </div>
  );
};