import { useEffect, useRef } from 'react';

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/audio/background.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    const playAudio = () => {
      audio.play().catch((err) => {
        console.warn("Auto-play prevented by browser. Waiting for interaction.", err);
      });
    };

    // Try playing immediately
    playAudio();

    // Also attach to document click to bypass auto-play policies if needed
    const handleInteraction = () => {
      playAudio();
      // Remove listeners once playing starts successfully (or at least we tried on user interaction)
      // We check if it is actually playing or not in a more complex app, but here we just retry.
      // Better to check if paused before playing again to avoid restarting/errors, 
      // but standard HTML5 Audio handles .play() cleanly usually.
      
      // Let's remove listeners immediately to avoid spamming play
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('scroll', handleInteraction);

    return () => {
      audio.pause();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, []);

  return null; // Invisible component
}
