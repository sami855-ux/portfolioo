'use client';

import { Skill } from '@/types';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  FaCode,
  FaDatabase,
  FaDocker,
  FaGitAlt,
  FaNodeJs,
  FaPython,
  FaReact,
  FaServer,
  FaTerminal
} from 'react-icons/fa';
import {
  HiOutlineCheckCircle,
  HiOutlineChip,
  HiOutlineCode,
  HiOutlineCog,
  HiOutlineServer
} from 'react-icons/hi';
import {
  SiExpress,
  SiNextdotjs,
  SiPostgresql,
  SiPrisma,
  SiTailwindcss,
  SiTensorflow,
  SiTypescript
} from 'react-icons/si';

export default function Skills({ data }: { data: Skill[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeTab, setActiveTab] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Skills', icon: FaCode },
    { id: 'Frontend', name: 'Frontend', icon: HiOutlineCode },
    { id: 'Backend', name: 'Backend', icon: HiOutlineServer },
    { id: 'Machine Learning', name: 'AI & Data', icon: HiOutlineChip },
    { id: 'Tools', name: 'Tools & DevOps', icon: HiOutlineCog },
  ];

  const getSkillIcon = (skillName: string) => {
    const name = skillName.toLowerCase();
    if (name.includes('react')) return FaReact;
    if (name.includes('next')) return SiNextdotjs;
    if (name.includes('typescript') || name.includes('ts')) return SiTypescript;
    if (name.includes('tailwind') || name.includes('css')) return SiTailwindcss;
    if (name.includes('node')) return FaNodeJs;
    if (name.includes('express')) return SiExpress;
    if (name.includes('postgres') || name.includes('sql')) return SiPostgresql;
    if (name.includes('prisma')) return SiPrisma;
    if (name.includes('tensorflow') || name.includes('tensor')) return SiTensorflow;
    if (name.includes('python')) return FaPython;
    if (name.includes('git')) return FaGitAlt;
    if (name.includes('docker')) return FaDocker;
    return FaTerminal;
  };

  const getSkillBadge = (category: string) => {
    switch (category) {
      case 'Frontend': return 'UI / Client-Side';
      case 'Backend': return 'Server & API';
      case 'Machine Learning': return 'AI Model / Data';
      case 'Tools': return 'Workflow & DevOps';
      default: return 'Production Ready';
    }
  };

  const filteredSkills = activeTab === 'all' 
    ? data 
    : data.filter(skill => skill.category === activeTab);

  return (
    <section 
      id="skills" 
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
          className="text-center mb-12"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Technical Capabilities</span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Skills &{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              Technologies
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Core technologies, frameworks, and tools I utilize to craft modern software.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-500 text-black font-bold shadow-md'
                    : 'bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-emerald-500/40'
                }`}
              >
                <TabIcon className="text-sm" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Skills Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill, idx) => {
            const SkillIcon = getSkillIcon(skill.name);
            const badgeText = getSkillBadge(skill.category);

            return (
              <motion.div
                key={skill.id || skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.05 }}
                className="group relative"
              >
                <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 p-5 rounded-xl flex items-center gap-4 transition-colors duration-200 shadow-sm">
                  {/* Brand Icon Box */}
                  <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:border-emerald-500/40 transition-colors duration-200">
                    <SkillIcon className="w-6 h-6" />
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-zinc-900 dark:text-white text-base truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                        {skill.name}
                      </h3>
                      <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">
                      {badgeText}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Capabilities Summary Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-xl flex items-start gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
              <FaCode className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Frontend Excellence</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Building responsive, accessible, component-driven user interfaces.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-xl flex items-start gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
              <FaServer className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Backend Architecture</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Designing REST APIs, microservices, and serverless backends.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-xl flex items-start gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
              <FaDatabase className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Database & DevOps</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Managing relational databases, ORMs, and containerized deployments.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}