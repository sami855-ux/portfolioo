'use client';

import { About as AboutType } from '@/types';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  HiOutlineBriefcase,
  HiOutlineChip,
  HiOutlineCode,
  HiOutlineLightBulb,
  HiOutlineUser
} from 'react-icons/hi';

export default function About({ data }: { data: AboutType }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const stats = [
    { label: 'Years Experience', value: '1+', icon: HiOutlineBriefcase },
    { label: 'Projects Completed', value: '15+', icon: HiOutlineCode },
    { label: 'Technologies', value: '10+', icon: HiOutlineChip },
  ];

  const cards = [
    {
      number: '01',
      title: 'Professional Summary',
      content: data.summary,
      icon: HiOutlineBriefcase,
      delay: 0.1,
    },
    {
      number: '02',
      title: 'Career Goals',
      content: data.careerGoals,
      icon: HiOutlineLightBulb,
      delay: 0.2,
    },
    {
      number: '03',
      title: 'Bio',
      content: data.bio,
      icon: HiOutlineUser,
      delay: 0.3,
    }
  ];

  return (
    <section 
      id="about" 
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
            <span>Get to Know Me</span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            About{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Passionate creator with a vision to build exceptional, scalable digital experiences.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: card.delay }}
                className="group relative"
              >
                <div className="relative bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 group-hover:border-emerald-500/50 p-7 rounded-xl h-full flex flex-col transition-all duration-200 shadow-sm">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:border-emerald-500/40 transition-colors duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-medium text-zinc-400 dark:text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                      {card.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                    {card.title}
                  </h3>

                  {/* Content */}
                  <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed flex-grow font-normal">
                    {card.content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Executive Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 p-6 rounded-xl text-center transition-colors duration-200 shadow-sm"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stat.value}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}