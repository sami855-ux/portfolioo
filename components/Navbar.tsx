'use client';

import { useTheme } from '@/app/providers';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineChip,
  HiOutlineFolder,
  HiOutlineHome,
  HiOutlineMail,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineUser
} from 'react-icons/hi';

const navItems = [
  { id: 'hero', label: 'Home', icon: HiOutlineHome },
  { id: 'about', label: 'About', icon: HiOutlineUser },
  { id: 'skills', label: 'Skills', icon: HiOutlineChip },
  { id: 'projects', label: 'Projects', icon: HiOutlineFolder },
  { id: 'experience', label: 'Experience', icon: HiOutlineBriefcase },
  { id: 'education', label: 'Education', icon: HiOutlineAcademicCap },
  { id: 'contact', label: 'Contact', icon: HiOutlineMail },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  // Precision IntersectionObserver scroll tracking
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.header
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] sm:max-w-none pointer-events-auto"
    >
      {/* Mobile-Responsive Soft Gray Glass Dock */}
      <nav className="relative bg-zinc-100/95 dark:bg-zinc-950/90 backdrop-blur-2xl border border-zinc-300/90 dark:border-zinc-800/90 shadow-[0_10px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-full p-1.5 sm:p-2 flex items-center gap-0.5 sm:gap-1.5 transition-colors duration-300">
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const isHovered = hoveredNav === item.id;

          return (
            <div key={item.id} className="relative">
              {/* Animated Top Tooltip on Hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.9 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 sm:px-3 py-1 rounded-lg bg-zinc-900 text-[10px] sm:text-xs font-bold text-emerald-400 shadow-xl pointer-events-none whitespace-nowrap backdrop-blur-md z-20"
                  >
                    {item.label}
                    {/* Tooltip Arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Icon Button */}
              <motion.button
                onClick={() => scrollToSection(item.id)}
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
                whileHover={{ y: -2, scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors duration-200 select-none ${
                  isActive
                    ? 'text-black font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/80 dark:hover:bg-white/10'
                }`}
              >
                {/* Active Spring Circle Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeDockPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] z-0"
                  />
                )}

                {/* Icon */}
                <span className="relative z-10">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                </span>
              </motion.button>
            </div>
          );
        })}

        {/* Divider line */}
        <div className="w-px h-5 sm:h-6 bg-zinc-300 dark:bg-zinc-800 mx-0.5 sm:mx-1" />

        {/* Theme Toggle Button */}
        <div className="relative">
          <AnimatePresence>
            {hoveredNav === 'theme' && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 sm:px-3 py-1 rounded-lg bg-zinc-900 text-[10px] sm:text-xs font-bold text-emerald-400 shadow-xl pointer-events-none whitespace-nowrap backdrop-blur-md z-20"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={toggleTheme}
            onMouseEnter={() => setHoveredNav('theme')}
            onMouseLeave={() => setHoveredNav(null)}
            whileHover={{ y: -2, scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-zinc-200/80 dark:hover:bg-white/10 transition-colors"
          >
            {theme === 'dark' ? (
              <HiOutlineSun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
              <HiOutlineMoon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
            )}
          </motion.button>
        </div>

      </nav>
    </motion.header>
  );
}
