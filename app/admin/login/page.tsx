'use client';

import { useTheme } from '@/app/providers';
import { AnimatePresence, motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FaArrowRight,
  FaCheckCircle,
  FaEnvelope,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
} from 'react-icons/fa';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setCredentials((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setErrorMessage('Please enter both email and password.');
      setStatus('error');
      return;
    }

    setErrorMessage('');
    setStatus('submitting');

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage('Invalid email or password. Please try again.');
        setStatus('error');
      } else {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', credentials.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        setStatus('success');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1000);
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred.');
      setStatus('error');
    }
  };

  const handleDemoFill = () => {
    setCredentials({
      email: 'yeneshdabot2022@gmail.com',
      password: 'admin123',
    });
    setErrorMessage('');
    setStatus('idle');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white dark:bg-black text-zinc-900 dark:text-white px-4 py-12 overflow-hidden transition-colors duration-300">
      
      {/* Soft Ambient Background Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[550px] h-[550px] rounded-full bg-emerald-500/10 dark:bg-emerald-950/20 blur-[140px]" />
        <div className="absolute bottom-10 -right-32 w-[550px] h-[550px] rounded-full bg-emerald-400/10 dark:bg-emerald-900/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
      </div>

      {/* Top Floating Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center transition-colors shadow-sm"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <HiOutlineSun className="w-5 h-5 text-amber-400" />
          ) : (
            <HiOutlineMoon className="w-5 h-5 text-emerald-600" />
          )}
        </button>
      </div>

      {/* Main Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20 mb-4">
            <FaShieldAlt className="text-2xl" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Admin Portal
          </h1>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Sign in to manage your portfolio content and settings
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl transition-all">
          
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              /* Success State Screen */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                  Access Granted
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold mb-4">
                  Redirecting to Admin Dashboard...
                </p>
                <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
              </motion.div>
            ) : (
              /* Form View */
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <FaEnvelope className="text-sm" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      value={credentials.email}
                      onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="yenesh2022@gmail.com"
                      disabled={status === 'submitting'}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <FaLock className="text-sm" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      required
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="••••••••"
                      disabled={status === 'submitting'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Option */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">
                      Remember me
                    </span>
                  </label>
                </div>

                {/* Error Banner */}
                {status === 'error' && errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2.5"
                  >
                    <FaExclamationTriangle className="text-sm shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Sign In</span>
                      <FaArrowRight className="text-xs" />
                    </div>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

        </div>

        {/* Security Footer */}
        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
            <FaShieldAlt className="text-emerald-600 dark:text-emerald-400 text-xs" />
            <span>Encrypted Session Protection</span>
          </span>
        </div>
      </motion.div>

    </div>
  );
}