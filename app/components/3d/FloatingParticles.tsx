import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Soft, subtle floating particles - elegant and minimal
export function FloatingParticles({ count = 50 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        factor: 30 + Math.random() * 80,
        speed: 0.005 + Math.random() * 0.015,
        x: (Math.random() - 0.5) * 150,
        y: (Math.random() - 0.5) * 100,
        z: -30 - Math.random() * 120,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;

    particles.forEach((particle, i) => {
      let { t, factor, speed, x, y, z } = particle;

      t = particle.t += speed;
      
      // Gentle floating motion
      dummy.position.set(
        x + Math.sin(t * 0.5) * 2,
        y + Math.cos(t * 0.3) * 1.5,
        z + Math.sin(t * 0.2) * 1
      );
      
      // Subtle twinkling
      const scale = 0.3 + Math.sin(t * 2) * 0.15;
      dummy.scale.setScalar(scale);
      
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial 
        color="#aaccff"
        transparent 
        opacity={0.4} 
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}
