import { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import GhibliIntro from './components/GhibliIntro';
import VinylPlayer from './components/VinylPlayer';
import ClanWarCake from './components/ClanWarCake';
import RageDropCake from './components/RageDropCake';
import CelebrationEffects from './components/CelebrationEffects';
import AchievementToast from './components/AchievementToast';

// Smooth easing for all motions (less choppy)
const SMOOTH_EASE = [0.33, 1, 0.68, 1];

// Stable positions for background decorations (avoids re-render flicker)
const PHULKARI = [...Array(10)].map((_, i) => ({
  left: [12, 85, 45, 72, 8, 92, 35, 68, 22, 78][i],
  top: [5, 75, 40, 90, 55, 15, 82, 28, 65, 42][i],
  duration: 28 + (i % 6),
  delay: i * 1.5,
}));
const MUSIC = [...Array(6)].map((_, i) => ({
  left: [18, 88, 55, 8, 75, 42][i],
  top: [25, 80, 12, 68, 92, 48][i],
  duration: 24 + (i % 5),
  delay: i * 2,
}));
const SPARKLES = [...Array(12)].map((_, i) => ({
  left: [5, 90, 35, 70, 15, 82, 48, 25, 95, 58, 12, 78][i],
  top: [10, 88, 32, 72, 55, 18, 85, 42, 65, 8, 78, 35][i],
  duration: 32 + (i % 8),
  delay: i * 1,
}));
const DIYAS = [...Array(4)].map((_, i) => ({
  left: [20, 75, 50, 90][i],
  top: [30, 85, 15, 60][i],
  delay: i * 0.9,
}));

function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [currentAchievement, setCurrentAchievement] = useState(null);

  const achievementsList = {
    musicStart: { icon: '🎵', title: 'Music Lover', description: 'Started the birthday celebration!' },
    section2: { icon: '🎮', title: 'Memory Lane', description: 'Explored the nostalgia trip!' },
    section3: { icon: '👑', title: 'Birthday Explorer', description: 'Reached the final chapter!' },
    backToTop: { icon: '🔄', title: 'Full Circle', description: 'Completed the journey!' },
  };

  const showAchievement = (key) => {
    if (!achievements.includes(key)) {
      setAchievements(prev => [...prev, key]);
      setCurrentAchievement(achievementsList[key]);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const sections = ['#section-1', '#section-2', '#section-3'].map((s) => document.querySelector(s)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const i = sections.findIndex((el) => el === visible.target);
          if (i !== -1) {
            setActiveIndex(i);
            // Show achievements
            if (i === 1) showAchievement('section2');
            if (i === 2) showAchievement('section3');
          }
        }
      },
      { threshold: [0.3, 0.6, 0.9] }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [achievements]);

  useEffect(() => {
    const sections = ['#section-1', '#section-2', '#section-3'];
    const scrollToIndex = (i) => {
      document.querySelector(sections[i])?.scrollIntoView({ behavior: 'smooth' });
    };
    const handler = (e) => {
      const keysDown = ['ArrowDown', 'PageDown'];
      const keysUp = ['ArrowUp', 'PageUp'];
      if (keysDown.includes(e.key)) {
        e.preventDefault();
        scrollToIndex(Math.min(activeIndex + 1, sections.length - 1));
      } else if (keysUp.includes(e.key)) {
        e.preventDefault();
        scrollToIndex(Math.max(activeIndex - 1, 0));
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToIndex(sections.length - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIndex]);

  // Set default background music volume
  useEffect(() => {
    const audio = document.getElementById('bg-music');
    if (audio) {
      audio.volume = 0.75;
    }
  }, []);

  return (
    <>
      {/* Show the intro if it hasn't finished */}
      {!introFinished && (
        <GhibliIntro onComplete={() => setIntroFinished(true)} />
      )}

      {/* Show the main website ONLY after the intro finishes */}
      <AnimatePresence mode="wait">
        {introFinished && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: SMOOTH_EASE }}
          className="h-screen w-full overflow-y-scroll overscroll-y-none snap-y smooth-scroll-snap scroll-smooth confetti-bg relative"
          style={{
            background: 'linear-gradient(160deg, #1e1b4b 0%, #4c1d95 25%, #581c87 50%, #831843 75%, #9d174d 90%, #1e1b4b 100%)',
          }}
        >
          {/* Background decorations - disabled on mobile for performance */}
          {!isMobile && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {PHULKARI.map((p, i) => (
              <Motion.div
                key={`phulkari-${i}`}
                className="absolute text-7xl"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  filter: 'drop-shadow(0 0 15px rgba(250, 204, 21, 0.4)) drop-shadow(0 0 20px rgba(236, 72, 153, 0.4))',
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.15, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: SMOOTH_EASE,
                  type: 'tween',
                }}
              >
                {['🌺', '👑', '🌸', '🌼', '🏵️'][i % 5]}
              </Motion.div>
            ))}
            
            {/* Reduced Musical Elements */}
            {MUSIC.map((m, i) => (
              <Motion.div
                key={`music-${i}`}
                className="absolute text-6xl"
                style={{
                  left: `${m.left}%`,
                  top: `${m.top}%`,
                  filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.6))',
                }}
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 5, -5, 0],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: m.duration,
                  repeat: Infinity,
                  delay: m.delay,
                  ease: SMOOTH_EASE,
                  type: 'tween',
                }}
              >
                {['🥁', '🎵', '🎶', '🪕'][i % 4]}
              </Motion.div>
            ))}

            {/* Reduced Sparkles */}
            {SPARKLES.map((s, i) => (
              <Motion.div
                key={`sparkle-${i}`}
                className="absolute text-4xl"
                style={{
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))',
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [0.9, 1.1, 0.9],
                  opacity: [0.35, 0.6, 0.35],
                }}
                transition={{
                  duration: s.duration,
                  repeat: Infinity,
                  delay: s.delay,
                  ease: SMOOTH_EASE,
                  type: 'tween',
                }}
              >
                {['💫', '✨', '⭐', '🌟'][i % 4]}
              </Motion.div>
            ))}

            {/* Reduced Diyas */}
            {DIYAS.map((d, i) => (
              <Motion.div
                key={`diya-${i}`}
                className="absolute text-5xl"
                style={{
                  left: `${d.left}%`,
                  top: `${d.top}%`,
                  filter: 'drop-shadow(0 0 20px rgba(255, 140, 0, 0.7))',
                }}
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.55, 0.75, 0.55],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: d.delay,
                  ease: SMOOTH_EASE,
                  type: 'tween',
                }}
              >
                🪔
              </Motion.div>
            ))}
          </div>
          )}

          {/* Achievement Toast */}
          <AchievementToast 
            achievement={currentAchievement} 
            onComplete={() => setCurrentAchievement(null)} 
          />

      {/* Grand Celebration Effects - disabled on mobile for performance */}
      {musicStarted && !isMobile && <CelebrationEffects intensity="high" activeSection={activeIndex} />}

      {/* Interactive Birthday Counter */}
      {musicStarted && (
        <Motion.div
          className="fixed top-20 right-8 z-50 pointer-events-auto"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 0.7, ease: SMOOTH_EASE }}
        >
          <Motion.div
            className="bg-gradient-to-br from-birthday-cake-500/90 to-birthday-party-600/90 backdrop-blur-lg px-6 py-4 rounded-2xl border-3 border-birthday-candle-400 shadow-2xl cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(251, 113, 133, 0.5)',
                '0 0 40px rgba(251, 113, 133, 0.8)',
                '0 0 20px rgba(251, 113, 133, 0.5)',
              ]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: SMOOTH_EASE }}
          >
            <div className="text-center">
              <div className="text-4xl mb-1">🎂</div>
              <div className="text-white font-bold text-sm">Chapter {activeIndex + 1}/3</div>
            </div>
          </Motion.div>
        </Motion.div>
      )}
      {/* Section 1: Vinyl Player */}
      <section id="section-1" className="min-h-screen w-full flex items-center justify-center snap-start relative party-shadow py-16 px-4" style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #581c87 100%)' }}>
        <VinylPlayer 
          onMusicStart={() => {
            setMusicStarted(true);
            showAchievement('musicStart');
          }} 
          reduceMotion={reduceMotion}
          isMobile={isMobile} 
        />
        
        {/* Scroll Indicator */}
        {musicStarted && (
          <Motion.div
            role="button"
            tabIndex={0}
            aria-label="Scroll to section 2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: SMOOTH_EASE, type: 'tween' }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer z-50 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 rounded-full"
            onClick={() => {
              document.querySelector('#section-2')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                document.querySelector('#section-2')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <Motion.div
              className="bg-gradient-to-br from-birthday-cake-400 via-birthday-party-500 to-birthday-candle-500 p-4 rounded-full shadow-2xl border-4 border-birthday-cake-300"
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                boxShadow: [
                  '0 0 30px rgba(251, 113, 133, 0.6)',
                  '0 0 60px rgba(251, 113, 133, 1)',
                  '0 0 30px rgba(251, 113, 133, 0.6)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: SMOOTH_EASE }}
            >
              <ChevronDown size={48} strokeWidth={3} className="text-white" />
            </Motion.div>
          </Motion.div>
        )}
      </section>

      {/* Section 2: Clan War Cake */}
      <section 
        id="section-2"
        className="min-h-screen w-full flex items-center justify-center snap-start relative party-shadow py-16 px-4"
        style={{ background: 'linear-gradient(180deg, #14532d 0%, #166534 25%, #1e3a5f 60%, #581c87 100%)' }}
      >
        <ClanWarCake reduceMotion={reduceMotion} isMobile={isMobile} />
        
        {/* Scroll Indicator */}
        <Motion.div
          role="button"
          tabIndex={0}
          aria-label="Scroll to section 3"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: SMOOTH_EASE, type: 'tween' }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer z-50 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 rounded-full"
          onClick={() => {
            document.querySelector('#section-3')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              document.querySelector('#section-3')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <Motion.div
            className="bg-gradient-to-br from-birthday-candle-400 via-birthday-party-500 to-emerald-600 p-4 rounded-full shadow-2xl border-4 border-birthday-candle-300 animate-candle-flicker"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                '0 0 30px rgba(250, 204, 21, 0.6)',
                '0 0 60px rgba(250, 204, 21, 1)',
                '0 0 30px rgba(250, 204, 21, 0.6)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: SMOOTH_EASE }}
          >
            <ChevronDown size={48} strokeWidth={3} className="text-white" />
          </Motion.div>
        </Motion.div>
      </section>

      {/* Section 3: Rage Drop Cake - Grand Finale */}
      <section 
        id="section-3"
        className="min-h-screen w-full flex items-center justify-center snap-start relative party-shadow py-16 px-4 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(250, 204, 21, 0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 80% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%), linear-gradient(180deg, #1e1b4b 0%, #4c1d95 30%, #831843 60%, #9d174d 80%, #701a75 100%)',
        }}
      >
        <RageDropCake 
          reduceMotion={reduceMotion}
          isMobile={isMobile}
          onFinishLetter={() => {
            setShowBackToTop(true);
            showAchievement('backToTop');
          }} 
        />
        {showBackToTop && (
          <Motion.div
            role="button"
            tabIndex={0}
            aria-label="Back to top"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: SMOOTH_EASE, type: 'tween' }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer z-50 focus:outline-none focus:ring-4 focus:ring-fuchsia-400/50 rounded-full"
            onClick={() => {
              document.querySelector('#section-1')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                document.querySelector('#section-1')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <Motion.div
              className="bg-gradient-to-br from-birthday-party-400 via-birthday-cake-500 to-pink-600 p-4 rounded-full shadow-2xl border-4 border-birthday-party-300 animate-party-pulse"
              whileHover={{ scale: 1.15, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                boxShadow: [
                  '0 0 30px rgba(168, 85, 247, 0.6)',
                  '0 0 60px rgba(168, 85, 247, 1)',
                  '0 0 30px rgba(168, 85, 247, 0.6)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: SMOOTH_EASE }}
            >
              <ChevronUp size={48} strokeWidth={3} className="text-white" />
            </Motion.div>
          </Motion.div>
        )}
      </section>

      {/* Background Music */}
      <audio id="bg-music" loop>
        <source src="/assets/admiring-you.mp3" type="audio/mpeg" />
      </audio>

      <div className="fixed bottom-4 right-4 z-50 bg-black/40 backdrop-blur-xl text-white px-3 py-2 rounded-full border border-white/20 flex items-center gap-2 pointer-events-auto">
        <Motion.button
          onClick={() => {
            const a = document.getElementById('bg-music');
            if (a) a.muted = !a.muted;
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-3 py-1 rounded-full bg-gradient-to-r from-birthday-cake-500 to-birthday-party-600 hover:from-birthday-cake-600 hover:to-birthday-party-700 transition-all"
        >
          🔊 Mute
        </Motion.button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          onChange={(e) => {
            const a = document.getElementById('bg-music');
            if (a) a.volume = parseFloat(e.target.value);
          }}
          defaultValue={0.75}
          className="w-24 accent-birthday-candle-400"
        />
      </div>

      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
        {[0, 1, 2].map((i) => (
          <Motion.button
            key={i}
            aria-label={`Go to section ${i + 1}`}
            onClick={() => {
              document.querySelector(`#section-${i + 1}`)?.scrollIntoView({ behavior: 'smooth' });
            }}
            animate={activeIndex === i ? {
              scale: [1.25, 1.35, 1.25],
              boxShadow: [
                '0 0 15px rgba(250, 204, 21, 0.6)',
                '0 0 25px rgba(250, 204, 21, 1)',
                '0 0 15px rgba(250, 204, 21, 0.6)',
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: SMOOTH_EASE, type: 'tween' }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ease-out ${
              activeIndex === i 
                ? 'scale-125 bg-birthday-candle-400 candle-glow' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
        </Motion.div>
        )}
      </AnimatePresence>
      <Analytics />
    </>
  );
}

export default App;
