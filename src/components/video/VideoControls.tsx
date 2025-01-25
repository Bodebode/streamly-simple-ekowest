import { X, Maximize, Minimize, Sun, Moon } from 'lucide-react';

interface VideoControlsProps {
  isFullscreen: boolean;
  isDimmed: boolean;
  onFullscreen: () => void;
  onDimming: () => void;
  onClose: () => void;
}

export const VideoControls = ({
  isFullscreen,
  isDimmed,
  onFullscreen,
  onDimming,
  onClose
}: VideoControlsProps) => {
  return (
    <div className="absolute -top-10 right-0 flex items-center gap-4">
      <button
        onClick={onDimming}
        className="text-white hover:text-gray-300 transition-colors"
        aria-label={isDimmed ? "Brighten screen" : "Dim screen"}
      >
        {isDimmed ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
      <button
        onClick={onFullscreen}
        className="text-white hover:text-gray-300 transition-colors"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
      </button>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-300 transition-colors"
        aria-label="Close video"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};