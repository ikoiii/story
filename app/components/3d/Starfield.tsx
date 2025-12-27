import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarfieldProps {
  count?: number;
}

export function Starfield({ count = 10000 }: StarfieldProps) {
  const mesh = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
        // Spiral Galaxy Distribution
        // 3 branches
        const branchAngle = (i % 3) * ((2 * Math.PI) / 3);
        const radius = Math.random() * 100 + 10; 
        const spinAngle = radius * 0.2; // more spin further out
        
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 10;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 10;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 30; // Spread in Z

        const rx = radius * Math.cos(branchAngle + spinAngle) + randomX;
        const ry = (Math.random() - 0.5) * (100 - radius * 0.5) * 0.2 + randomY; // flatten near edges
        const rz = radius * Math.sin(branchAngle + spinAngle) + randomZ - 50; 

        positions[i * 3] = rx;
        positions[i * 3 + 1] = ry;
        positions[i * 3 + 2] = rz;

        // Colors
        // Center = Warm/Bright, Edges = Cool/Blue/Purple
        const distRatio = radius / 100;
        if (distRatio < 0.3) {
             color.setHSL(Math.random() * 0.1 + 0.6, 0.8, 0.8); // Blueish white core
        } else {
             // Mix of Cyan (0.5), Purple (0.8), Pink (0.9)
             const hue = Math.random() > 0.5 ? 0.5 + Math.random() * 0.1 : 0.75 + Math.random() * 0.2;
             color.setHSL(hue, 0.6, 0.5 + Math.random() * 0.4);
        }
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state, delta) => {
    if (mesh.current) {
        // Global slow rotation
        mesh.current.rotation.y += delta * 0.05;
        mesh.current.rotation.z += delta * 0.01;
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
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
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
