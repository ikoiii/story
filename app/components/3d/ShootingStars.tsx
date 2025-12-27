import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShootingStarsProps {
  count?: number;
}

interface ShootingStar {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  active: boolean;
}

export function ShootingStars({ count = 8 }: ShootingStarsProps) {
  const meshRef = useRef<THREE.Points>(null);
  const trailRef = useRef<THREE.Points>(null);

  const { stars, positions, trailPositions, colors, trailColors } = useMemo(() => {
    const stars: ShootingStar[] = [];
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    // Trail has multiple points per star
    const trailLength = 20;
    const trailPositions = new Float32Array(count * trailLength * 3);
    const trailColors = new Float32Array(count * trailLength * 3);

    for (let i = 0; i < count; i++) {
      stars.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 200,
          50 + Math.random() * 50,
          -150 + Math.random() * 100
        ),
        velocity: new THREE.Vector3(
          -2 - Math.random() * 3,
          -1 - Math.random() * 2,
          Math.random() * 0.5
        ),
        life: Math.random() * 3,
        maxLife: 2 + Math.random() * 2,
        size: 0.3 + Math.random() * 0.4,
        active: Math.random() > 0.7, // Start some active
      });

      // Initialize positions
      positions[i * 3] = stars[i].position.x;
      positions[i * 3 + 1] = stars[i].position.y;
      positions[i * 3 + 2] = stars[i].position.z;

      // White-blue color
      colors[i * 3] = 0.9 + Math.random() * 0.1;
      colors[i * 3 + 1] = 0.95 + Math.random() * 0.05;
      colors[i * 3 + 2] = 1;

      // Initialize trail
      for (let t = 0; t < trailLength; t++) {
        const idx = (i * trailLength + t) * 3;
        trailPositions[idx] = stars[i].position.x;
        trailPositions[idx + 1] = stars[i].position.y;
        trailPositions[idx + 2] = stars[i].position.z;

        // Fade trail color
        const fade = 1 - t / trailLength;
        trailColors[idx] = 0.9 * fade;
        trailColors[idx + 1] = 0.95 * fade;
        trailColors[idx + 2] = 1 * fade;
      }
    }

    return { stars, positions, trailPositions, colors, trailColors };
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current || !trailRef.current) return;

    const posAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const trailPosAttr = trailRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const trailColorAttr = trailRef.current.geometry.attributes.color as THREE.BufferAttribute;
    const trailLength = 20;

    stars.forEach((star, i) => {
      if (star.active) {
        // Update life
        star.life += delta;

        // Move star
        star.position.add(star.velocity.clone().multiplyScalar(delta * 30));

        // Update main position
        posAttr.setXYZ(i, star.position.x, star.position.y, star.position.z);

        // Update trail - shift all trail points back
        for (let t = trailLength - 1; t > 0; t--) {
          const currentIdx = i * trailLength + t;
          const prevIdx = i * trailLength + t - 1;
          trailPosAttr.setXYZ(
            currentIdx,
            trailPosAttr.getX(prevIdx),
            trailPosAttr.getY(prevIdx),
            trailPosAttr.getZ(prevIdx)
          );
        }
        // Set first trail point to current position
        trailPosAttr.setXYZ(i * trailLength, star.position.x, star.position.y, star.position.z);

        // Update trail colors (fade based on life)
        const lifeRatio = Math.max(0, 1 - star.life / star.maxLife);
        for (let t = 0; t < trailLength; t++) {
          const fade = (1 - t / trailLength) * lifeRatio;
          const idx = i * trailLength + t;
          trailColorAttr.setXYZ(idx, 0.9 * fade, 0.95 * fade, fade);
        }

        // Check if star should reset
        if (star.life > star.maxLife || star.position.y < -50) {
          star.active = false;
          star.life = 0;
        }
      } else {
        // Randomly activate inactive stars
        if (Math.random() < 0.002) {
          star.active = true;
          star.life = 0;
          star.position.set(
            (Math.random() - 0.5) * 200,
            40 + Math.random() * 60,
            -100 + Math.random() * 50
          );
          star.velocity.set(
            -2 - Math.random() * 4,
            -1 - Math.random() * 2,
            Math.random() * 0.5
          );
          star.maxLife = 1.5 + Math.random() * 2;
          star.size = 0.3 + Math.random() * 0.5;
        }
      }
    });

    posAttr.needsUpdate = true;
    trailPosAttr.needsUpdate = true;
    trailColorAttr.needsUpdate = true;
  });

  return (
    <group>
      {/* Main shooting star heads */}
      <points ref={meshRef}>
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
          size={1.5}
          vertexColors
          sizeAttenuation
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Shooting star trails */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[trailColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.4}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
