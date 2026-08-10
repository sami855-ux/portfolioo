'use client';

import { Hero as HeroType } from '@/types';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import {
  FaArrowRight,
  FaCode,
  FaDatabase,
  FaDownload,
  FaEnvelope,
  FaGithub,
  FaLayerGroup,
  FaLinkedin,
  FaNodeJs,
  FaReact,
} from 'react-icons/fa';

export default function Hero({ data }: { data: HeroType }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const techStack = [
    { name: 'React', icon: FaReact, color: 'text-emerald-500 dark:text-emerald-400' },
    { name: 'Next.js', icon: FaCode, color: 'text-zinc-800 dark:text-zinc-200' },
    { name: 'TypeScript', icon: FaCode, color: 'text-teal-600 dark:text-teal-400' },
    { name: 'Node.js', icon: FaNodeJs, color: 'text-emerald-600 dark:text-emerald-400' },
    { name: 'PostgreSQL', icon: FaDatabase, color: 'text-emerald-700 dark:text-lime-400' },
    { name: 'Tailwind CSS', icon: FaLayerGroup, color: 'text-teal-600 dark:text-teal-300' },
  ];

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[90vh] flex items-center justify-center bg-white dark:bg-black text-zinc-900 dark:text-white pt-28 pb-20 transition-colors duration-300"
    >
      {/* Soft Ambient Background Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-[550px] h-[550px] rounded-full bg-emerald-500/10 dark:bg-emerald-950/20 blur-[140px]" />
        <div className="absolute bottom-10 -right-32 w-[550px] h-[550px] rounded-full bg-emerald-400/10 dark:bg-emerald-900/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-6 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for Hire</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 text-zinc-900 dark:text-white"
            >
              Hi, I&apos;m{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300 bg-clip-text text-transparent">
                {data.fullName}
              </span>
            </motion.h1>

            {/* Title / Role */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl sm:text-2xl font-semibold text-zinc-600 dark:text-zinc-400 mb-6"
            >
              {data.professionalTitle}
            </motion.h2>

            {/* Bio / Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl mb-8 leading-relaxed font-normal"
            >
              {data.tagline}
            </motion.p>

            {/* Action Buttons & Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <a
                href="#projects"
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400 text-black font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-emerald-500/20 transition-all duration-200"
              >
                <span>View My Work</span>
                <FaArrowRight className="text-xs" />
              </a>

              {data.resumeLink && (
                <a
                  href={data.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open resume in a new tab"
                  className="px-6 py-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 hover:border-emerald-500/50 text-zinc-800 dark:text-zinc-200 text-sm font-semibold flex items-center gap-2 transition-colors duration-200 shadow-sm"
                >
                  <FaDownload className="text-xs text-emerald-600 dark:text-emerald-400" />
                  <span>Resume</span>
                </a>
              )}

              {/* Social Links */}
              <div className="flex items-center gap-2 pl-2">
                {(data.githubLink || data.socialLinks?.github) && (
                  <a
                    href={data.githubLink || data.socialLinks?.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-white hover:border-emerald-500/50 flex items-center justify-center transition-colors duration-200 shadow-sm"
                  >
                    <FaGithub className="text-lg" />
                  </a>
                )}
                {(data.linkedinLink || data.socialLinks?.linkedin) && (
                  <a
                    href={data.linkedinLink || data.socialLinks?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-white hover:border-emerald-500/50 flex items-center justify-center transition-colors duration-200 shadow-sm"
                  >
                    <FaLinkedin className="text-lg" />
                  </a>
                )}
                {(data.email || data.socialLinks?.email) && (
                  <a
                    href={`mailto:${data.email || data.socialLinks?.email}`}
                    className="w-11 h-11 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-white hover:border-emerald-500/50 flex items-center justify-center transition-colors duration-200 shadow-sm"
                  >
                    <FaEnvelope className="text-lg" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual Frame & Tech Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-5 flex flex-col items-center"
          >
            <div className="relative w-full max-w-xs sm:max-w-sm aspect-square mb-8">
              {/* Fully Rounded Profile Image Frame */}
              <div className="relative w-full h-full rounded-full p-1.5 bg-gradient-to-b from-emerald-500/30 via-zinc-200 to-white dark:via-zinc-900 dark:to-zinc-900 border border-zinc-200 dark:border-emerald-500/40 overflow-hidden shadow-2xl">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                  <Image
                    src={data.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop'}
                    alt={data.fullName}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 dark:from-black/50 via-transparent to-transparent" />
                </div>
              </div>

              {/* Centered Specialization Badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-md flex items-center gap-2.5 whitespace-nowrap z-10">
                <div className="p-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <FaCode className="text-xs" />
                </div>
                <div className="text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400 text-[10px] uppercase font-bold mr-1.5">Focus:</span>
                  <span className="text-zinc-900 dark:text-white font-bold">Full-Stack Development</span>
                </div>
              </div>
            </div>

            {/* Clean Grid of Tech Stack Icons */}
            <div className="w-full max-w-sm grid grid-cols-3 gap-2">
              {techStack.map((tech) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={tech.name}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 text-xs font-semibold text-zinc-800 dark:text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-white transition-colors duration-200 shadow-sm"
                  >
                    <Icon className={`text-sm ${tech.color}`} />
                    <span className="truncate">{tech.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
