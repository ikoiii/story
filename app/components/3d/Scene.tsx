import { Canvas } from '@react-three/fiber';
import { Starfield } from './Starfield';
import { CameraRig } from './CameraRig';
import { SolarSystem } from './SolarSystem';
import { FloatingParticles } from './FloatingParticles';
import { Suspense } from 'react';
import { Environment, Stars } from '@react-three/drei';

export function Scene() {
  return (
    <div className="fixed inset-0 z-0 bg-black pointer-events-none">
      <Canvas camera={{ position: [0, 5, 20], fov: 60 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
            <color attach="background" args={['#050508']} />
            <fog attach="fog" args={['#050508', 20, 120]} />
            
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#88aaff" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ff88aa" />
            
            {/* Background Stars layer */}
            <Stars radius={300} depth={50} count={8000} factor={4} saturation={0} fade speed={1} />
            
            {/* Main Interactive Elements */}
            <SolarSystem position={[0, 0, -50]} />
            <Starfield />
            <FloatingParticles count={150} />
            <CameraRig />
            
            {/* Environment for reflections */}
            <Environment preset="city" /> 
        </Suspense>
      </Canvas>
    </div>
  );
}
