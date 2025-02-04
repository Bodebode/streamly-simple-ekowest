import React from 'react';

interface VideoIframeProps {
  videoId: string;
  onError?: () => void;
}

export const VideoIframe = ({ videoId, onError }: VideoIframeProps) => {
  return (
    <div className="relative w-full aspect-video">
      {/* Overlay to prevent clicking the title link */}
      <div 
        className="absolute top-0 left-0 w-full h-14 bg-transparent z-10" 
        aria-hidden="true"
      />
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
        title="Video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onError={onError}
      />
    </div>
  );
};