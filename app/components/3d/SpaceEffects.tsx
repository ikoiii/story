import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Distant galaxies - small blurry elliptical shapes like Hubble Deep Field
export function DistantGalaxies({ count = 5 }) {
  const galaxies = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 120,
          -150 - Math.random() * 150,
        ] as [number, number, number],
        rotation: Math.random() * Math.PI,
        scale: 0.8 + Math.random() * 1.5,
        starCount: 200 + Math.floor(Math.random() * 300),
        hue: Math.random() * 0.15, // Warm tones
      });
    }
    return temp;
  }, [count]);

  return (
    <group>
      {galaxies.map((galaxy, i) => (
        <DistantGalaxy key={i} {...galaxy} />
      ))}
    </group>
  );
}

function DistantGalaxy({ 
  position, 
  rotation, 
  scale, 
  starCount, 
  hue 
}: { 
  position: [number, number, number]; 
  rotation: number; 
  scale: number;
  starCount: number;
  hue: number;
}) {
  const mesh = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const color = new THREE.Color();

    for (let i = 0; i < starCount; i++) {
      // Elliptical distribution
      const r = Math.pow(Math.random(), 0.5) * 5 * scale;
      const theta = Math.random() * Math.PI * 2;
      
      positions[i * 3] = r * Math.cos(theta) * 1.5; // Elongated
      positions[i * 3 + 1] = r * Math.sin(theta) * 0.4; // Flattened
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      // Core brighter, edges dimmer
      const brightness = 0.4 + (1 - r / (5 * scale)) * 0.5;
      color.setHSL(hue + (Math.random() - 0.5) * 0.05, 0.3, brightness);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [starCount, scale, hue]);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.z += delta * 0.002;
    }
  });

  return (
    <points ref={mesh} position={position} rotation={[0.3, rotation, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
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

// Parallax star layers - different depths move at different speeds
export function ParallaxStars({ isMobile = false }: { isMobile?: boolean }) {
  // Reduce counts for mobile
  const counts = isMobile 
    ? { far: 1000, mid: 800, near: 600 }
    : { far: 3000, mid: 2000, near: 1500 };

  return (
    <group>
      <StarLayer count={counts.far} depth={-300} speed={0.0005} size={0.08} opacity={0.4} />
      <StarLayer count={counts.mid} depth={-200} speed={0.001} size={0.1} opacity={0.6} />
      <StarLayer count={counts.near} depth={-100} speed={0.002} size={0.12} opacity={0.8} />
    </group>
  );
}

function StarLayer({ 
  count, 
  depth, 
  speed, 
  size, 
  opacity 
}: { 
  count: number; 
  depth: number; 
  speed: number;
  size: number;
  opacity: number;
}) {
  const mesh = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
      positions[i * 3 + 2] = depth + (Math.random() - 0.5) * 50;

      // Soft white/cream colors
      color.setHSL(0.12 + Math.random() * 0.08, 0.05 + Math.random() * 0.1, 0.8 + Math.random() * 0.15);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [count, depth]);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * speed;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        sizeAttenuation
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Subtle nebula wisps - very faint colored clouds
export function NebulaWisps({ count = 150 }) {
  const mesh = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    // Create a few wisp clusters
    const wispCenters = [
      { x: 80, y: 30, z: -180, hue: 0.6, sat: 0.3 },   // Blue wisp
      { x: -60, y: -20, z: -200, hue: 0.8, sat: 0.2 }, // Purple wisp
      { x: -100, y: 50, z: -220, hue: 0.55, sat: 0.25 }, // Teal wisp
    ];

    for (let i = 0; i < count; i++) {
      const wisp = wispCenters[i % wispCenters.length];
      const spread = 40;
      
      positions[i * 3] = wisp.x + (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = wisp.y + (Math.random() - 0.5) * spread * 0.5;
      positions[i * 3 + 2] = wisp.z + (Math.random() - 0.5) * spread * 0.3;

      color.setHSL(
        wisp.hue + (Math.random() - 0.5) * 0.1,
        wisp.sat,
        0.3 + Math.random() * 0.2
      );

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [count]);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.0003;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={3}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Bright stars with glow effect
export function BrightStars({ count = 20 }) {
  const mesh = useRef<THREE.Points>(null);
  const glowMesh = useRef<THREE.Points>(null);

  const { positions, colors, glowPositions, glowColors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const glowPositions = new Float32Array(count * 3);
    const glowColors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 250;
      const y = (Math.random() - 0.5) * 150;
      const z = -50 - Math.random() * 200;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      glowPositions[i * 3] = x;
      glowPositions[i * 3 + 1] = y;
      glowPositions[i * 3 + 2] = z;

      // Bright white/blue-white
      const hue = Math.random() > 0.7 ? 0.6 : 0.12;
      color.setHSL(hue, 0.1 + Math.random() * 0.1, 0.95);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Glow is same color but dimmer
      color.setHSL(hue, 0.15, 0.7);
      glowColors[i * 3] = color.r;
      glowColors[i * 3 + 1] = color.g;
      glowColors[i * 3 + 2] = color.b;
    }

    return { positions, colors, glowPositions, glowColors };
  }, [count]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (mesh.current && mesh.current.material) {
      // Subtle twinkling
      (mesh.current.material as THREE.PointsMaterial).opacity = 0.9 + Math.sin(time * 2) * 0.1;
    }
    if (glowMesh.current && glowMesh.current.material) {
      (glowMesh.current.material as THREE.PointsMaterial).opacity = 0.15 + Math.sin(time * 1.5) * 0.05;
    }
  });

  return (
    <group>
      {/* Glow layer */}
      <points ref={glowMesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[glowPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[glowColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={2}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      {/* Core stars */}
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          vertexColors
          sizeAttenuation
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
