import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const planets = [
  { name: 'Mercury', color: '#A5A5A5', size: 0.4, distance: 10, speed: 4.7 },
  { name: 'Venus', color: '#E3BB76', size: 0.9, distance: 15, speed: 3.5 },
  { name: 'Earth', color: '#2233FF', size: 1, distance: 22, speed: 3 },
  { name: 'Mars', color: '#DD4422', size: 0.5, distance: 28, speed: 2.4 },
  { name: 'Jupiter', color: '#D9AF8C', size: 3, distance: 40, speed: 1.3 },
  { name: 'Saturn', color: '#E4D5B6', size: 2.5, distance: 55, speed: 0.9 },
  { name: 'Uranus', color: '#99DDFF', size: 1.8, distance: 70, speed: 0.6 },
  { name: 'Neptune', color: '#3355FF', size: 1.8, distance: 85, speed: 0.5 },
];

function Planet({ planet }: { planet: any }) {
  const ref = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) {
        // Orbit rotation
        ref.current.rotation.y += delta * planet.speed * 0.1;
    }
    if (meshRef.current) {
        // Self rotation
        meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={ref}>
      <mesh ref={meshRef} position={[planet.distance, 0, 0]}>
        <sphereGeometry args={[planet.size, 32, 32]} />
        <meshStandardMaterial color={planet.color} />
        {planet.name === 'Saturn' && (
            <mesh rotation-x={Math.PI / 2}>
                <ringGeometry args={[planet.size * 1.4, planet.size * 2.2, 64]} />
                <meshStandardMaterial color="#CcbbaA" side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
        )}
      </mesh>
      {/* Orbit Line */}
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[planet.distance - 0.05, planet.distance + 0.05, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function SolarSystem(props: any) {
  return (
    <group {...props}>
      {/* Sun */}
      <mesh>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial color="#ffddaa" />
        <pointLight intensity={2} distance={200} decay={2} color="#ffddaa" />
      </mesh>
      
      {/* Sun Glow/Atmosphere (Simplified) */}
      <mesh scale={[1.2, 1.2, 1.2]}>
         <sphereGeometry args={[5, 32, 32]} />
         <meshBasicMaterial color="#ffaa00" transparent opacity={0.3} side={THREE.BackSide} />
      </mesh>

      {/* Planets */}
      {planets.map((p) => (
        <Planet key={p.name} planet={p} />
      ))}
    </group>
  );
}
