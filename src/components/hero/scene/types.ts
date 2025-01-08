export interface TextParticle {
  x: number;
  y: number;
}

export interface SceneProps {
  theme: string | undefined;
  containerRef: React.RefObject<HTMLDivElement>;
  onError: () => void;
}