import { useState, useEffect } from 'react';
import { SunDim, Maximize2, X } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string | null;
  onClose?: () => void;
}

export const VideoPlayer = ({ videoId, onClose }: VideoPlayerProps) => {
  const [isDimmed, setIsDimmed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Cleanup function to ensure dimmed state is removed
  useEffect(() => {
    return () => {
      document.body.classList.remove('dimmed');
    };
  }, []);

  // Effect to handle cleanup when component unmounts or videoId changes
  useEffect(() => {
    return () => {
      if (isDimmed) {
        document.body.classList.remove('dimmed');
        setIsDimmed(false);
      }
    };
  }, [isDimmed]);

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

  const handleClose = () => {
    setIsExiting(true);
    if (isDimmed) {
      document.body.classList.remove('dimmed');
      setIsDimmed(false);
    }
    setTimeout(() => {
      setIsExiting(false);
      onClose?.();
    }, 400);
  };

  // Return null after all hooks are declared
  if (!videoId) return null;

  return (
    <div className={`mt-8 transition-all duration-300 max-w-4xl mx-auto ${isExiting ? 'video-player-exit' : 'video-player-enter'}`}>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          title="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex gap-4">
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