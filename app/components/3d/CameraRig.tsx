import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function CameraRig() {
  const { camera } = useThree();
  const scrollY = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const time = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      mouse.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useFrame((state, delta) => {
    time.current += delta;
    
    // SCROLL LOGIC: Panoramic Ascension
    const scrollFactor = Math.min(scrollY.current * 0.0005, 1);
    
    const initialY = 5;
    const initialZ = 20;

    const targetY = initialY + scrollFactor * 50;
    const targetZ = initialZ + scrollFactor * 20;
    
    // FLOATING DRIFT: Smooth sine-wave motion for "floating in space" feeling
    const driftX = Math.sin(time.current * 0.15) * 0.3;
    const driftY = Math.cos(time.current * 0.1) * 0.2;
    const driftZ = Math.sin(time.current * 0.08) * 0.15;
    
    // Smooth Camera Move with drift
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, driftX, delta * 0.5);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY + driftY, delta * 1.2);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ + driftZ, delta * 1.2);
    
    // MOUSE LOGIC: Very subtle parallax
    const lookAtTarget = new THREE.Vector3(
      mouse.current.x * 5,
      mouse.current.y * 5 + (scrollFactor * -20),
      -50
    );

    const currentLookAt = new THREE.Vector3(0, 0, -50);
    
    camera.lookAt(currentLookAt); 
    
    // Subtle mouse offset - reduced for more peaceful experience
    camera.rotation.y -= mouse.current.x * 0.02;
    camera.rotation.x += mouse.current.y * 0.02;
    
    // Subtle tilt for organic feel
    camera.rotation.z = Math.sin(time.current * 0.05) * 0.005;
  });

  return null;
}

