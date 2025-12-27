import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { AsteroidBelt, Comet } from './AsteroidBelt';

// NASA-like planet configurations with enlarged sizes
const planets = [
  { name: 'Mercury', color: '#8C7E6D', emissive: '#2a2520', size: 0.8, distance: 12, speed: 4.7 },
  { name: 'Venus', color: '#E6C87A', emissive: '#4a3d20', size: 1.8, distance: 18, speed: 3.5 },
  { name: 'Earth', color: '#4169E1', emissive: '#102040', size: 2, distance: 26, speed: 3 },
  { name: 'Mars', color: '#CD5C5C', emissive: '#3a1515', size: 1.2, distance: 34, speed: 2.4 },
  { name: 'Jupiter', color: '#D4A574', emissive: '#3a2a1a', size: 6, distance: 50, speed: 1.3 },
  { name: 'Saturn', color: '#F4D59E', emissive: '#3a3020', size: 5, distance: 70, speed: 0.9 },
  { name: 'Uranus', color: '#7EC8E3', emissive: '#1a3040', size: 3.5, distance: 90, speed: 0.6 },
  { name: 'Neptune', color: '#4B6CB7', emissive: '#152040', size: 3.5, distance: 110, speed: 0.5 },
];

interface PlanetProps {
  planet: typeof planets[0];
  onHover?: (name: string | null, event: any) => void;
}

function Planet({ planet, onHover }: PlanetProps) {
  const ref = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * planet.speed * 0.08;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    onHover?.(planet.name, e);
  };

  const handlePointerOut = (e: any) => {
    document.body.style.cursor = 'default';
    onHover?.(null, e);
  };

  return (
    <group ref={ref}>
      <mesh 
        ref={meshRef} 
        position={[planet.distance, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[planet.size, 64, 64]} />
        <meshStandardMaterial 
          color={planet.color} 
          emissive={planet.emissive}
          emissiveIntensity={0.3}
          roughness={0.8}
          metalness={0.1}
        />
        
        <mesh ref={atmosphereRef} scale={[1.08, 1.08, 1.08]}>
          <sphereGeometry args={[planet.size, 32, 32]} />
          <meshBasicMaterial 
            color={planet.color} 
            transparent 
            opacity={0.15} 
            side={THREE.BackSide}
          />
        </mesh>

        {planet.name === 'Saturn' && (
          <mesh rotation-x={Math.PI / 2.5}>
            <ringGeometry args={[planet.size * 1.3, planet.size * 2.2, 128]} />
            <meshStandardMaterial 
              color="#D4C4A8" 
              emissive="#3a3020"
              emissiveIntensity={0.2}
              side={THREE.DoubleSide} 
              transparent 
              opacity={0.85} 
            />
          </mesh>
        )}

        {planet.name === 'Uranus' && (
          <mesh rotation-x={Math.PI / 2} rotation-z={Math.PI / 6}>
            <ringGeometry args={[planet.size * 1.4, planet.size * 1.8, 64]} />
            <meshBasicMaterial 
              color="#8EC8E3" 
              side={THREE.DoubleSide} 
              transparent 
              opacity={0.3} 
            />
          </mesh>
        )}
      </mesh>

      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[planet.distance - 0.08, planet.distance + 0.08, 256]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

interface SolarSystemProps {
  position?: [number, number, number];
  onPlanetHover?: (name: string | null, event: any) => void;
}

export function SolarSystem({ position = [0, 0, 0], onPlanetHover }: SolarSystemProps) {
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.1;
    }
  });

  const handleSunHover = (e: any, isOver: boolean) => {
    e.stopPropagation();
    document.body.style.cursor = isOver ? 'pointer' : 'default';
    onPlanetHover?.(isOver ? 'Sun' : null, e);
  };

  return (
    <group position={position}>
      {/* Sun */}
      <mesh 
        ref={sunRef}
        onPointerOver={(e) => handleSunHover(e, true)}
        onPointerOut={(e) => handleSunHover(e, false)}
      >
        <sphereGeometry args={[8, 64, 64]} />
        <meshBasicMaterial color="#FDB813" />
        <pointLight intensity={3} distance={300} decay={2} color="#ffeecc" />
      </mesh>
      
      {/* Sun Corona */}
      <mesh scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.4} side={THREE.BackSide} />
      </mesh>
      <mesh scale={[1.3, 1.3, 1.3]}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.2} side={THREE.BackSide} />
      </mesh>
      <mesh scale={[1.5, 1.5, 1.5]}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>

      {/* Asteroid Belt */}
      <AsteroidBelt count={600} />
      
      {/* Comet */}
      <Comet />

      {/* Planets */}
      {planets.map((p) => (
        <Planet key={p.name} planet={p} onHover={onPlanetHover} />
      ))}
    </group>
  );
}

