import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NebulaCloudProps {
  count?: number;
  radius?: number;
}

// Small scattered glowing clusters
export function NebulaCloud({ 
  count = 500, 
  radius = 150,
}: NebulaCloudProps) {
  const mesh = useRef<THREE.Points>(null);

  const { positions, particleColors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const particleColors = new Float32Array(count * 3);
    const color = new THREE.Color();

    // Create small cluster centers
    const clusterCount = 25;
    const clusters: { x: number; y: number; z: number; hue: number }[] = [];
    
    for (let c = 0; c < clusterCount; c++) {
      clusters.push({
        x: (Math.random() - 0.5) * 180,
        y: (Math.random() - 0.5) * 80,
        z: -30 - Math.random() * 130,
        hue: Math.random() * 0.15, // Warm hues (yellow to orange)
      });
    }

    for (let i = 0; i < count; i++) {
      // Pick a random cluster
      const cluster = clusters[Math.floor(Math.random() * clusters.length)];
      const r = Math.pow(Math.random(), 0.6) * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = cluster.x + r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = cluster.y + r * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i * 3 + 2] = cluster.z + r * Math.cos(phi);

      // Warm glow colors
      color.setHSL(
        cluster.hue + (Math.random() - 0.5) * 0.05,
        0.4 + Math.random() * 0.3,
        0.6 + Math.random() * 0.3
      );

      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    return { positions, particleColors };
  }, [count, radius]);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.002;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particleColors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Dust lanes in galaxy - adds depth and realism
export function GalaxyDust({ count = 400 }) {
  const mesh = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    const tiltX = 0.4;
    const tiltZ = 0.2;

    for (let i = 0; i < count; i++) {
      // Spiral dust lanes
      const armIndex = i % 2;
      const armAngle = armIndex * Math.PI + (Math.random() - 0.5) * 0.2;
      const radius = 10 + Math.pow(Math.random(), 0.6) * 60;
      const spiralAngle = radius * 0.08;
      
      const angle = armAngle + spiralAngle + (Math.random() - 0.5) * 0.3;
      
      let x = radius * Math.cos(angle);
      let y = (Math.random() - 0.5) * 0.5;
      let z = radius * Math.sin(angle);
      
      // Apply tilt
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);
      const cosZ = Math.cos(tiltZ);
      const sinZ = Math.sin(tiltZ);
      
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      const x2 = x * cosZ - y1 * sinZ;
      const y2 = x * sinZ + y1 * cosZ;
      
      positions[i * 3] = x2;
      positions[i * 3 + 1] = y2;
      positions[i * 3 + 2] = z1 - 50;

      // Warm colors matching Andromeda
      const distRatio = radius / 70;
      if (distRatio < 0.4) {
        color.setHSL(0.1 + Math.random() * 0.05, 0.6, 0.6 + Math.random() * 0.2);
      } else {
        color.setHSL(0.08 + Math.random() * 0.08, 0.4, 0.4 + Math.random() * 0.3);
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [count]);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.008;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Companion galaxy (like M32/M110 in Andromeda image)
export function CompanionGalaxy({ position = [-40, -25, -70], size = 8, starCount = 2000 }) {
  const mesh = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const color = new THREE.Color();

    for (let i = 0; i < starCount; i++) {
      // Elliptical distribution
      const r = Math.pow(Math.random(), 0.5) * size;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Slightly flattened sphere (elliptical galaxy)
      positions[i * 3] = position[0] + r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = position[1] + r * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = position[2] + r * Math.cos(phi);

      // Yellowish-white old stars (elliptical galaxies have old stellar populations)
      const brightness = 0.6 + (1 - r / size) * 0.3 + Math.random() * 0.1;
      color.setHSL(0.12 + Math.random() * 0.05, 0.3 + Math.random() * 0.2, brightness);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [position, size, starCount]);

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
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
