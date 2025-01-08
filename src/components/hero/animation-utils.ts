import * as THREE from 'three';

export const createLights = (theme: string | undefined) => {
  const ambientLight = new THREE.AmbientLight(theme === 'dark' ? 0x202020 : 0x404040);
  const directionalLight = new THREE.DirectionalLight(theme === 'dark' ? 0x22C55E : 0xffffff, 1.5);
  directionalLight.position.set(1, 1, 1);
  return { ambientLight, directionalLight };
};

export const createTextCanvas = (theme: string | undefined) => {
  const textCanvas = document.createElement('canvas');
  const context = textCanvas.getContext('2d');
  textCanvas.width = 1024;
  textCanvas.height = 256;
  
  if (context) {
    context.fillStyle = theme === 'dark' ? '#22C55E' : '#000000';
    context.font = 'bold 160px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle'; // Added to ensure vertical centering
    context.fillText('Ekowest TV', textCanvas.width / 2, textCanvas.height / 2);
  }
  
  return { textCanvas, context };
};

export const sampleTextPoints = (textureData: ImageData | undefined) => {
  const textParticles: { x: number; y: number }[] = [];
  
  if (textureData) {
    for (let y = 0; y < textureData.height; y += 4) {
      for (let x = 0; x < textureData.width; x += 4) {
        const alpha = textureData.data[(y * textureData.width + x) * 4 + 3];
        if (alpha > 128) {
          textParticles.push({
            x: (x - textureData.width / 2) / 50,
            y: -(y - textureData.height / 2) / 50,
          });
        }
      }
    }
  }
  
  return textParticles;
};