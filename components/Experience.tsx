'use client';

import { Experience as ExperienceType } from '@/types';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  HiChevronDown,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineCode,
  HiOutlineLocationMarker,
  HiOutlineStar
} from 'react-icons/hi';

function ExperienceCardItem({
  exp,
  idx,
  sectionInView
}: {
  exp: ExperienceType;
  idx: number;
  sectionInView: boolean;
}) {
  const isEven = idx % 2 === 0;
  const techStack = exp.technologies || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={sectionInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
      className={`relative flex flex-col sm:flex-row ${isEven ? 'sm:flex-row-reverse' : ''} items-start gap-6 sm:gap-8`}
    >
      {/* Timeline dot */}
      <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full border-4 border-white dark:border-black bg-emerald-500 z-10 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />

      {/* Card Container */}
      <div className={`w-full sm:w-[calc(50%-1.5rem)] ${isEven ? 'sm:pl-0' : 'sm:pr-0'} pl-10 sm:pl-0`}>
        <div className="group relative bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 rounded-xl p-6 sm:p-7 transition-all duration-300 shadow-md">
          
          {/* Header Row: Company & Date */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              {exp.company}
            </span>

            <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-semibold">
              <HiOutlineCalendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{exp.duration}</span>
            </div>
          </div>

          {/* Role Title */}
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
            {exp.role}
          </h3>

          {/* Location */}
          {exp.location && (
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs mt-1 mb-4">
              <HiOutlineLocationMarker className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{exp.location}</span>
            </div>
          )}

          {/* Content Area */}
          <div className="pt-4 mt-3 border-t border-zinc-200 dark:border-zinc-800/80">
            {/* Description */}
            <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4 font-normal">
              {exp.description}
            </p>

            {/* Key Responsibilities */}
            {exp.responsibilities && exp.responsibilities.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-2.5 flex items-center gap-1.5">
                  <HiOutlineStar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Key Contributions
                </h4>
                <ul className="space-y-2">
                  {exp.responsibilities.map((resp, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed"
                    >
                      <HiOutlineCheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack Badges */}
            {techStack.length > 0 && (
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
                <div className="flex flex-wrap gap-1.5">
                  {techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300 font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}

export default function Experience({ data }: { data: ExperienceType[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section 
      id="experience" 
      className="relative min-h-screen flex items-center justify-center bg-white dark:bg-black text-zinc-900 dark:text-white pt-24 pb-20 overflow-hidden transition-colors duration-300" 
      ref={ref}
    >
      {/* Soft Ambient Background Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-[550px] h-[550px] rounded-full bg-emerald-500/10 dark:bg-emerald-950/20 blur-[140px]" />
        <div className="absolute bottom-10 -right-32 w-[550px] h-[550px] rounded-full bg-emerald-400/10 dark:bg-emerald-900/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Interactive Timeline</span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Work{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Explore my professional journey, career milestones, and engineering roles.
          </p>
        </motion.div>

        {/* Timeline Experience */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline center/left line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800 -translate-x-1/2" />

          {/* Timeline items */}
          <div className="space-y-10 sm:space-y-12">
            {data.map((exp, idx) => (
              <ExperienceCardItem
                key={exp.id || idx}
                exp={exp}
                idx={idx}
                sectionInView={isInView}
              />
            ))}
          </div>
        </div>

        {/* Experience Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {[
            { icon: HiOutlineBriefcase, label: 'Years Experience', value: '1+' },
            { icon: HiOutlineCode, label: 'Projects Delivered', value: '20+' },
            { icon: HiOutlineChartBar, label: 'Success Rate', value: '98%' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 p-6 rounded-xl text-center transition-colors duration-200 shadow-sm"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stat.value}</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold mt-1">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}