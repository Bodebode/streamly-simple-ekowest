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

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(theme === 'dark' ? 0x202020 : 0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(theme === 'dark' ? 0x22C55E : 0xffffff, 1.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create text geometry for particle positioning
    const textCanvas = document.createElement('canvas');
    const context = textCanvas.getContext('2d');
    textCanvas.width = 1024;
    textCanvas.height = 256;
    
    if (context) {
      context.fillStyle = theme === 'dark' ? '#22C55E' : '#000000';
      context.font = 'bold 120px Arial';
      context.textAlign = 'center';
      context.fillText('Ekowest TV', textCanvas.width / 2, textCanvas.height / 2);
    }

    // Sample points from the text
    const textureData = context?.getImageData(0, 0, textCanvas.width, textCanvas.height);
    const particles: { x: number; y: number; z: number }[] = [];
    const particleCount = 3000;
    const textParticles: { x: number; y: number }[] = [];

    if (textureData) {
      for (let y = 0; y < textCanvas.height; y += 4) {
        for (let x = 0; x < textCanvas.width; x += 4) {
          const alpha = textureData.data[(y * textCanvas.width + x) * 4 + 3];
          if (alpha > 128) {
            textParticles.push({
              x: (x - textCanvas.width / 2) / 50,
              y: -(y - textCanvas.height / 2) / 50,
            });
          }
        }
      }
    }

    // Create initial random particle positions
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 20
      });
    }

    // Create particle system
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = particles[i].x;
      positions[i * 3 + 1] = particles[i].y;
      positions[i * 3 + 2] = particles[i].z;

      const color = new THREE.Color(theme === 'dark' ? 0x22C55E : 0x000000);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particles3D = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles3D);

    // African drum logo
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
    const loopDuration = theme === 'dark' ? 20 : 30; // seconds
    const animate = () => {
      frame = (frame + 1) % (60 * loopDuration);
      const t = frame / (60 * loopDuration);

      // Update particle positions
      const positions = particleGeometry.attributes.position.array as Float32Array;
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
      particleGeometry.attributes.position.needsUpdate = true;

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