import { useRef, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const RAGE_SPARKLES = Array.from({ length: 50 }, () => ({
  left: Math.random() * 100,
  dx: Math.random() * 100 - 50,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 3,
  colorIndex: Math.floor(Math.random() * 3),
}));

const FINALE_STARS = Array.from({ length: 25 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 0.5 + Math.random() * 1.5,
  duration: 3 + Math.random() * 4,
  delay: Math.random() * 4,
}));
const FINALE_ORBS = Array.from({ length: 8 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 40 + Math.random() * 80,
  duration: 8 + Math.random() * 6,
  delay: Math.random() * 3,
}));

const messages = [
  {
    title: "🎂 Prettiest Smile",
    text: "To the girl with the prettiest smile and the kindest heart – Happy Birthday, Smily!",
    color: "from-pink-400/20 to-rose-400/20"
  },
  {
    title: "✨ Pure Magic",
    text: "You are proof that magic exists. Have the most magical birthday, Smily! ✨",
    color: "from-violet-500/20 to-fuchsia-500/20"
  },
  {
    title: "🌸 Tareef Karun Kya Uski",
    text: "Tareef karun kya uski, jisne tumhe banaya! Happy Birthday, beautiful Smily. 🌹",
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    title: "🌟 More Awesome Every Year",
    text: "You're not just a year older, you're a year more awesome. Keep shining, Smily! 🌟",
    color: "from-amber-400/20 to-yellow-400/20"
  },
  {
    title: "💃 Param Sundari",
    text: "Happy Birthday to our very own Param Sundari! 💃💕",
    color: "from-orange-400/20 to-rose-400/20"
  },
  {
    title: "☀️ Human Sunshine",
    text: "Happy Birthday to the human version of sunshine. You light up every room, Smily! ☀️",
    color: "from-yellow-400/20 to-orange-400/20"
  },
  {
    title: "📸 Elegance Thumbnail",
    text: "If 'Elegance' had a Wikipedia page, your photo would be the main thumbnail, Smily. 📸",
    color: "from-rose-400/20 to-pink-400/20"
  },
  {
    title: "👑 Birthday Queen",
    text: "Cheers to you, the birthday queen. May your day be as special as you are, Smily! 👑",
    color: "from-amber-400/20 to-purple-500/20"
  }
];

const RageDropCake = ({ reduceMotion = false, isMobile = false, onFinishLetter }) => {
  const [spellDropped, setSpellDropped] = useState(false);
  const [activeCandles, setActiveCandles] = useState([true, true, true]);
  const [cakeCut, setCakeCut] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const cakeRef = useRef(null);
  const sparkles = RAGE_SPARKLES;

  const remainingCandles = activeCandles.filter(c => c).length;
  const allCandlesOut = remainingCandles === 0;

  const dropSpellOnCake = () => {
    setSpellDropped(true);
    confetti({
      particleCount: isMobile ? 40 : 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#f97316'],
    });
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    
    if (cakeRef.current) {
      const cakeRect = cakeRef.current.getBoundingClientRect();
      const dropX = info.point.x;
      const dropY = info.point.y;

      if (
        dropX >= cakeRect.left &&
        dropX <= cakeRect.right &&
        dropY >= cakeRect.top &&
        dropY <= cakeRect.bottom
      ) {
        dropSpellOnCake();
      }
    }
  };

  const blowOutCandle = (index) => {
    if (!activeCandles[index]) return;
    
    const newCandles = [...activeCandles];
    newCandles[index] = false;
    setActiveCandles(newCandles);

    confetti({
      particleCount: isMobile ? 12 : 30,
      spread: 50,
      origin: { y: 0.5 },
      colors: ['#60a5fa', '#93c5fd', '#dbeafe'],
      shapes: ['circle'],
      scalar: 0.8,
    });
  };

  const cutTheCake = () => {
    setCakeCut(true);
    onFinishLetter?.();

    confetti({
      particleCount: isMobile ? 60 : 200,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ffd700', '#a855f7', '#22c55e', '#ec4899'],
      shapes: ['star', 'circle'],
      scalar: isMobile ? 1 : 1.5,
    });

    if (isMobile) return; // Skip continuous confetti on mobile
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#a855f7', '#ec4899', '#fde047'] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#a855f7', '#ec4899', '#fde047'] });
    }, 250);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-6 px-4 py-12">
      {/* Last Chapter - Enhanced Background (disabled on mobile for performance) */}
      {!reduceMotion && !isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          {/* Soft glowing orbs - aurora effect */}
          {FINALE_ORBS.map((o, i) => (
            <Motion.div
              key={`orb-${i}`}
              className="absolute rounded-full blur-3xl"
              style={{
                left: o.left + '%',
                top: o.top + '%',
                width: o.size,
                height: o.size,
                background: `radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(236,72,153,0.15) 40%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: o.duration,
                repeat: Infinity,
                delay: o.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
          {/* Twinkling stars */}
          {FINALE_STARS.map((s, i) => (
            <Motion.div
              key={`star-${i}`}
              className="absolute"
              style={{
                left: s.left + '%',
                top: s.top + '%',
                filter: 'drop-shadow(0 0 6px rgba(253, 224, 71, 0.8))',
              }}
              animate={{
                scale: [s.size * 0.6, s.size * 1.2, s.size * 0.6],
                opacity: [0.4, 1, 0.4],
                rotate: [0, 180],
              }}
              transition={{
                duration: s.duration,
                repeat: Infinity,
                delay: s.delay,
                ease: 'easeInOut',
              }}
            >
              <span className="text-xl md:text-2xl">⭐</span>
            </Motion.div>
          ))}
          {/* Crescent moons */}
          {[...Array(5)].map((_, i) => (
            <Motion.div
              key={`moon-${i}`}
              className="absolute text-2xl md:text-3xl"
              style={{
                left: `${15 + i * 20}%`,
                top: `${10 + (i % 3) * 25}%`,
                filter: 'drop-shadow(0 0 12px rgba(253, 224, 71, 0.6))',
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeInOut',
              }}
            >
              🌙
            </Motion.div>
          ))}
          {/* Floating celebration elements */}
          {[
            { emoji: '🎂', left: 8, top: 75, dur: 12 },
            { emoji: '🎈', left: 88, top: 15, dur: 10 },
            { emoji: '🎁', left: 5, top: 25, dur: 14 },
            { emoji: '🕯️', left: 90, top: 70, dur: 9 },
            { emoji: '🌟', left: 75, top: 85, dur: 11 },
            { emoji: '🎵', left: 92, top: 45, dur: 13 },
          ].map((el, i) => (
            <Motion.div
              key={`float-${i}`}
              className="absolute text-2xl md:text-3xl"
              style={{
                left: el.left + '%',
                top: el.top + '%',
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))',
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: el.dur,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'easeInOut',
              }}
            >
              {el.emoji}
            </Motion.div>
          ))}
        </div>
      )}

      {!reduceMotion && !isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {sparkles.map((p, i) => (
            <Motion.div
              key={i}
              className="absolute"
              animate={{
                y: [0, -window.innerHeight - 100],
                x: [0, p.dx],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear",
              }}
              style={{
                left: p.left + '%',
                top: '100%',
              }}
            >
              <span className="text-3xl" style={{
                filter: `drop-shadow(0 0 10px ${['rgba(168, 85, 247, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(59, 130, 246, 0.8)'][p.colorIndex]})`
              }}>✨</span>
            </Motion.div>
          ))}
        </div>
      )}

      {/* Title */}
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2 z-10"
      >
        <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shadow-2xl max-w-4xl mx-auto">
          <Motion.h1 
            className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-birthday-party-400 via-birthday-cake-400 to-birthday-candle-500 bg-clip-text text-transparent animate-party-pulse font-supercell"
            animate={{
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🎂 Chapter 3: The Grand Finale — Happy Birds & Wishes 🎂
          </Motion.h1>
          <Motion.p 
            className="text-xl md:text-2xl font-light bg-gradient-to-r from-birthday-party-200 to-birthday-cake-200 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {!spellDropped && "⚡ Drag the spell to the cake, or click the cake to drop! ⚡"}
            {spellDropped && !allCandlesOut && `🕯️ Make a wish! Tap candles (${remainingCandles} left)`}
            {allCandlesOut && !cakeCut && "✨ Your wish is sealed! Cut the cake! ✨"}
            {cakeCut && "🎉 Happy Birthday, Smily! 🎉"}
          </Motion.p>
        </div>
      </Motion.div>

      {/* Featured photo - Smily */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        className="flex justify-center mb-10 md:mb-14"
      >
        <Motion.div
          className="bg-white p-3 md:p-4 rounded-lg shadow-2xl border-4 border-amber-200/80 max-w-[200px] md:max-w-[240px]"
          style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)' }}
          animate={{
            y: [0, -4, 0],
            rotate: [0, 0.5, -0.5, 0],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: [0.33, 1, 0.68, 1] }}
        >
          <img
            src="/hie/new_cropped_1_1.png"
            alt="Smily"
            className="w-full aspect-[3/4] object-cover rounded-md"
          />
          <p className="text-center font-bold text-gray-800 text-sm md:text-base mt-3 py-1">
            👑 Smily 👑
          </p>
        </Motion.div>
      </Motion.div>

      {/* Cake Area - click to drop spell (alternate to dragging) */}
      <div 
        ref={cakeRef} 
        role="button"
        tabIndex={0}
        aria-label={!spellDropped ? 'Click to drop Rage Spell on cake' : undefined}
        onClick={() => !spellDropped && dropSpellOnCake()}
        onKeyDown={(e) => !spellDropped && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), dropSpellOnCake())}
        className={`relative mt-6 mb-6 z-10 ${!spellDropped ? 'cursor-pointer' : ''}`}
      >
        {/* Drop Zone Indicator */}
        <AnimatePresence>
          {isDragging && !spellDropped && (
            <Motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -inset-16 rounded-full border-4 border-dashed border-birthday-party-400 z-0"
              style={{
                boxShadow: '0 0 40px rgba(168, 85, 247, 0.6)',
              }}
            >
              <Motion.div
                className="absolute inset-0 rounded-full bg-birthday-party-500/20"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </Motion.div>
          )}
        </AnimatePresence>

        {/* 3-Story Happy Angry Birds Themed Cake with Candles */}
        <Motion.div
          animate={spellDropped ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col items-center"
        >
          {/* 3-Story Angry Birds Cake Structure */}
          <div className={`flex flex-col items-center transition-all duration-500 ${!spellDropped ? 'opacity-30 grayscale blur-sm' : ''}`}>
            
            {/* Top Layer - Happy Red Bird (Smallest) */}
            <Motion.div 
              className="relative z-30"
              animate={spellDropped ? { 
                y: [0, -3, 0],
                rotate: [0, 1, -1, 0] 
              } : {}}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <div className="relative w-40 h-20 bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-t-[2rem] border-4 border-red-700 shadow-2xl flex items-center justify-center overflow-visible">
                {/* Shine effect */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-[2rem]"></div>
                
                {/* Candles positioned on top of this layer */}
                {spellDropped && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex gap-4 z-50 items-end">
                    {activeCandles.map((isLit, index) => (
                      <Motion.button
                        key={index}
                        onClick={() => blowOutCandle(index)}
                        whileHover={isLit ? { scale: 1.08, y: -4 } : { scale: 1.02 }}
                        whileTap={isLit ? { scale: 0.95 } : {}}
                        className={`flex flex-col-reverse items-center cursor-pointer select-none ${!isLit ? 'opacity-70' : ''}`}
                        animate={isLit ? { y: [0, -3, 0] } : {}}
                        transition={isLit ? { duration: 2, repeat: Infinity, ease: [0.33, 1, 0.68, 1] } : {}}
                      >
                        {/* Candle stick - wax */}
                        <div
                          className={`w-4 h-10 rounded-full border-2 shadow-inner transition-colors duration-300 ${
                            isLit
                              ? 'bg-gradient-to-b from-amber-100 via-rose-100 to-amber-50 border-amber-200/80'
                              : 'bg-gradient-to-b from-stone-200 to-stone-300 border-stone-300'
                          }`}
                          style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5)' }}
                        />
                        {/* Flame or wick */}
                        <div className="relative -mb-1 flex flex-col items-center">
                          {isLit ? (
                            <>
                              {/* Outer glow */}
                              <Motion.div
                                className="absolute w-8 h-8 rounded-full -translate-y-1"
                                style={{
                                  background: 'radial-gradient(circle, rgba(250,204,21,0.5) 0%, transparent 70%)',
                                  filter: 'blur(4px)',
                                }}
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.7, 1, 0.7],
                                }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: [0.33, 1, 0.68, 1] }}
                              />
                              {/* Flame */}
                              <Motion.div
                                className="relative w-3 h-4 rounded-b-full origin-bottom"
                                style={{
                                  background: 'linear-gradient(180deg, #fef08a 0%, #facc15 25%, #f97316 60%, #ea580c 100%)',
                                  boxShadow: '0 0 12px rgba(250,204,21,0.8), 0 0 20px rgba(249,115,22,0.4)',
                                  clipPath: 'ellipse(50% 100% at 50% 100%)',
                                }}
                                animate={{
                                  scaleX: [1, 1.15, 0.95, 1],
                                  scaleY: [1, 1.1, 0.9, 1],
                                  opacity: [1, 0.95, 1],
                                }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: [0.33, 1, 0.68, 1] }}
                              />
                              {/* Inner bright core */}
                              <Motion.div
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-2.5 rounded-b-full bg-gradient-to-b from-white via-yellow-200 to-amber-400"
                                style={{ boxShadow: '0 0 8px rgba(254,240,138,0.9)' }}
                                animate={{ opacity: [0.9, 1, 0.9] }}
                                transition={{ duration: 0.6, repeat: Infinity }}
                              />
                            </>
                          ) : (
                            /* Blown out: wick + smoke */
                            <>
                              <div className="w-0.5 h-1 bg-stone-600 rounded-full" />
                              <Motion.div
                                className="text-2xl -mt-2 opacity-60"
                                animate={{ opacity: [0.4, 0.7, 0.4], y: [0, -2, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: [0.33, 1, 0.68, 1] }}
                              >
                                💨
                              </Motion.div>
                            </>
                          )}
                        </div>
                      </Motion.button>
                    ))}
                  </div>
                )}
                
                {/* Happy Red Bird Face */}
                <div className="relative z-10">
                  {/* Eyes */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="relative">
                      <div className="w-5 h-5 bg-white rounded-full border-2 border-black shadow-sm"></div>
                      <div className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full"></div>
                    </div>
                    <div className="relative">
                      <div className="w-5 h-5 bg-white rounded-full border-2 border-black shadow-sm"></div>
                      <div className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full"></div>
                    </div>
                  </div>
                  {/* Happy smile */}
                  <div className="w-8 h-3 border-b-2 border-black rounded-b-full"></div>
                  {/* Beak */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-3 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-sm border border-orange-500"></div>
                </div>
              </div>
              {/* Frosting layer */}
              <div className="w-40 h-3 bg-gradient-to-r from-pink-300 via-pink-200 to-pink-300 border-x-4 border-red-700 shadow-md"></div>
            </Motion.div>

            {/* Middle Layer - Happy Yellow Bird */}
            <Motion.div 
              className="relative z-20 -mt-1"
              animate={spellDropped ? { 
                y: [0, -2, 0],
                rotate: [0, -0.5, 0.5, 0] 
              } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="relative w-56 h-24 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 border-4 border-yellow-600 shadow-2xl flex items-center justify-center overflow-hidden">
                {/* Shine effect */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent"></div>
                
                {/* Happy Yellow Bird Face */}
                <div className="relative z-10">
                  {/* Crest */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1">
                    <div className="w-2 h-5 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-t-full border border-yellow-700"></div>
                    <div className="w-2 h-6 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-t-full border border-yellow-700"></div>
                    <div className="w-2 h-5 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-t-full border border-yellow-700"></div>
                  </div>
                  
                  {/* Eyes */}
                  <div className="flex items-center gap-3 mb-1">
                    <div className="relative">
                      <div className="w-6 h-6 bg-white rounded-full border-2 border-black shadow-sm"></div>
                      <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 bg-black rounded-full"></div>
                    </div>
                    <div className="relative">
                      <div className="w-6 h-6 bg-white rounded-full border-2 border-black shadow-sm"></div>
                      <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 bg-black rounded-full"></div>
                    </div>
                  </div>
                  {/* Big happy smile */}
                  <div className="w-10 h-4 border-b-3 border-black rounded-b-full"></div>
                  {/* Beak */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-3 bg-gradient-to-b from-orange-400 to-orange-500 rounded-sm border border-orange-600"></div>
                </div>
              </div>
              {/* Frosting layer */}
              <div className="w-56 h-3 bg-gradient-to-r from-orange-200 via-orange-100 to-orange-200 border-x-4 border-yellow-600 shadow-md"></div>
            </Motion.div>

            {/* Bottom Layer - Happy Blue Bird (Largest) */}
            <Motion.div 
              className="relative z-10 -mt-1"
              animate={spellDropped ? { 
                y: [0, -1, 0],
                rotate: [0, 0.5, -0.5, 0] 
              } : {}}
              transition={{ duration: 3.5, repeat: Infinity }}
            >
              <div className="relative w-72 h-28 bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 rounded-b-[2.5rem] border-4 border-blue-600 shadow-2xl flex items-center justify-center overflow-hidden">
                {/* Shine effect */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent"></div>
                
                {/* Happy Blue Bird Face */}
                <div className="relative z-10">
                  {/* Eyes with happy expression */}
                  <div className="flex items-center gap-4 mb-2">
                    <div className="relative">
                      <div className="w-7 h-7 bg-white rounded-full border-2 border-black shadow-sm"></div>
                      <div className="absolute top-2 left-2 w-3 h-3 bg-black rounded-full"></div>
                      {/* Happy eye curve */}
                      <div className="absolute -top-1 left-0 w-7 h-2 border-t-2 border-black rounded-t-full"></div>
                    </div>
                    <div className="relative">
                      <div className="w-7 h-7 bg-white rounded-full border-2 border-black shadow-sm"></div>
                      <div className="absolute top-2 left-2 w-3 h-3 bg-black rounded-full"></div>
                      {/* Happy eye curve */}
                      <div className="absolute -top-1 left-0 w-7 h-2 border-t-2 border-black rounded-t-full"></div>
                    </div>
                  </div>
                  {/* Wide happy smile */}
                  <div className="w-12 h-5 border-b-3 border-black rounded-b-full"></div>
                  {/* Beak */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-4 bg-gradient-to-b from-orange-400 to-orange-500 rounded-sm border border-orange-600 shadow-md"></div>
                </div>
              </div>
            </Motion.div>
          </div>

          {/* Decorative Wooden Cake Stand */}
          <div className={`relative w-80 h-5 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 rounded-full border-4 border-amber-900 shadow-2xl -mt-2 transition-all duration-500 ${!spellDropped ? 'opacity-30 grayscale blur-sm' : ''}`}>
            {/* Wood grain texture */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-800/40 to-transparent rounded-full"></div>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)] rounded-full"></div>
          </div>

          {/* Angry Birds Badge */}
          {spellDropped && (
            <Motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 120, damping: 18 }}
              className="mt-6"
            >
              <Motion.div
                className="bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 text-white px-8 py-3 rounded-full font-bold text-2xl shadow-2xl border-4 border-white relative overflow-hidden"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255, 215, 0, 0.5)',
                    '0 0 40px rgba(255, 215, 0, 0.8)',
                    '0 0 20px rgba(255, 215, 0, 0.5)',
                  ]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: [0.33, 1, 0.68, 1] }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                <span className="relative z-10 drop-shadow-lg">🐦 HAPPY BIRDS CAKE 🎂</span>
              </Motion.div>
            </Motion.div>
          )}
        </Motion.div>
      </div>

      {/* Draggable Rage Spell */}
      {!spellDropped && (
        <Motion.div
            drag
            dragConstraints={{ left: -500, right: 500, top: -300, bottom: 300 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            whileHover={{ scale: 1.15 }}
            whileDrag={{ scale: 1.3, cursor: 'grabbing', rotate: 15 }}
            className="cursor-grab select-none"
            animate={!isDragging ? {
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            } : {}}
            transition={{ duration: 2.5, repeat: Infinity, ease: [0.33, 1, 0.68, 1], type: 'tween' }}
          >
            <div className="relative">
              <Motion.img
                src="/hie/Rage_Spell_info.webp"
                alt="Rage Spell"
                draggable={false}
                className="w-32 h-32 object-contain select-none"
                animate={{
                  filter: [
                    'drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))',
                    'drop-shadow(0 0 40px rgba(168, 85, 247, 1))',
                    'drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: [0.33, 1, 0.68, 1] }}
              />
              <Motion.div 
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-birthday-party-600 to-birthday-cake-600 text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap border-2 border-birthday-party-400"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: [0.33, 1, 0.68, 1] }}
              >
                Rage Spell 🎂
              </Motion.div>
            </div>
          </Motion.div>
      )}

      {/* Cut the Cake Button */}
      <AnimatePresence>
        {allCandlesOut && !cakeCut && (
          <Motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={cutTheCake}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-birthday-candle-500 via-birthday-cake-500 to-birthday-party-500 text-white px-8 py-4 rounded-full text-2xl font-bold shadow-2xl border-4 border-birthday-candle-300"
          >
            <Motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: [0.33, 1, 0.68, 1] }}
            >
              Cut the Cake 🔪✨
            </Motion.span>
          </Motion.button>
        )}
      </AnimatePresence>

      {/* Message Cards Grid */}
      <AnimatePresence>
        {cakeCut && (
          <Motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-6xl mx-auto px-4 mt-6"
          >
            <Motion.h2
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-birthday-cake-400 via-birthday-party-400 to-birthday-candle-400 bg-clip-text text-transparent font-supercell"
            >
              💌 Quick Birthday Wishes 💌
            </Motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {messages.map((message, index) => (
                <Motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5, y: -40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6, type: "spring" }}
                  whileHover={{ scale: 1.05, y: -8, transition: { duration: 0.2 } }}
                  className={`bg-gradient-to-br ${message.color} backdrop-blur-md p-5 rounded-xl border-2 border-white/30 shadow-2xl cursor-pointer`}
                >
                  <Motion.h3
                    className="text-xl md:text-2xl font-bold text-white mb-3 text-center drop-shadow-lg"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {message.title}
                  </Motion.h3>
                  <p className="text-white/95 text-center leading-relaxed text-sm md:text-base">
                    {message.text}
                  </p>
                </Motion.div>
              ))}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RageDropCake;
