import * as THREE from 'three';
import { TextParticle } from './types';

export class ParticleSystem {
  private particles3D: THREE.Points;
  private particleCount: number;
  private positions: Float32Array;

  constructor(particleCount: number, theme: string | undefined) {
    this.particleCount = particleCount;
    const { particles3D, positions } = this.createParticleSystem(theme);
    this.particles3D = particles3D;
    this.positions = positions;
  }

  private createParticleSystem(theme: string | undefined) {
    const particles = Array.from({ length: this.particleCount }, () => ({
      x: (Math.random() - 0.5) * 15, // Reduced from 20 to 15
      y: (Math.random() - 0.5) * 15, // Reduced from 20 to 15
      z: (Math.random() - 0.5) * 15  // Reduced from 20 to 15
    }));

    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);

    particles.forEach((particle, i) => {
      positions[i * 3] = particle.x;
      positions[i * 3 + 1] = particle.y;
      positions[i * 3 + 2] = particle.z;

      const color = new THREE.Color(theme === 'dark' ? 0x22C55E : 0x000000);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    });

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.03, // Reduced from 0.05 to 0.03
      vertexColors: true,
      transparent: true,
      opacity: 0.6, // Reduced from 0.8 to 0.6
      blending: THREE.AdditiveBlending
    });

    return { 
      particles3D: new THREE.Points(particleGeometry, particleMaterial),
      positions
    };
  }

  public getMesh() {
    return this.particles3D;
  }

  public updateParticles(t: number, textParticles: TextParticle[]) {
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      const targetIndex = i % textParticles.length;

      // Adjusted timing: particles form text at t=0.3 and stay until t=0.9
      if (t < 0.3) {
        const angle = (t * Math.PI * 4) + (i / this.particleCount) * Math.PI * 2;
        const radius = 4 + Math.sin(t * Math.PI * 6) * 1.5; // Reduced radius and oscillation
        this.positions[i3] += (Math.cos(angle) * radius - this.positions[i3]) * 0.015; // Reduced speed
        this.positions[i3 + 1] += (Math.sin(angle) * radius - this.positions[i3 + 1]) * 0.015;
        this.positions[i3 + 2] += (Math.cos(t * Math.PI * 2) * 1.5 - this.positions[i3 + 2]) * 0.015;
      } else if (t < 0.9) { // Extended text formation time
        const targetX = textParticles[targetIndex]?.x || 0;
        const targetY = textParticles[targetIndex]?.y || 0;
        this.positions[i3] += (targetX - this.positions[i3]) * 0.08;
        this.positions[i3 + 1] += (targetY - this.positions[i3 + 1]) * 0.08;
        this.positions[i3 + 2] += (0 - this.positions[i3 + 2]) * 0.08;
      }
    }
    this.particles3D.geometry.attributes.position.needsUpdate = true;
  }
}