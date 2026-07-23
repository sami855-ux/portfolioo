'use client';

import { Education as EducationType } from '@/types';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineLocationMarker,
  HiOutlineSparkles,
} from 'react-icons/hi';

export default function Education({ data }: { data: EducationType[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section 
      id="education" 
      className="relative min-h-screen flex items-center justify-center bg-white dark:bg-black text-zinc-900 dark:text-white pt-24 pb-20 overflow-hidden transition-colors duration-300" 
      ref={ref}
    >
      {/* Soft Ambient Background Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-[550px] h-[550px] rounded-full bg-emerald-500/10 dark:bg-emerald-950/20 blur-[140px]" />
        <div className="absolute bottom-10 -right-32 w-[550px] h-[550px] rounded-full bg-emerald-400/10 dark:bg-emerald-900/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-5xl">
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
            <span>Academic Background</span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Education &{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              Credentials
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Academic foundations and engineering degrees that shaped my career.
          </p>
        </motion.div>

        {/* Education Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {data.map((edu, index) => (
            <motion.div
              key={edu.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="group relative"
            >
              <div className="relative bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 group-hover:border-emerald-500/50 p-6 sm:p-7 rounded-2xl h-full flex flex-col justify-between transition-all duration-200 shadow-sm">
                <div>
                  {/* Icon & Duration Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:border-emerald-500/40 transition-colors duration-200 shadow-inner">
                      <HiOutlineAcademicCap className="w-6 h-6" />
                    </div>
                    {edu.year && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <HiOutlineCalendar className="w-3.5 h-3.5" />
                        {edu.year}
                      </span>
                    )}
                  </div>

                  {/* Degree Title */}
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                    {edu.degree}
                  </h3>

                  {/* Institution */}
                  <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    {edu.institution}
                  </h4>

                  {/* Location */}
                  {edu.location && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                      <HiOutlineLocationMarker className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{edu.location}</span>
                    </div>
                  )}

                  {/* Description */}
                  {edu.description && (
                    <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed mt-3 font-normal pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}