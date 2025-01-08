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

    // Renderer setup with better quality
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

    // Dynamic particle system
    const particleCount = 2000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Create a spiral pattern
      const angle = (i / 3) * 0.2;
      const radius = Math.random() * 5 + 2;
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = Math.sin(angle) * radius;
      positions[i + 2] = (Math.random() - 0.5) * 5;

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
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // African drum logo and text
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/favicon.svg', (texture) => {
      const logoGeometry = new THREE.PlaneGeometry(3, 3);
      const logoMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: theme === 'dark' ? 0.9 : 1,
      });
      const logo = new THREE.Mesh(logoGeometry, logoMaterial);
      logo.position.z = -3;
      scene.add(logo);

      // Add text below logo
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = 512;
        canvas.height = 128;
        context.fillStyle = theme === 'dark' ? '#22C55E' : '#000000';
        context.font = 'bold 72px Arial';
        context.textAlign = 'center';
        context.fillText('Ekowest TV', canvas.width / 2, canvas.height / 2);
        
        const textTexture = new THREE.CanvasTexture(canvas);
        const textGeometry = new THREE.PlaneGeometry(4, 1);
        const textMaterial = new THREE.MeshBasicMaterial({
          map: textTexture,
          transparent: true,
          opacity: theme === 'dark' ? 0.9 : 1,
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.y = -2;
        textMesh.position.z = -3;
        scene.add(textMesh);
      }
    });

    // Camera position
    camera.position.z = 6;

    // Animation loop
    let frame = 0;
    const loopDuration = theme === 'dark' ? 20 : 30; // seconds
    const animate = () => {
      frame = (frame + 1) % (60 * loopDuration);
      const t = frame / (60 * loopDuration);

      // More dynamic particle animation
      particles.rotation.y = t * Math.PI * 4;
      particles.rotation.x = Math.sin(t * Math.PI * 6) * 0.5;
      particles.rotation.z = Math.cos(t * Math.PI * 4) * 0.3;

      // Pulsing effect
      const scale = 1 + Math.sin(t * Math.PI * 8) * 0.1;
      particles.scale.set(scale, scale, scale);

      // Dynamic camera movement
      camera.position.x = Math.sin(t * Math.PI * 2) * 0.5;
      camera.position.y = Math.cos(t * Math.PI * 2) * 0.5;
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