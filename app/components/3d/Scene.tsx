import { Canvas } from '@react-three/fiber';
import { Starfield } from './Starfield';
import { CameraRig } from './CameraRig';
import { SolarSystem } from './SolarSystem';
import { FloatingParticles } from './FloatingParticles';
import { ShootingStars } from './ShootingStars';
import { DistantGalaxies, ParallaxStars, NebulaWisps, BrightStars } from './SpaceEffects';
import { Suspense } from 'react';
import { Environment } from '@react-three/drei';

interface SceneProps {
  onPlanetHover?: (name: string | null, position: { x: number; y: number } | null) => void;
}

export function Scene({ onPlanetHover }: SceneProps) {
  const handlePlanetHover = (name: string | null, event: any) => {
    if (name && event) {
      onPlanetHover?.(name, { x: event.clientX || event.pointer?.x * window.innerWidth / 2 + window.innerWidth / 2, y: event.clientY || event.pointer?.y * window.innerHeight / 2 + window.innerHeight / 2 });
    } else {
      onPlanetHover?.(null, null);
    }
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{
      background: 'radial-gradient(ellipse at 50% 100%, #0a0a15 0%, #020204 40%, #000002 100%)'
    }}>
      <Canvas 
        camera={{ position: [0, 5, 20], fov: 60 }} 
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
            <color attach="background" args={['#000002']} />
            <fog attach="fog" args={['#000005', 100, 350]} />
            
            <ambientLight intensity={0.06} color="#9999bb" />
            <pointLight position={[0, 0, -50]} intensity={1.2} color="#ffeedd" distance={200} />
            
            {/* Background layers */}
            <ParallaxStars />
            <DistantGalaxies count={4} />
            <NebulaWisps count={120} />
            <Starfield />
            <BrightStars count={15} />
            <ShootingStars count={6} />
            
            {/* Solar System */}
            <SolarSystem position={[0, 0, -50]} />
            
            <FloatingParticles count={30} />
            <CameraRig />
            
            <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}

