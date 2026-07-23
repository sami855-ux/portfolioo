'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  FiHome, 
  FiUser, 
  FiCode, 
  FiFolder, 
  FiBriefcase, 
  FiBookOpen,
  FiLogOut,
  FiEye,
  FiSettings,
  FiBell,
  FiSearch,
  FiMenu,
  FiX,
  FiChevronRight,
  FiActivity,
  FiClock,
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiPieChart,
  FiAlertTriangle
} from 'react-icons/fi';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: '/admin/login' });
  };
  const [stats, setStats] = useState({
    totalProjects: 12,
    totalSkills: 24,
    totalExperience: 5,
    totalVisitors: 1234
  });
  const [recentActivity, setRecentActivity] = useState([
    { action: 'Updated Hero Section', time: '2 hours ago', status: 'success' },
    { action: 'Added new project', time: '5 hours ago', status: 'success' },
    { action: 'Modified Skills', time: '1 day ago', status: 'pending' },
  ]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-400 mt-6 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const sections = [
    { 
      name: 'Hero Section', 
      href: '/admin/hero', 
      description: 'Edit hero content and profile',
      icon: FiHome,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      hoverBorder: 'hover:border-blue-500/50',
      iconColor: 'text-blue-400'
    },
    { 
      name: 'About Section', 
      href: '/admin/about', 
      description: 'Update about information',
      icon: FiUser,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      hoverBorder: 'hover:border-purple-500/50',
      iconColor: 'text-purple-400'
    },
    { 
      name: 'Skills', 
      href: '/admin/skills', 
      description: 'Manage skills and proficiency',
      icon: FiCode,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      hoverBorder: 'hover:border-green-500/50',
      iconColor: 'text-green-400'
    },
    { 
      name: 'Projects', 
      href: '/admin/projects', 
      description: 'Add, edit, or delete projects',
      icon: FiFolder,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
      hoverBorder: 'hover:border-pink-500/50',
      iconColor: 'text-pink-400'
    },
    { 
      name: 'Experience', 
      href: '/admin/experience', 
      description: 'Manage work experience',
      icon: FiBriefcase,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      hoverBorder: 'hover:border-yellow-500/50',
      iconColor: 'text-yellow-400'
    },
    { 
      name: 'Education', 
      href: '/admin/education', 
      description: 'Update education details',
      icon: FiBookOpen,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      hoverBorder: 'hover:border-red-500/50',
      iconColor: 'text-red-400'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-[#0F0F0F] border-r border-gray-800/50 transform transition-transform duration-300 z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div>
                  <h2 className="text-white font-semibold">Admin Panel</h2>
                  <p className="text-xs text-gray-500">v2.0.0</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <FiX className="text-xl" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                {session.user?.email?.[0].toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium">{session.user?.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">Main Menu</p>
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <Link
                    key={section.name}
                    href={section.href}
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`text-lg ${section.iconColor}`} />
                    <span className="flex-1 text-sm">{section.name}</span>
                    <FiChevronRight className="text-xs opacity-0 group-hover:opacity-100 transition" />
                  </Link>
                );
              })}
            </nav>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-8 px-4">System</p>
            <nav className="space-y-1">
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <FiSettings className="text-lg" />
                <span className="flex-1 text-sm">Settings</span>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <FiEye className="text-lg" />
                <span className="flex-1 text-sm">View Site</span>
              </Link>
            </nav>
          </div>

          {/* Logout Button */}
          <div className="p-6 border-t border-gray-800/50">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <FiLogOut className="text-lg" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-80 min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-[#0F0F0F]/80 backdrop-blur-xl border-b border-gray-800/50">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <FiMenu className="text-2xl" />
              </button>
              
              {/* Search Bar */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] rounded-xl border border-gray-800/50">
                <FiSearch className="text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-sm text-gray-300 placeholder-gray-600 w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition">
                <FiBell className="text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition">
                <FiSettings className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {session.user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-400">Here's what's happening with your portfolio today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#0F0F0F] p-6 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <FiFolder className="text-blue-400 text-xl" />
                </div>
                <span className="text-xs text-gray-500">+12%</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stats.totalProjects}</h3>
              <p className="text-sm text-gray-500">Total Projects</p>
            </div>

            <div className="bg-[#0F0F0F] p-6 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <FiCode className="text-purple-400 text-xl" />
                </div>
                <span className="text-xs text-gray-500">+8%</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stats.totalSkills}</h3>
              <p className="text-sm text-gray-500">Skills</p>
            </div>

            <div className="bg-[#0F0F0F] p-6 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <FiBriefcase className="text-green-400 text-xl" />
                </div>
                <span className="text-xs text-gray-500">+5%</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stats.totalExperience}</h3>
              <p className="text-sm text-gray-500">Years Experience</p>
            </div>

            <div className="bg-[#0F0F0F] p-6 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pink-500/10 rounded-lg">
                  <FiUsers className="text-pink-400 text-xl" />
                </div>
                <span className="text-xs text-gray-500">+23%</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stats.totalVisitors}</h3>
              <p className="text-sm text-gray-500">Visitors</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Section Cards */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Link
                      key={section.name}
                      href={section.href}
                      className={`group relative bg-[#0F0F0F] p-6 rounded-xl border ${section.borderColor} ${section.hoverBorder} transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-${section.color.split(' ')[0]}/5`}
                    >
                      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${section.color} opacity-5 rounded-bl-full`} />
                      
                      <div className={`w-12 h-12 ${section.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className={`text-2xl ${section.iconColor}`} />
                      </div>
                      
                      <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition">
                        {section.name}
                      </h2>
                      <p className="text-sm text-gray-500">{section.description}</p>
                      
                      <div className="mt-4 flex items-center text-xs text-gray-600">
                        <FiClock className="mr-1" />
                        <span>Last updated 2 days ago</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Sidebar - Activity Feed */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-[#0F0F0F] p-6 rounded-xl border border-gray-800/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FiActivity className="text-indigo-400" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 mt-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-[#0F0F0F] p-6 rounded-xl border border-gray-800/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FiPieChart className="text-indigo-400" />
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Profile Completion</span>
                      <span className="text-white">85%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Content Updated</span>
                      <span className="text-white">67%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-[67%] bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-xl border border-indigo-500/20">
                <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
                <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition text-sm mb-2">
                  Add New Project
                </button>
                <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition text-sm">
                  Update Skills
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Alert Dialog Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="text-2xl text-red-500" />
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                Confirm Sign Out
              </h3>
              
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Are you sure you want to end your current session? You will need to sign in again to access admin tools.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="flex-1 py-3 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  disabled={isLoggingOut}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing Out...</span>
                    </>
                  ) : (
                    <>
                      <FiLogOut className="text-sm" />
                      <span>Sign Out</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}