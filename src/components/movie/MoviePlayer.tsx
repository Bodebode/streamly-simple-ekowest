interface MoviePlayerProps {
  videoId: string;
}

export const MoviePlayer = ({ videoId }: MoviePlayerProps) => {
  return (
    <div className="aspect-video w-full max-w-5xl mx-auto">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};