import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio('/audio/background.mp3');
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    // Try auto-play with interaction fallback
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    return () => {
      audio.pause();
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.button
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg hover:bg-white/20 transition-colors cursor-pointer"
      onClick={togglePlay}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isPlaying ? "Pause music" : "Play music"}
    >
      <AnimatePresence mode="wait">
        {isPlaying ? (
           <motion.div
             key="playing"
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0, opacity: 0 }}
             className="flex gap-1 items-end h-4 pb-1"
           >
             {[1, 2, 3].map((i) => (
               <motion.div
                 key={i}
                 className="w-1 bg-white rounded-full"
                 animate={{ height: [4, 12, 6, 14, 4] }}
                 transition={{
                   duration: 1,
                   repeat: Infinity,
                   delay: i * 0.15,
                   ease: "easeInOut"
                 }}
                 style={{ height: 4 }}
               />
             ))}
           </motion.div>
        ) : (
           <motion.svg
             key="muted"
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0, opacity: 0 }}
             xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M11 5L6 9H2v6h4l5 4V5z"/>
             <line x1="23" x2="17" y1="9" y2="15"/>
             <line x1="17" x2="23" y1="9" y2="15"/>
           </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
