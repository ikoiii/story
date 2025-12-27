import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function FloatingParticles({ count = 100 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { mouse } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
        temp.push({
            t: Math.random() * 100,
            factor: 20 + Math.random() * 100,
            speed: 0.01 + Math.random() * 0.05,
            xFactor: -50 + Math.random() * 100,
            yFactor: -50 + Math.random() * 100,
            zFactor: -50 + Math.random() * 100,
            mx: 0,
            my: 0
        });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;

      // Update time
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      // Mouse interactivity (Repel/Attract)
      // Lerp particle mouse offset towards actual mouse
      particle.mx += (mouse.x * 2 - particle.mx) * 0.1;
      particle.my += (mouse.y * 2 - particle.my) * 0.1;

      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      
      const scale = Math.max(0.5, Math.cos(t) * 1.5); // Twinkle size
      dummy.scale.setScalar(scale);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.05, 0]} />
      <meshBasicMaterial color="#a0c0ff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}
