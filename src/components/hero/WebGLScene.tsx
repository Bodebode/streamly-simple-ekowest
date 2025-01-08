import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createLights, createTextCanvas, sampleTextPoints } from './animation-utils';
import { setupScene, handleResize } from './scene/SceneSetup';
import { ParticleSystem } from './scene/ParticleSystem';
import type { SceneProps } from './scene/types';

export const WebGLScene = ({ theme, containerRef, onError, onAnimationComplete }: SceneProps) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const loopCountRef = useRef(0);
  const isAnimatingRef = useRef(true);

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
    const loopDuration = 4; // Duration in seconds
    
    const animate = () => {
      if (!isAnimatingRef.current) {
        // Apply gentle wobble even after animation stops
        const wobbleT = Date.now() * 0.0005; // Slow, subtle movement
        camera.position.x = Math.sin(wobbleT) * 0.3; // Reduced amplitude
        camera.position.y = Math.cos(wobbleT) * 0.2; // Even smaller vertical movement
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        return;
      }

      frame = (frame + 1) % (60 * loopDuration);
      const t = frame / (60 * loopDuration);

      if (frame === 0) {
        loopCountRef.current += 1;
        if (loopCountRef.current === 2) {
          isAnimatingRef.current = false;
          onAnimationComplete?.();
          loopCountRef.current = 0;
        }
      }

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
  }, [theme, onError, onAnimationComplete]);

  return null;
};