import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Scene timings synced with Whispers_of_the_Lumina_Grove.mp3
// 0:00-0:06, 0:06-0:14, 0:14-0:22, 0:22-0:28
const SCENE_DURATIONS = [6000, 8000, 8000, 8000]; // ms per scene (longer for last line to read)

const scenes = [
  { id: 1, src: '/hie/11.png', text: 'Every story has a beginning...' },
  { id: 2, src: '/hie/2.png', text: '...some start in quiet, magical places...' },
  { id: 3, src: '/hie/3.png', text: '...and some moments are just meant to be celebrated.' },
  { id: 4, src: '/hie/8.png', text: "In a sea of wishes, I wanted to create something different... ✨" }
];

export default function GhibliIntro({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [started, setStarted] = useState(false); // true after user taps (unlocks audio)
  const hasCompletedRef = useRef(false);
  const audioRef = useRef(null);

  // Preload first image (with fallback if it fails)
  useEffect(() => {
    const img = new Image();
    img.onload = () => setFirstImageLoaded(true);
    img.onerror = () => setFirstImageLoaded(true); // Proceed even if image fails
    img.src = scenes[0].src;
    const fallback = setTimeout(() => setFirstImageLoaded(true), 5000); // Max 5s wait
    return () => clearTimeout(fallback);
  }, []);

  // Start intro with sound on first user interaction (browsers require a gesture to play audio)
  const handleStart = () => {
    if (started) return;
    const audio = new Audio('/music/Whispers_of_the_Lumina_Grove.mp3');
    audioRef.current = audio;
    audio.volume = 0.3;
    audio.play().catch(() => {});
    setStarted(true);
  };

  // Scene progression synced with audio (runs only after user has tapped to start)
  useEffect(() => {
    if (!firstImageLoaded || !started) return;

    const timeoutIds = [];
    const advanceScene = (index) => {
      if (index >= scenes.length - 1) {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          const lastSceneDuration = SCENE_DURATIONS[scenes.length - 1];
          const id = setTimeout(() => {
            const id2 = setTimeout(() => onComplete(), 2000);
            timeoutIds.push(id2);
          }, lastSceneDuration);
          timeoutIds.push(id);
        }
        return;
      }
      const nextIndex = index + 1;
      const delay = SCENE_DURATIONS[index];
      const id = setTimeout(() => {
        setCurrentIndex(nextIndex);
        advanceScene(nextIndex);
      }, delay);
      timeoutIds.push(id);
    };

    advanceScene(0);

    return () => {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [onComplete, firstImageLoaded, started]);

  if (!firstImageLoaded) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: [0.33, 1, 0.68, 1] }}
          className="text-white text-2xl font-serif"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  // Wait for user tap so browser allows audio to play
  if (!started) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center cursor-pointer"
        onClick={handleStart}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleStart(); } }}
        role="button"
        tabIndex={0}
        aria-label="Tap to start the intro"
      >
        <motion.img
          src={scenes[0].src}
          alt=""
          className="absolute inset-0 w-full h-full object-contain opacity-30"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10 text-white/90 text-xl sm:text-2xl font-serif text-center px-6"
        >
          Tap or click anywhere to begin
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="relative z-10 text-white/60 text-base mt-3"
        >
          (sound will start)
        </motion.p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.33, 1, 0.68, 1] }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          {/* The Ghibli Image */}
          <motion.img
            src={scenes[currentIndex].src}
            alt="Cinematic Scene"
            className="absolute inset-0 w-full h-full object-contain opacity-70"
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: SCENE_DURATIONS[currentIndex] / 1000, ease: [0.33, 1, 0.68, 1] }}
          />

          {/* The Poetic Caption */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.33, 1, 0.68, 1] }}
            className="relative z-10 text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif tracking-wide text-center px-8 max-w-4xl drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]"
          >
            {scenes[currentIndex].text}
          </motion.h1>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
