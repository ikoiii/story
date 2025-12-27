// Detect mobile device and provide optimized settings
export function useIsMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Get optimized counts based on device
export function getOptimizedCounts(isMobile: boolean) {
  return {
    starfield: isMobile ? 5000 : 12000,
    parallaxStars: isMobile ? { far: 1000, mid: 800, near: 600 } : { far: 3000, mid: 2000, near: 1500 },
    distantGalaxies: isMobile ? 2 : 4,
    nebulaWisps: isMobile ? 50 : 120,
    brightStars: isMobile ? 8 : 15,
    shootingStars: isMobile ? 3 : 6,
    floatingParticles: isMobile ? 15 : 30,
    asteroidBelt: isMobile ? 300 : 600,
  };
}
