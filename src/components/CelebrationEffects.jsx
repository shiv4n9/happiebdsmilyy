import { motion as Motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const CelebrationEffects = ({ intensity = 'high', activeSection = 0 }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (intensity === 'none') return null;

  // Birthday + Queen theme (gold, pink, purple)
  const sectionColors = [
    { primary: '#facc15', secondary: '#f472b6', tertiary: '#a855f7' },
    { primary: '#facc15', secondary: '#22c55e', tertiary: '#a855f7' },
    { primary: '#facc15', secondary: '#ec4899', tertiary: '#a855f7' },
  ];

  const currentColors = sectionColors[activeSection] || sectionColors[0];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Subtle Mouse Trail Effect */}
      <Motion.div
        className="absolute w-6 h-6 rounded-full pointer-events-none opacity-30"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          background: `radial-gradient(circle, ${currentColors.primary}, transparent)`,
        }}
        animate={{
          scale: [1, 1.5, 0],
          opacity: [0.3, 0.1, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: [0.33, 1, 0.68, 1],
        }}
      />

      {/* Birthday Text Floating - Changes per section */}
      <Motion.div
        className="absolute top-10 left-1/2 -translate-x-1/2 text-center"
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: [0.33, 1, 0.68, 1],
        }}
      >
        <Motion.div
          key={activeSection}
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="bg-black/50 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 shadow-2xl"
        >
          <div
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-party-pulse font-supercell"
            style={{
              filter: `drop-shadow(0 0 20px ${currentColors.primary}) drop-shadow(0 0 30px rgba(168, 85, 247, 0.5))`,
            }}
          >
            {activeSection === 0 && '🎉 Happy Birthday, Smily! 👑'}
            {activeSection === 1 && '👑 LEGENDARY MOMENTS 👑'}
            {activeSection === 2 && "👑 Smily's Legendary Era 👑"}
          </div>
        </Motion.div>
      </Motion.div>

      {/* Corner Decorations - Interactive but subtle */}
      <Motion.div
        className="absolute top-4 left-4 text-5xl cursor-pointer pointer-events-auto opacity-60 hover:opacity-100"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: [0.33, 1, 0.68, 1] }}
        whileHover={{ scale: 1.2, rotate: 45 }}
        whileTap={{ scale: 0.9 }}
        style={{ filter: `drop-shadow(0 0 10px ${currentColors.primary})` }}
      >
        🎈
      </Motion.div>
      <Motion.div
        className="absolute top-4 right-4 text-5xl cursor-pointer pointer-events-auto opacity-60 hover:opacity-100"
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.5, ease: [0.33, 1, 0.68, 1] }}
        whileHover={{ scale: 1.2, rotate: -45 }}
        whileTap={{ scale: 0.9 }}
        style={{ filter: `drop-shadow(0 0 10px ${currentColors.secondary})` }}
      >
        🎈
      </Motion.div>
      <Motion.div
        className="absolute bottom-4 left-4 text-5xl cursor-pointer pointer-events-auto opacity-60 hover:opacity-100"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: [0.33, 1, 0.68, 1] }}
        whileHover={{ scale: 1.2, y: -20 }}
        whileTap={{ scale: 0.9 }}
        style={{ filter: `drop-shadow(0 0 10px ${currentColors.tertiary})` }}
      >
        🎁
      </Motion.div>
      <Motion.div
        className="absolute bottom-4 right-4 text-5xl cursor-pointer pointer-events-auto opacity-60 hover:opacity-100"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.7, ease: [0.33, 1, 0.68, 1] }}
        whileHover={{ scale: 1.2, y: -20 }}
        whileTap={{ scale: 0.9 }}
        style={{ filter: `drop-shadow(0 0 12px ${currentColors.primary}) drop-shadow(0 0 20px rgba(250, 204, 21, 0.6))` }}
      >
        👑
      </Motion.div>

      {/* Subtle Pulsing Ring Effect */}
      <Motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-2 opacity-10"
        style={{ borderColor: currentColors.primary }}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.1, 0, 0.1],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: [0.33, 1, 0.68, 1],
        }}
      />
    </div>
  );
};

export default CelebrationEffects;
