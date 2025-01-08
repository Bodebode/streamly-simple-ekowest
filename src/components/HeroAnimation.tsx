import { useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { WebGLScene } from './hero/WebGLScene';

interface HeroAnimationProps {
  fallback?: React.ReactNode;
  onAnimationComplete?: () => void;
}

export const HeroAnimation = ({ fallback, onAnimationComplete }: HeroAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(true);

  const handleWebGLError = () => {
    setIsWebGLAvailable(false);
  };

  if (!isWebGLAvailable && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full absolute top-0 left-0 z-0"
      style={{ 
        background: theme === 'dark' ? '#141414' : '#ffffff',
        backgroundImage: 'url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" /> {/* Dark overlay */}
      <WebGLScene
        theme={theme}
        containerRef={containerRef}
        onError={handleWebGLError}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
};