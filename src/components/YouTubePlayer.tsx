interface YouTubePlayerProps {
  videoId: string;
}

export const YouTubePlayer = ({ videoId }: YouTubePlayerProps) => {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=0&modestbranding=1&rel=0&showinfo=0`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    />
  );
};