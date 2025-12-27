import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function CameraRig() {
  const { camera } = useThree();
  const scrollY = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
        // Normalize mouse from -1 to 1
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
    // SCROLL LOGIC: Panoramic Ascension
    // Instead of forward, we go UP and BACK slightly to see the whole galaxy
    const scrollFactor = Math.min(scrollY.current * 0.0005, 1); // 0 to 1 progress roughly
    
    const initialY = 5;
    const initialZ = 20;

    const targetY = initialY + scrollFactor * 50; // Rise up to 55
    const targetZ = initialZ + scrollFactor * 20; // Pull back to 40
    
    // Smooth Camera Move
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 1.5);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 1.5);
    
    // MOUSE LOGIC: Parallax Look
    // We want the camera to look slightly towards where the mouse is
    const lookAtTarget = new THREE.Vector3(
        mouse.current.x * 10,  // Look L/R
        mouse.current.y * 10 + (scrollFactor * -20), // Look U/D, but bias DOWN as we go UP
        -50 // Look at the Solar System center
    );

    // Use Vector3.lerp for smooth lookAt target? 
    // Easier: rotate camera based on mouse
    const currentLookAt = new THREE.Vector3(0, 0, -50); // Focusing on the galaxy center (Solar System is at -50)
    
    // As we rise, we look more DOWN at the center
    camera.lookAt(currentLookAt); 
    
    // Add subtle mouse offset to rotation AFTER lookAt
    camera.rotation.y -= mouse.current.x * 0.05;
    camera.rotation.x += mouse.current.y * 0.05;

  });

  return null;
}
