import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createLights, createTextCanvas, sampleTextPoints } from './animation-utils';
import { setupScene, handleResize } from './scene/SceneSetup';
import { ParticleSystem } from './scene/ParticleSystem';
import type { SceneProps } from './scene/types';

export const WebGLScene = ({ theme, containerRef, onError }: SceneProps) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) throw new Error('WebGL not supported');
    } catch (e) {
      console.warn('WebGL not available, falling back to static content');
      onError();
      return;
    }

    const { scene, camera, renderer } = setupScene(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    const { ambientLight, directionalLight } = createLights(theme);
    scene.add(ambientLight, directionalLight);

    const { textCanvas, context } = createTextCanvas(theme);
    const textureData = context?.getImageData(0, 0, textCanvas.width, textCanvas.height);
    const textParticles = sampleTextPoints(textureData);

    const particleSystem = new ParticleSystem(3000, theme);
    scene.add(particleSystem.getMesh());

    let frame = 0;
    const loopDuration = 4; // Reduced from 6 to 4 seconds
    
    const animate = () => {
      frame = (frame + 1) % (60 * loopDuration);
      const t = frame / (60 * loopDuration);

      particleSystem.updateParticles(t, textParticles);

      camera.position.x = Math.sin(t * Math.PI * 2) * 2;
      camera.position.y = Math.cos(t * Math.PI * 2) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const resizeHandler = () => {
      if (!containerRef.current) return;
      handleResize(containerRef.current, camera, renderer);
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [theme, onError]);

  return null;
};