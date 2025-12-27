import type { Route } from "./+types/home";
import { Scene } from "../components/3d/Scene";
import { StoryOverlay } from "../components/ui/StoryOverlay";
import { FullscreenToggle } from "../components/ui/FullscreenToggle";
import { PlanetInfo } from "../components/ui/PlanetInfo";
import { useState, useCallback } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Candala - A Galaxy Story" },
    { name: "description", content: "A journey through the stars." },
  ];
}

export default function Home() {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [planetPosition, setPlanetPosition] = useState<{ x: number; y: number } | null>(null);

  const handlePlanetHover = useCallback((name: string | null, position: { x: number; y: number } | null) => {
    setHoveredPlanet(name);
    setPlanetPosition(position);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* 3D Scene - Fixed Background */}
      <div className="fixed inset-0 z-0">
        <Scene onPlanetHover={handlePlanetHover} />
      </div>

      {/* Planet Info Card */}
      <PlanetInfo planetName={hoveredPlanet} position={planetPosition} />

      {/* UI Overlays */}
      <FullscreenToggle />
      <StoryOverlay />
    </div>
  );
}

