import { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const VINYL_PARTICLES = Array.from({ length: 30 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 2,
  colorIndex: Math.floor(Math.random() * 3),
}));

const VinylPlayer = ({ onMusicStart, reduceMotion = false, isMobile = false }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [hoverCount, setHoverCount] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const particles = VINYL_PARTICLES;

  useEffect(() => {
    if (hoverCount >= 2) {
      setShowHint(false);
    }
  }, [hoverCount]);

  const handleSpin = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      
      // Start music
      const audio = document.getElementById('bg-music');
      if (audio) {
        audio.play().catch(() => console.log('Audio play blocked'));
      }
      onMusicStart?.();

      setTimeout(() => {
        confetti({
          particleCount: isMobile ? 40 : 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#8b5cf6', '#22d3ee'],
          shapes: ['circle'],
          scalar: 1.2,
        });
      }, 500);

      // Show photo after 1 second
      setTimeout(() => {
        setShowPhoto(true);
      }, 1000);

      // Show scroll prompt after 2 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
      {!reduceMotion && !isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {particles.map((p, i) => (
            <Motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${['#22d3ee', '#3b82f6', '#8b5cf6'][p.colorIndex]}, transparent)`,
                left: p.left + '%',
                top: p.top + '%',
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Title */}
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 z-10"
      >
        <div className="bg-black/50 backdrop-blur-md px-8 py-6 rounded-2xl border border-white/20 shadow-2xl">
          <Motion.h1 
            className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-birthday-cake-400 via-birthday-party-400 to-birthday-candle-400 bg-clip-text text-transparent animate-party-pulse font-supercell"
            animate={{ 
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🎂 Chapter 1: The Vibe Check — Karan Aujla Vibes 🎂
          </Motion.h1>
          <Motion.p 
            className="text-3xl font-light bg-gradient-to-r from-birthday-cake-200 to-birthday-party-200 bg-clip-text text-transparent"
            animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ Spin the record to begin your special day... ✨
          </Motion.p>
        </div>
      </Motion.div>

      {/* Vinyl Player */}
      <div className="relative z-10">
        <Motion.div
          className="relative cursor-pointer group"
          onClick={handleSpin}
          onHoverStart={() => setHoverCount(prev => prev + 1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow Effect */}
          <Motion.div
            className="absolute inset-0 rounded-2xl blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(251, 113, 133, 0.5), rgba(168, 85, 247, 0.4), transparent)',
            }}
            animate={isSpinning ? { 
              scale: [1, 1.4, 1],
              opacity: [0.5, 0.8, 0.5]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Wooden Base */}
          <div className="relative w-80 h-80 bg-gradient-to-br from-orange-900 via-amber-900 to-orange-950 rounded-2xl shadow-2xl border-4 border-orange-600 flex items-center justify-center overflow-hidden">
            {/* Wood Grain Effect */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-orange-700 to-transparent" />
            
            {/* Corner Screws */}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full shadow-inner border border-gray-700"
                style={{
                  top: i < 2 ? '12px' : 'auto',
                  bottom: i >= 2 ? '12px' : 'auto',
                  left: i % 2 === 0 ? '12px' : 'auto',
                  right: i % 2 === 1 ? '12px' : 'auto',
                }}
              />
            ))}

            {/* Vinyl Record */}
            <Motion.div
              animate={isSpinning ? { rotate: 360 } : {}}
              transition={isSpinning ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
              className="relative w-64 h-64 rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-800 border-8 border-birthday-party-500 shadow-2xl"
            >
              {/* Vinyl Shine Effect */}
              <Motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(34,211,238,0.1) 100%)',
                }}
                animate={isSpinning ? { rotate: -360 } : {}}
                transition={isSpinning ? { duration: 3, repeat: Infinity, ease: 'linear' } : {}}
              />

              {/* Center Label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Motion.div 
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-birthday-cake-400 via-birthday-party-500 to-birthday-candle-500 flex items-center justify-center shadow-lg border-2 border-birthday-cake-300 candle-glow"
                  animate={isSpinning ? { 
                    scale: [1, 1.15, 1],
                    boxShadow: [
                      '0 0 20px rgba(251, 113, 133, 0.5)',
                      '0 0 40px rgba(251, 113, 133, 0.9)',
                      '0 0 20px rgba(251, 113, 133, 0.5)',
                    ]
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <span className="text-4xl">🎵</span>
                </Motion.div>
              </div>
              
              {/* Grooves */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-full border border-gray-700/40"
                  style={{ 
                    margin: `${i * 5 + 20}px`,
                  }}
                />
              ))}
            </Motion.div>
          </div>

          {/* Tone Arm */}
          <Motion.div
            animate={isSpinning ? { rotate: -25 } : { rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="absolute -right-8 top-12 w-36 h-3 bg-gradient-to-r from-orange-700 via-amber-600 to-orange-800 rounded-full origin-right shadow-lg"
            style={{ transformOrigin: 'right center' }}
          >
            <div className="absolute right-0 w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-md border-2 border-cyan-300" />
            <div className="absolute left-0 w-3 h-3 bg-orange-900 rounded-full" />
          </Motion.div>
        </Motion.div>

        {/* Photo Slide Out */}
        <AnimatePresence>
          {showPhoto && (
            <Motion.div
              initial={{ x: -400, opacity: 0, rotate: -20 }}
              animate={{ x: 0, opacity: 1, rotate: -6 }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              className="absolute -left-96 top-1/2 -translate-y-1/2 z-20"
            >
              <Motion.div 
                className="bg-gradient-to-br from-white via-birthday-cake-50 to-birthday-party-50 p-6 rounded-xl shadow-2xl border-4 border-birthday-cake-400 party-shadow"
                whileHover={{ rotate: 0, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                animate={{
                  boxShadow: [
                    '0 20px 60px rgba(251, 113, 133, 0.4)',
                    '0 30px 80px rgba(251, 113, 133, 0.6)',
                    '0 20px 60px rgba(251, 113, 133, 0.4)',
                  ]
                }}
              >
                <div className="relative">
                  <img
                    src="/hie/1.png"
                    alt="Memory 1"
                    className="w-72 h-72 object-cover rounded-lg shadow-lg"
                  />
                  {/* Polaroid Effect */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-birthday-candle-400 to-birthday-party-500 rounded-full shadow-md animate-sparkle" />
                </div>
                <p className="text-center mt-4 font-bold text-gray-800 text-lg">
                  ✨ Where your story began... ✨
                </p>
              </Motion.div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Prompt */}
      <AnimatePresence>
        {showPrompt && showPhoto && (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center z-10"
          >
            <p className="text-2xl font-bold text-white bg-gradient-to-r from-birthday-cake-500 via-birthday-party-500 to-birthday-candle-500 px-8 py-4 rounded-full shadow-2xl border-4 border-birthday-cake-300">
              🎉 Scroll down to celebrate more... 🎉
            </p>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VinylPlayer;
