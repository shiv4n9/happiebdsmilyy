import { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const CLAN_STARS = Array.from({ length: 40 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 2,
}));
const CLAN_GRASS = Array.from({ length: 60 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
}));

const ClanWarCake = ({ reduceMotion = false }) => {
  const [seals, setSeals] = useState([
    { id: 1, deployed: false, position: { x: 0, y: 0 } },
    { id: 2, deployed: false, position: { x: 0, y: 0 } },
    { id: 3, deployed: false, position: { x: 0, y: 0 } },
  ]);
  const [townHallDestroyed, setTownHallDestroyed] = useState(false);
  const [showLoot, setShowLoot] = useState(false);
  const [hoveringSeal, setHoveringSeal] = useState(null);
  const [encouragementShown, setEncouragementShown] = useState(false);
  const [projectiles, setProjectiles] = useState([]);
  const [healthPercentage, setHealthPercentage] = useState(100);
  const [takingDamage, setTakingDamage] = useState(false);
  const stars = CLAN_STARS;

  useEffect(() => {
    if (seals.filter(s => s.deployed).length === 1 && !encouragementShown) {
      setEncouragementShown(true);
    }
  }, [seals, encouragementShown]);

  const deploySeal = (id) => {
    const newSeals = seals.map(seal => 
      seal.id === id ? { ...seal, deployed: true } : seal
    );
    setSeals(newSeals);

    // Create projectile animation
    const projectileId = Date.now();
    setProjectiles(prev => [...prev, { id: projectileId, sealId: id }]);

    // Animate projectile hitting target
    setTimeout(() => {
      // Remove projectile
      setProjectiles(prev => prev.filter(p => p.id !== projectileId));
      
      // Apply damage - ensure it reaches 0
      const newHealth = Math.max(0, healthPercentage - 33.34);
      setHealthPercentage(newHealth);
      setTakingDamage(true);
      setTimeout(() => setTakingDamage(false), 200);

      // Check if health reached 0
      if (newHealth <= 0) {
        setTimeout(() => {
          setTownHallDestroyed(true);
          
          // Massive 3-star victory confetti burst
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#ffd700', '#a855f7', '#22c55e'],
            shapes: ['star', 'circle'],
            scalar: 1.5,
          });
          
          // Second burst
          setTimeout(() => {
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#ffd700', '#a855f7', '#22c55e'],
            });
          }, 300);
          
          setTimeout(() => setShowLoot(true), 500);
        }, 500);
      }
    }, 800);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
      {!reduceMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {stars.map((s, i) => (
            <Motion.div
              key={i}
              className="absolute"
              style={{
                left: s.left + '%',
                top: s.top + '%',
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: s.duration,
                repeat: Infinity,
                delay: s.delay,
              }}
            >
              <span className="text-2xl">⭐</span>
            </Motion.div>
          ))}
        </div>
      )}

      {/* Title */}
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 z-10"
      >
        <div className="bg-black/50 backdrop-blur-md px-8 py-6 rounded-2xl border border-white/20 shadow-2xl max-w-4xl mx-auto">
          <Motion.h1 
            className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-birthday-candle-400 via-emerald-400 to-birthday-party-500 bg-clip-text text-transparent animate-party-pulse font-supercell"
            animate={{ 
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🎮 Chapter 2: The COC Nostalgia Trip 🎮
          </Motion.h1>
          <Motion.p 
            className="text-3xl font-light bg-gradient-to-r from-birthday-candle-200 to-emerald-200 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⚔️ Deploy the 3 seals — Clash nostalgia, town hall vibes! ⚔️
          </Motion.p>
        </div>
      </Motion.div>

      {/* Battle Field - COC base as background scenery */}
      <div className="relative w-full max-w-4xl h-96 rounded-3xl border-8 border-yellow-700/80 overflow-hidden shadow-2xl shadow-inner">
        {/* COC base layout background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/coc/coc-base-bg.jpg)' }}
        />
        {/* Dark overlay so town hall & UI stand out */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/70 via-green-950/60 to-teal-950/80" />
        {/* Subtle grass overlay */}
        <div className="absolute inset-0 opacity-15">
          {CLAN_GRASS.map((g, i) => (
            <div
              key={i}
              className="absolute text-green-400 text-xs"
              style={{
                left: g.left + '%',
                top: g.top + '%',
              }}
            >
              🌿
            </div>
          ))}
        </div>

        {/* Town Hall Area */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          {healthPercentage > 0 ? (
            /* Active Game State */
            <Motion.div
              animate={takingDamage ? {
                scale: [1, 1.1, 1],
                filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)']
              } : {
                y: [0, -8, 0],
              }}
              transition={takingDamage ? { duration: 0.2 } : { duration: 2, repeat: Infinity }}
            >
              {/* Health Bar */}
              <Motion.div 
                className="absolute -top-16 left-1/2 -translate-x-1/2 w-48"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-red-900 h-4 rounded-full border-2 border-yellow-600 overflow-hidden shadow-lg">
                  <Motion.div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-400"
                    animate={{ width: `${healthPercentage}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-center text-white text-xs font-bold mt-1 text-shadow">
                  {Math.round(healthPercentage)}% HP
                </div>
              </Motion.div>

              <Motion.div 
                className="relative"
                animate={{
                  filter: [
                    'drop-shadow(0 0 20px rgba(239, 68, 68, 0.6))',
                    'drop-shadow(0 0 40px rgba(239, 68, 68, 1))',
                    'drop-shadow(0 0 20px rgba(239, 68, 68, 0.6))',
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <img 
                  src="/hie/townhall.png" 
                  alt="Town Hall" 
                  className="w-40 h-40 object-contain"
                />
              </Motion.div>
            </Motion.div>
          ) : (
            /* Victory Screen - Brief state before showLoot (no photo, single image shown in overlay) */
            <Motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex flex-col items-center justify-center max-w-md"
            >
              <Motion.h2 
                className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4 drop-shadow-lg tracking-wide font-supercell text-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ⭐⭐⭐ 3-STAR VICTORY! ⭐⭐⭐
              </Motion.h2>
              <Motion.div 
                className="p-6 bg-gradient-to-br from-amber-100 to-yellow-200 rounded-xl shadow-2xl border-4 border-amber-300"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <p className="text-amber-900 text-center font-bold text-lg">
                  🎂 Legendary Loot incoming... 🎂
                </p>
              </Motion.div>
            </Motion.div>
          )}
        </div>

        {/* Projectile Seals - Attacking Animation */}
        {projectiles.map((projectile) => (
          <Motion.div
            key={projectile.id}
            className="absolute text-6xl z-30 -translate-x-1/2 -translate-y-1/2"
            initial={{ 
              left: '15%',
              top: '95%',
              x: '-50%',
              y: '-50%',
              rotate: -45,
              scale: 0.8,
              filter: 'drop-shadow(0 0 10px rgba(52, 211, 153, 0.8))',
            }}
            animate={reduceMotion ? { 
              left: '50%',
              top: '45%',
              x: '-50%',
              y: '-50%',
              opacity: 0,
            } : { 
              left: ['15%', '35%', '50%'],
              top: ['95%', '60%', '45%'],
              x: '-50%',
              y: '-50%',
              rotate: [-45, 90, 180, 360],
              scale: [0.8, 1.1, 1.4, 1.6],
              filter: [
                'drop-shadow(0 0 10px rgba(52, 211, 153, 0.8))',
                'drop-shadow(0 0 25px rgba(239, 68, 68, 0.9))',
                'drop-shadow(0 0 40px rgba(239, 68, 68, 1))',
              ],
            }}
            transition={reduceMotion ? { duration: 0.3 } : { 
              duration: 0.8, 
              ease: [0.25, 0.46, 0.45, 0.94],
              times: [0, 0.5, 1],
            }}
          >
            <Motion.div
              animate={!reduceMotion ? {
                scaleX: [1, 1.2, 1],
                scaleY: [1, 0.9, 1],
                rotate: [0, 15, -15, 0],
              } : {}}
              transition={!reduceMotion ? { 
                duration: 0.8,
                times: [0, 0.7, 0.85, 1],
              } : {}}
            >
              🦭
            </Motion.div>
          </Motion.div>
        ))}

      </div>

      {/* 3-Star Victory Overlay - Full layout when showLoot */}
      <AnimatePresence>
        {showLoot && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 md:gap-6 px-4 py-8"
          >
            {/* Semi-transparent backdrop */}
            <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm -z-10" />

            {/* Victory Banner */}
            <Motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="flex gap-0.5 text-3xl md:text-4xl">⭐</div>
              <Motion.div
                className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-gray-900 px-6 md:px-8 py-2 md:py-3 rounded-2xl font-bold text-lg md:text-2xl shadow-2xl border-4 border-yellow-300 font-supercell"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: [0.33, 1, 0.68, 1] }}
              >
                3-STAR VICTORY!
              </Motion.div>
              <div className="flex gap-1 text-2xl md:text-3xl">⭐⭐⭐</div>
            </Motion.div>

            {/* Main Loot Card - Polaroid style */}
            <Motion.div
              initial={{ y: 40, opacity: 0, rotate: -3 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 18, delay: 0.15 }}
              className="flex flex-col items-center"
            >
              <Motion.div
                className="bg-white p-3 md:p-4 rounded-lg shadow-2xl border-4 border-amber-200/80 max-w-[280px] md:max-w-[320px]"
                style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)' }}
                animate={{
                  y: [0, -6, 0],
                  rotate: [0, 1, -1, 0],
                  boxShadow: [
                    '0 25px 50px -12px rgba(0,0,0,0.4)',
                    '0 30px 60px -12px rgba(250, 204, 21, 0.3)',
                    '0 25px 50px -12px rgba(0,0,0,0.4)',
                  ],
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: [0.33, 1, 0.68, 1] }}
              >
                <img
                  src="/real/photo2.jpg"
                  alt="Legendary Memory"
                  className="w-full aspect-[3/4] object-cover rounded-md"
                />
                <p className="text-center font-bold text-gray-800 text-base md:text-lg mt-3 py-2">
                  🎂 Legendary Loot! 🎂
                </p>
              </Motion.div>
            </Motion.div>

            {/* Reward badges */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-6 md:gap-8"
            >
              <Motion.div
                className="text-4xl md:text-5xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              >
                💜
              </Motion.div>
              <Motion.div
                className="text-4xl md:text-5xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              >
                💰
              </Motion.div>
            </Motion.div>

            {/* Continue hint */}
            <Motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-amber-200/90 text-sm md:text-base font-medium"
            >
              Scroll down for Chapter 3 ↓
            </Motion.p>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Seal Deployment Buttons */}
      {!townHallDestroyed && (
        <div className="relative z-20 mt-12">
          {/* Encouragement Message */}
          <AnimatePresence>
            {encouragementShown && seals.filter(s => s.deployed).length < 3 && (
              <Motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="mb-6"
              >
                <Motion.div
                  className="bg-black/60 backdrop-blur-md border border-birthday-candle-400/50 text-white px-8 py-4 rounded-full text-xl font-bold shadow-2xl"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🎉 Keep going! Deploy all seals! 🎉
                </Motion.div>
              </Motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-8 justify-center items-center">
            {seals.map((seal) => (
              <Motion.button
                key={seal.id}
                onClick={() => deploySeal(seal.id)}
                onHoverStart={() => setHoveringSeal(seal.id)}
                onHoverEnd={() => setHoveringSeal(null)}
                disabled={seal.deployed}
                whileHover={!seal.deployed ? { scale: 1.3, rotate: [0, -15, 15, 0] } : {}}
                whileTap={!seal.deployed ? { scale: 0.85 } : {}}
                animate={!seal.deployed ? {
                  y: [0, -15, 0],
                } : {}}
                transition={{ duration: 1, repeat: Infinity, delay: seal.id * 0.2 }}
                className={`relative text-8xl ${
                  seal.deployed ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <Motion.div
                  animate={!seal.deployed ? {
                    filter: [
                      'drop-shadow(0 0 15px rgba(52, 211, 153, 0.6))',
                      'drop-shadow(0 0 30px rgba(52, 211, 153, 1))',
                      'drop-shadow(0 0 15px rgba(52, 211, 153, 0.6))',
                    ]
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🦭
                </Motion.div>
                {!seal.deployed && (
                  <Motion.div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border-2 border-emerald-400 shadow-lg"
                    animate={{ 
                      opacity: hoveringSeal === seal.id ? 1 : [0.7, 1, 0.7],
                      scale: hoveringSeal === seal.id ? 1.1 : [1, 1.05, 1]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {hoveringSeal === seal.id ? '🎯 Click Me!' : 'Deploy Seal'}
                  </Motion.div>
                )}
              </Motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClanWarCake;
