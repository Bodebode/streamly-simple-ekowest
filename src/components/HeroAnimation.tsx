import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

interface HeroAnimationProps {
  fallback?: React.ReactNode;
}

export const HeroAnimation = ({ fallback }: HeroAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const { theme } = useTheme();
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) throw new Error('WebGL not supported');
    } catch (e) {
      console.warn('WebGL not available, falling back to static content');
      setIsWebGLAvailable(false);
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

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(theme === 'dark' ? 0x22C55E : 0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Particle system
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;

      const color = new THREE.Color(theme === 'dark' ? 0x22C55E : 0x000000);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Logo texture loader
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load('/favicon.svg', (texture) => {
      const logoGeometry = new THREE.PlaneGeometry(2, 2);
      const logoMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: theme === 'dark' ? 0.8 : 1,
      });
      const logo = new THREE.Mesh(logoGeometry, logoMaterial);
      logo.position.z = -5;
      scene.add(logo);
    });

    // Camera position
    camera.position.z = 5;

    // Animation loop
    let frame = 0;
    const loopDuration = theme === 'dark' ? 20 : 30; // seconds
    const animate = () => {
      frame = (frame + 1) % (60 * loopDuration);
      const t = frame / (60 * loopDuration);

      particles.rotation.y = t * Math.PI * 2;
      particles.rotation.x = Math.sin(t * Math.PI * 4) * 0.3;

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

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [theme]);

  if (!isWebGLAvailable && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full absolute top-0 left-0 z-0"
      style={{ background: theme === 'dark' ? '#141414' : '#ffffff' }}
    />
  );
};