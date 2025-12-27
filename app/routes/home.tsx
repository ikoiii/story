import type { Route } from "./+types/home";
import { Scene } from "../components/3d/Scene";
import { StoryOverlay } from "../components/ui/StoryOverlay";
import { MusicPlayer } from "../components/ui/MusicPlayer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Candala - A Galaxy Story" },
    { name: "description", content: "A journey through the stars." },
  ];
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-neutral-900 text-white selection:bg-cyan-500 selection:text-black">
       <MusicPlayer />
       <div className="fixed inset-0 z-0 pointer-events-none">
          <Scene />
       </div>
       <StoryOverlay />
    </div>
  );
}
