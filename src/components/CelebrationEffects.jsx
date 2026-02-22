import { motion as Motion } from 'framer-motion';

const CelebrationEffects = ({ intensity = 'high', activeSection = 0 }) => {
  if (intensity === 'none') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Birthday Text Floating - Changes per section */}
      <Motion.div
        className="absolute top-10 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-black/50 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 shadow-2xl">
          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            {activeSection === 0 && '🎉 Happy Birthday, Smily! 👑'}
            {activeSection === 1 && '👑 LEGENDARY MOMENTS 👑'}
            {activeSection === 2 && "👑 Smily's Legendary Era 👑"}
          </div>
        </div>
      </Motion.div>

      {/* Corner Decorations - Static */}
      <div className="absolute top-4 left-4 text-4xl opacity-50">🎈</div>
      <div className="absolute top-4 right-4 text-4xl opacity-50">🎈</div>
      <div className="absolute bottom-4 left-4 text-4xl opacity-50">🎁</div>
      <div className="absolute bottom-4 right-4 text-4xl opacity-50">👑</div>
    </div>
  );
};

export default CelebrationEffects;
