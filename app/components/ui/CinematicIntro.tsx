import { useState, useEffect } from 'react';
import './CinematicIntro.css';

const quotes = [
  {
    text: "The cosmos is within us. We are made of star-stuff.",
    author: "Carl Sagan"
  },
  {
    text: "Somewhere, something incredible is waiting to be known.",
    author: "Carl Sagan"
  },
  {
    text: "The universe is under no obligation to make sense to you.",
    author: "Neil deGrasse Tyson"
  },
  {
    text: "We are all connected; To each other, biologically. To the earth, chemically. To the rest of the universe atomically.",
    author: "Neil deGrasse Tyson"
  },
  {
    text: "Look up at the stars and not down at your feet.",
    author: "Stephen Hawking"
  }
];

export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'black' | 'quote' | 'fadeOut' | 'done'>('black');
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    // Phase 1: Black screen (1s)
    const timer1 = setTimeout(() => setPhase('quote'), 1000);
    
    // Phase 2: Show quote (4s)
    const timer2 = setTimeout(() => setPhase('fadeOut'), 5000);
    
    // Phase 3: Fade out (1.5s)
    const timer3 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 6500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div className={`cinematic-intro ${phase}`}>
      <div className="quote-container">
        <p className="quote-text">"{quote.text}"</p>
        <p className="quote-author">— {quote.author}</p>
      </div>
      <div className="instruction">
        <span>Scroll to explore</span>
      </div>
    </div>
  );
}

// Floating quote that appears periodically
export function FloatingQuote() {
  const [visible, setVisible] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    // Show first quote after 30 seconds
    const initialTimer = setTimeout(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      setVisible(true);
      
      // Hide after 8 seconds
      setTimeout(() => setVisible(false), 8000);
    }, 30000);

    // Show quotes every 60 seconds
    const interval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      setVisible(true);
      setTimeout(() => setVisible(false), 8000);
    }, 60000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`floating-quote ${visible ? 'visible' : ''}`}>
      <p className="floating-quote-text">"{currentQuote.text}"</p>
      <p className="floating-quote-author">— {currentQuote.author}</p>
    </div>
  );
}
