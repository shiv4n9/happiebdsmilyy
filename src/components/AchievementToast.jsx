import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const AchievementToast = ({ achievement, onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => onComplete?.(), 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {show && (
        <Motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed top-24 right-8 z-[100] pointer-events-none"
        >
          <Motion.div
            className="bg-gradient-to-br from-birthday-candle-500 via-birthday-party-600 to-birthday-cake-600 p-6 rounded-2xl shadow-2xl border-4 border-birthday-candle-300 min-w-[300px]"
            animate={{
              boxShadow: [
                '0 0 30px rgba(250, 204, 21, 0.6)',
                '0 0 60px rgba(250, 204, 21, 1)',
                '0 0 30px rgba(250, 204, 21, 0.6)',
              ],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="flex items-center gap-4">
              <Motion.div
                className="text-5xl"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                {achievement.icon}
              </Motion.div>
              <div className="flex-1">
                <div className="text-white font-bold text-sm mb-1">
                  🎉 Achievement Unlocked!
                </div>
                <div className="text-birthday-candle-100 font-bold text-lg">
                  {achievement.title}
                </div>
                <div className="text-birthday-candle-200 text-sm mt-1">
                  {achievement.description}
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <Motion.div
              className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden"
              initial={{ width: '100%' }}
            >
              <Motion.div
                className="h-full bg-gradient-to-r from-birthday-candle-300 to-white"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
              />
            </Motion.div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementToast;
