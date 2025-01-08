import { useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { WebGLScene } from './hero/WebGLScene';

interface HeroAnimationProps {
  fallback?: React.ReactNode;
}

export const HeroAnimation = ({ fallback }: HeroAnimationProps) => {
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
      style={{ background: theme === 'dark' ? '#141414' : '#ffffff' }}
    >
      <WebGLScene
        theme={theme}
        containerRef={containerRef}
        onError={handleWebGLError}
      />
    </div>
  );
};