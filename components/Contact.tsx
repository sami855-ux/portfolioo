'use client';

import { ContactInfo } from '@/types';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  FaCheckCircle,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
  FaRedo
} from 'react-icons/fa';
import { HiOutlineClock, HiOutlineSparkles } from 'react-icons/hi';

export default function Contact({ data }: { data?: ContactInfo }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const contactEmail = data?.email || 'yenesh2022@gmail.com';
  const contactLocation = data?.location || 'Worldwide / Remote';
  const contactPhone = data?.phone;
  const githubUrl = data?.githubUrl || 'https://github.com';
  const linkedinUrl = data?.linkedinUrl || 'https://linkedin.com';

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submittedData, setSubmittedData] = useState<{ name: string; email: string; subject: string } | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setSubmittedData({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'General Inquiry',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Failed to send message.');
        setStatus('error');
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again later.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setSubmittedData(null);
  };

  return (
    <section
      id="contact"
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Get in Touch</span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Let's Work{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              Together
            </span>
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Have a project in mind, a question, or just want to connect? Send me a message below.
          </p>
        </motion.div>

        {/* 2-Column Split Showcase Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Details & Live Availability */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-5"
          >
            {/* Live Availability Status Card */}
            <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Current Availability
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                Open for New Opportunities
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Available for full-time engineering roles, freelance software contracts, and technical consulting.
              </p>
            </div>

            {/* Email Card */}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="group bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 p-5 rounded-2xl flex items-center gap-4 transition-all duration-200 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:border-emerald-500/40 transition-colors">
                  <FaEnvelope className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                    Email Address
                  </span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white truncate block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {contactEmail}
                  </span>
                </div>
              </a>
            )}

            {/* Location Card */}
            {contactLocation && (
              <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                    Location
                  </span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white block">
                    {contactLocation}
                  </span>
                </div>
              </div>
            )}

            {/* Phone Card */}
            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                className="group bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 p-5 rounded-2xl flex items-center gap-4 transition-all duration-200 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:border-emerald-500/40 transition-colors">
                  <FaPhoneAlt className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                    Phone
                  </span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white truncate block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {contactPhone}
                  </span>
                </div>
              </a>
            )}

            {/* Response Time Guarantee Pill */}
            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 p-4 rounded-xl flex items-center gap-3 shadow-sm">
              <HiOutlineClock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">
                Fast Response Guarantee: Expect a reply within 24 hours.
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-white hover:border-emerald-500/50 flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm"
                >
                  <FaGithub className="text-base" />
                  <span>GitHub</span>
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-white hover:border-emerald-500/50 flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm"
                >
                  <FaLinkedin className="text-base text-emerald-600 dark:text-emerald-400" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>

          </motion.div>

          {/* Right Column: Message Panel & Dynamic Views */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-7"
          >
            <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-7 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  /* Success Confirmation View */
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-md">
                      <FaCheckCircle className="w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                      Message Sent Successfully!
                    </h3>

                    <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-md mb-8 leading-relaxed font-normal">
                      Thank you for reaching out. Your message has been received, and I will get back to you as soon as possible.
                    </p>

                    {/* Receipt Details Card */}
                    {submittedData && (
                      <div className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-8 text-left text-xs space-y-2">
                        <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                          <span className="text-zinc-400 font-medium">Sender:</span>
                          <span className="text-zinc-900 dark:text-white font-bold">{submittedData.name} ({submittedData.email})</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-zinc-400 font-medium">Subject:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{submittedData.subject}</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleReset}
                      className="px-6 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 text-zinc-800 dark:text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <FaRedo className="text-xs text-emerald-600 dark:text-emerald-400" />
                      <span>Send Another Message</span>
                    </button>
                  </motion.div>
                ) : (
                  /* Interactive Form View */
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="mb-2">
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                        Send a Message
                      </h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                          Your Name <span className="text-emerald-600 dark:text-emerald-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                          Your Email <span className="text-emerald-600 dark:text-emerald-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Project Collaboration / Inquiry"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                        Message <span className="text-emerald-600 dark:text-emerald-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell me about your project or inquiry..."
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                      />
                    </div>

                    {/* Error Alert */}
                    {status === 'error' && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold">
                        {errorMessage}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-emerald-500/20 disabled:opacity-50"
                    >
                      {status === 'submitting' ? (
                        <span>Sending Message...</span>
                      ) : (
                        <>
                          <FaPaperPlane className="text-xs" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}