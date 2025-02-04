interface VideoIframeProps {
  videoId: string;
  onError: () => void;
}

export const VideoIframe = ({ videoId, onError }: VideoIframeProps) => {
  return (
    <div className="relative aspect-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        onError={onError}
      />
    </div>
  );
};