import { Canvas } from '@react-three/fiber';
import { Starfield } from './Starfield';
import { CameraRig } from './CameraRig';
import { SolarSystem } from './SolarSystem';
import { FloatingParticles } from './FloatingParticles';
import { ShootingStars } from './ShootingStars';
import { DistantGalaxies, ParallaxStars, NebulaWisps, BrightStars } from './SpaceEffects';
import { Suspense } from 'react';
import { Environment, Stars } from '@react-three/drei';

export function Scene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{
      background: 'radial-gradient(ellipse at 50% 100%, #0a0a15 0%, #020204 40%, #000002 100%)'
    }}>
      <Canvas camera={{ position: [0, 5, 20], fov: 60 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
            {/* Deep space background with subtle blue tint at horizon */}
            <color attach="background" args={['#000002']} />
            <fog attach="fog" args={['#000005', 100, 350]} />
            
            {/* Very subtle ambient lighting */}
            <ambientLight intensity={0.06} color="#9999bb" />
            <pointLight position={[0, 0, -50]} intensity={1.2} color="#ffeedd" distance={200} />
            
            {/* Layer 1: Distant background - parallax stars (slowest) */}
            <ParallaxStars />
            
            {/* Layer 2: Distant galaxies (Hubble Deep Field style) */}
            <DistantGalaxies count={4} />
            
            {/* Layer 3: Subtle nebula wisps */}
            <NebulaWisps count={120} />
            
            {/* Layer 4: Main starfield with twinkling */}
            <Starfield />
            
            {/* Layer 5: Bright prominent stars with glow */}
            <BrightStars count={15} />
            
            {/* Layer 6: Shooting stars */}
            <ShootingStars count={6} />
            
            {/* Layer 7: Solar System */}
            <SolarSystem position={[0, 0, -50]} />
            
            {/* Layer 8: Foreground floating particles */}
            <FloatingParticles count={30} />
            
            <CameraRig />
            
            {/* Environment */}
            <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}

