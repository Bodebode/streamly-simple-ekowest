import { useState, useEffect } from 'react';
import { SunDim, Maximize2, X, Minimize2 } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string | null;
  onClose?: () => void;
}

export const VideoPlayer = ({ videoId, onClose }: VideoPlayerProps) => {
  const [isDimmed, setIsDimmed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (videoId && !isFullscreen && window.scrollY > 400) {
        setIsMinimized(true);
      } else {
        setIsMinimized(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [videoId, isFullscreen]);

  useEffect(() => {
    return () => {
      if (isDimmed) {
        document.body.classList.remove('dimmed');
      }
    };
  }, [isDimmed]);

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
      setIsMinimized(false);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    if (isDimmed) {
      document.body.classList.remove('dimmed');
    }
    setTimeout(() => {
      setIsExiting(false);
      onClose?.();
    }, 400);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const containerClasses = `
    transition-all duration-300 
    ${isMinimized ? 'fixed bottom-4 right-4 w-80 z-50' : 'mt-8 max-w-4xl mx-auto'}
    ${isExiting ? 'video-player-exit' : 'video-player-enter'}
  `;

  return (
    <div className={containerClasses}>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          title="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex gap-4">
          {!isFullscreen && (
            <button
              onClick={toggleMinimize}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              title={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="w-6 h-6" /> : <Minimize2 className="w-6 h-6" />}
            </button>
          )}
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