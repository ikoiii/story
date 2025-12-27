import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarfieldProps {
  count?: number;
}

// Elegant scattered starfield with twinkling effect
export function Starfield({ count = 12000 }: StarfieldProps) {
  const mesh = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const { positions, colors, sizes, twinkleFactors, twinkleSpeeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const twinkleFactors = new Float32Array(count);
    const twinkleSpeeds = new Float32Array(count);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Completely random uniform distribution
      const x = (Math.random() - 0.5) * 300;
      const y = (Math.random() - 0.5) * 200;
      const z = -20 - Math.random() * 250;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Twinkling parameters
      twinkleFactors[i] = Math.random() * Math.PI * 2; // Random phase
      twinkleSpeeds[i] = 0.5 + Math.random() * 2; // Random speed

      // Size variation with some brighter stars
      const sizeRand = Math.random();
      if (sizeRand > 0.995) {
        sizes[i] = 0.4 + Math.random() * 0.4; // Bright stars with glow
      } else if (sizeRand > 0.95) {
        sizes[i] = 0.2 + Math.random() * 0.2; // Medium bright
      } else {
        sizes[i] = 0.05 + Math.random() * 0.1; // Small subtle
      }

      // Elegant colors
      const colorRand = Math.random();
      if (colorRand < 0.5) {
        color.setHSL(0.15, 0.02 + Math.random() * 0.05, 0.85 + Math.random() * 0.1);
      } else if (colorRand < 0.75) {
        color.setHSL(0.12 + Math.random() * 0.03, 0.1 + Math.random() * 0.15, 0.8 + Math.random() * 0.15);
      } else if (colorRand < 0.9) {
        color.setHSL(0.6 + Math.random() * 0.05, 0.15 + Math.random() * 0.1, 0.8 + Math.random() * 0.15);
      } else {
        color.setHSL(0.08 + Math.random() * 0.04, 0.3 + Math.random() * 0.2, 0.7 + Math.random() * 0.15);
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors, sizes, twinkleFactors, twinkleSpeeds };
  }, [count]);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.001;
    }
    
    // Twinkling effect - modulate opacity subtly
    if (materialRef.current) {
      const time = state.clock.elapsedTime;
      const twinkle = 0.8 + Math.sin(time * 0.5) * 0.05;
      materialRef.current.opacity = twinkle;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.15}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
