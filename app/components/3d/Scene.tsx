import { Canvas } from '@react-three/fiber';
import { Starfield } from './Starfield';
import { CameraRig } from './CameraRig';
import { SolarSystem } from './SolarSystem';
import { FloatingParticles } from './FloatingParticles';
import { ShootingStars } from './ShootingStars';
import { DistantGalaxies, ParallaxStars, NebulaWisps, BrightStars } from './SpaceEffects';
import { Suspense, useMemo, useEffect, useState } from 'react';
import { Environment } from '@react-three/drei';

interface SceneProps {
  onPlanetHover?: (name: string | null, position: { x: number; y: number } | null) => void;
}

export function Scene({ onPlanetHover }: SceneProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Optimized counts for mobile
  const counts = useMemo(() => ({
    starfield: isMobile ? 5000 : 12000,
    distantGalaxies: isMobile ? 2 : 4,
    nebulaWisps: isMobile ? 50 : 120,
    brightStars: isMobile ? 8 : 15,
    shootingStars: isMobile ? 3 : 6,
    floatingParticles: isMobile ? 15 : 30,
  }), [isMobile]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{
      background: 'radial-gradient(ellipse at 50% 100%, #0a0a15 0%, #020204 40%, #000002 100%)'
    }}>
      <Canvas 
        camera={{ position: [0, 5, 20], fov: 60 }} 
        gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        <Suspense fallback={null}>
            <color attach="background" args={['#000002']} />
            <fog attach="fog" args={['#000005', 100, 350]} />
            
            <ambientLight intensity={0.06} color="#9999bb" />
            <pointLight position={[0, 0, -50]} intensity={1.2} color="#ffeedd" distance={200} />
            
            {/* Background layers - reduced on mobile */}
            <ParallaxStars isMobile={isMobile} />
            <DistantGalaxies count={counts.distantGalaxies} />
            <NebulaWisps count={counts.nebulaWisps} />
            <Starfield count={counts.starfield} />
            <BrightStars count={counts.brightStars} />
            <ShootingStars count={counts.shootingStars} />
            
            {/* Solar System */}
            <SolarSystem position={[0, 0, -50]} isMobile={isMobile} />
            
            <FloatingParticles count={counts.floatingParticles} />
            <CameraRig />
            
            <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
