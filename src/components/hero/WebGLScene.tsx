import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createLights, createTextCanvas, sampleTextPoints } from './animation-utils';
import { setupScene, handleResize } from './scene/SceneSetup';
import { ParticleSystem } from './scene/ParticleSystem';
import type { SceneProps } from './scene/types';

export const WebGLScene = ({ theme, containerRef, onError, onAnimationComplete }: SceneProps) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);

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
    particleSystemRef.current = particleSystem;
    scene.add(particleSystem.getMesh());

    let frame = 0;
    const totalDuration = 6; // Total animation duration in seconds
    const firstAnimationDuration = 5.5; // Duration of first animation
    
    const animate = () => {
      frame = (frame + 1);
      const t = frame / (60 * totalDuration); // Normalized time over total duration

      if (t >= 1) {
        // Animation complete, trigger callback
        onAnimationComplete?.();
        return;
      }

      // Calculate progress for each animation phase
      const isFirstAnimation = t < (firstAnimationDuration / totalDuration);
      const currentT = isFirstAnimation 
        ? (t * totalDuration) / firstAnimationDuration // Normalize time for first animation
        : ((t * totalDuration - firstAnimationDuration) / (totalDuration - firstAnimationDuration)); // Normalize time for second animation

      particleSystem.updateParticles(currentT, textParticles, isFirstAnimation);

      // Camera movement
      const cameraAmplitude = isFirstAnimation ? 2 : 0.5;
      camera.position.x = Math.sin(currentT * Math.PI * 2) * cameraAmplitude;
      camera.position.y = Math.cos(currentT * Math.PI * 2) * cameraAmplitude;
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