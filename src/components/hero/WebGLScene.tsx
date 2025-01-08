import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createLights, createTextCanvas, sampleTextPoints, createParticleSystem } from './animation-utils';

interface WebGLSceneProps {
  theme: string | undefined;
  containerRef: React.RefObject<HTMLDivElement>;
  onError: () => void;
}

export const WebGLScene = ({ theme, containerRef, onError }: WebGLSceneProps) => {
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

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );

    // Enhanced renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const { ambientLight, directionalLight } = createLights(theme);
    scene.add(ambientLight, directionalLight);

    // Create text canvas and sample points
    const { textCanvas, context } = createTextCanvas(theme);
    const textureData = context?.getImageData(0, 0, textCanvas.width, textCanvas.height);
    const textParticles = sampleTextPoints(textureData);

    // Create particle system
    const particleCount = 3000;
    const particles3D = createParticleSystem(particleCount, theme);
    scene.add(particles3D);

    // Add logo
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/favicon.svg', (texture) => {
      const logoGeometry = new THREE.PlaneGeometry(2, 2);
      const logoMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: theme === 'dark' ? 0.9 : 1,
      });
      const logo = new THREE.Mesh(logoGeometry, logoMaterial);
      logo.position.z = -2;
      scene.add(logo);
    });

    // Camera position
    camera.position.z = 10;

    // Animation loop
    let frame = 0;
    const loopDuration = 6; // Changed from 8 to 6 seconds
    const animate = () => {
      frame = (frame + 1) % (60 * loopDuration);
      const t = frame / (60 * loopDuration);

      // Update particle positions
      const positions = particles3D.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const targetIndex = i % textParticles.length;

        if (t < 0.5) {
          // First half: Swirl around
          const angle = (t * Math.PI * 4) + (i / particleCount) * Math.PI * 2;
          const radius = 5 + Math.sin(t * Math.PI * 6) * 2;
          positions[i3] += (Math.cos(angle) * radius - positions[i3]) * 0.02;
          positions[i3 + 1] += (Math.sin(angle) * radius - positions[i3 + 1]) * 0.02;
          positions[i3 + 2] += (Math.cos(t * Math.PI * 2) * 2 - positions[i3 + 2]) * 0.02;
        } else {
          // Second half: Form text
          const targetX = textParticles[targetIndex]?.x || 0;
          const targetY = textParticles[targetIndex]?.y || 0;
          positions[i3] += (targetX - positions[i3]) * 0.1;
          positions[i3 + 1] += (targetY - positions[i3 + 1]) * 0.1;
          positions[i3 + 2] += (0 - positions[i3 + 2]) * 0.1;
        }
      }
      particles3D.geometry.attributes.position.needsUpdate = true;

      // Dynamic camera movement
      camera.position.x = Math.sin(t * Math.PI * 2) * 2;
      camera.position.y = Math.cos(t * Math.PI * 2) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [theme, onError]);

  return null;
};