import { useState } from 'react';
import { SunDim, Maximize2 } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string | null;
}

export const VideoPlayer = ({ videoId }: VideoPlayerProps) => {
  const [isDimmed, setIsDimmed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!videoId) return null;

  const toggleDim = () => {
    setIsDimmed(!isDimmed);
    document.body.classList.toggle('dimmed');
  };

  const toggleFullscreen = () => {
    const videoContainer = document.getElementById('video-container');
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className={`mt-8 transition-all duration-300 ${isDimmed ? 'bg-black' : ''}`}>
      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={toggleDim}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          title="Dim lights"
        >
          <SunDim className="w-6 h-6" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          title="Fullscreen"
        >
          <Maximize2 className="w-6 h-6" />
        </button>
      </div>
      <div id="video-container" className="relative w-full aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
};