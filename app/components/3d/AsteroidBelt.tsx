import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Realistic asteroid belt between Mars and Jupiter
export function AsteroidBelt({ count = 800 }) {
  const mesh = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const color = new THREE.Color();

    // Asteroid belt is between Mars (34) and Jupiter (50)
    const innerRadius = 38;
    const outerRadius = 46;

    for (let i = 0; i < count; i++) {
      // Random angle
      const angle = Math.random() * Math.PI * 2;
      
      // Random radius within belt
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      
      // Some vertical spread
      const y = (Math.random() - 0.5) * 3;
      
      // Add some irregularity
      const irregularity = (Math.random() - 0.5) * 2;
      
      positions[i * 3] = Math.cos(angle) * (radius + irregularity);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * (radius + irregularity);

      // Rocky gray-brown colors
      const hue = 0.08 + Math.random() * 0.04;
      const sat = 0.1 + Math.random() * 0.2;
      const light = 0.3 + Math.random() * 0.3;
      color.setHSL(hue, sat, light);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Varied sizes - mostly small
      sizes[i] = 0.05 + Math.random() * 0.15;
    }

    return { positions, colors, sizes };
  }, [count]);

  useFrame((state, delta) => {
    if (mesh.current) {
      // Slow rotation
      mesh.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

// Comet with trail effect
export function Comet() {
  const meshRef = useRef<THREE.Points>(null);
  const time = useRef(Math.random() * 100);
  const active = useRef(Math.random() > 0.5);
  const startDelay = useRef(Math.random() * 30);

  const { positions, colors } = useMemo(() => {
    const trailLength = 50;
    const positions = new Float32Array(trailLength * 3);
    const colors = new Float32Array(trailLength * 3);
    const color = new THREE.Color();

    for (let i = 0; i < trailLength; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      // Fade from bright cyan-white to transparent
      const fade = 1 - i / trailLength;
      color.setHSL(0.55, 0.5 * fade, 0.9 * fade);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    time.current += delta;
    
    // Wait for start delay
    if (time.current < startDelay.current) return;
    
    const t = (time.current - startDelay.current) * 0.3;
    
    // Elliptical orbit path
    const orbitA = 80; // Semi-major axis
    const orbitB = 40; // Semi-minor axis
    const speed = 0.15;
    
    const x = Math.cos(t * speed) * orbitA;
    const y = Math.sin(t * speed * 0.3) * 10;
    const z = Math.sin(t * speed) * orbitB - 50;

    const posAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    
    // Shift trail positions
    for (let i = 49; i > 0; i--) {
      posAttr.setXYZ(i, posAttr.getX(i - 1), posAttr.getY(i - 1), posAttr.getZ(i - 1));
    }
    
    // Set head position
    posAttr.setXYZ(0, x, y, z);
    posAttr.needsUpdate = true;

    // Reset comet after one orbit
    if (t > Math.PI * 2 / speed + 5) {
      time.current = 0;
      startDelay.current = Math.random() * 60;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.8}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
