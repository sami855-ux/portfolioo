'use client';

import { Project } from '@/types';
import { getValidImageUrl } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';
import {
  FaExternalLinkAlt,
  FaGithub,
  FaStar
} from 'react-icons/fa';
import { HiOutlineChip } from 'react-icons/hi';

const DEFAULT_PROJECT_IMAGE = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop';

export default function Projects({ data }: { data: Project[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [filter, setFilter] = useState('all');
  
  const categories = ['all', ...Array.from(new Set(data.map(p => p.category)))];
  
  const filteredProjects = filter === 'all' 
    ? data 
    : data.filter(p => p.category === filter);

  return (
    <section 
      id="projects" 
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
            <span>Featured Work</span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Featured{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Showcasing clean code, scalable architecture, and creative endeavors.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-14"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filter === cat
                  ? 'bg-emerald-500 text-black font-bold shadow-md'
                  : 'bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-emerald-500/40'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Clean 3-Column Minimalist Grid Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
              className="group relative"
            >
              <div className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 group-hover:border-emerald-500/60 rounded-2xl h-full flex flex-col overflow-hidden transition-all duration-300 shadow-md group-hover:shadow-glow-emerald">
                
                {/* Image Frame */}
                <div className="relative h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                  <Image
                    src={getValidImageUrl(project.image, DEFAULT_PROJECT_IMAGE)}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
                  
                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-emerald-500 text-black px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-md flex items-center gap-1">
                        <FaStar className="text-[10px]" /> Featured
                      </span>
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 text-[10px] font-semibold text-zinc-800 dark:text-zinc-300 backdrop-blur-sm shadow-sm">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                    {project.title}
                  </h3>
                  
                  <p className="text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed mb-4 line-clamp-3 flex-grow font-normal">
                    {project.description}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1"
                      >
                        <HiOutlineChip className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Clean Footer Links */}
                  <div className="flex items-center justify-between pt-3.5 border-t border-zinc-200 dark:border-zinc-800/80 mt-auto">
                    {project.githubLink ? (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-xs font-semibold"
                      >
                        <FaGithub className="text-sm" />
                        <span>Source Code</span>
                      </a>
                    ) : <div />}
                    
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-xs font-semibold"
                      >
                        <span>Live Demo</span>
                        <FaExternalLinkAlt className="text-[10px]" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}