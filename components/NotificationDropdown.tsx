'use client';

import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  FiBell,
  FiCheck,
  FiMail,
  FiMessageSquare,
  FiTrash2,
  FiX
} from 'react-icons/fi';

interface NotificationItem {
  id: string;
  title: string;
  email: string;
  message: string;
  createdAt: string;
  type: string;
}

interface NotificationsResponse {
  success: boolean;
  notifications: NotificationItem[];
  unreadCount: number;
}

async function fetchNotifications(): Promise<NotificationsResponse> {
  const res = await fetch('/api/admin/notifications');
  if (!res.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return res.json();
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // React Query with 10-second polling for real-time notification updates
  const { data, isLoading } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 10000,
  });

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
  };

  const toggleRead = (id: string) => {
    if (readIds.includes(id)) {
      setReadIds(readIds.filter((item) => item !== id));
    } else {
      setReadIds([...readIds, id]);
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-800 focus:outline-none"
        aria-label="Notifications"
      >
        <FiBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-emerald-500 text-black text-[10px] font-extrabold rounded-full animate-pulse shadow-lg shadow-emerald-500/30">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#121212] border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-[#181818]/60">
              <div className="flex items-center gap-2">
                <FiMessageSquare className="text-emerald-400 text-lg" />
                <h3 className="font-bold text-sm text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                    title="Mark all as read"
                  >
                    <FiCheck className="text-xs" />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <FiX className="text-sm" />
                </button>
              </div>
            </div>

            {/* Notification Items List */}
            <div className="max-h-96 overflow-y-auto divide-y divide-zinc-800/50">
              {isLoading ? (
                <div className="py-8 text-center">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-zinc-500">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-10 text-center text-zinc-500">
                  <FiBell className="text-3xl mx-auto mb-2 opacity-40 text-zinc-600" />
                  <p className="text-xs font-medium text-zinc-400">No notifications yet</p>
                  <p className="text-[11px] text-zinc-600 mt-1">Contact form messages will appear here.</p>
                </div>
              ) : (
                notifications.map((item) => {
                  const isRead = readIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleRead(item.id)}
                      className={`p-4 transition-all duration-200 cursor-pointer hover:bg-zinc-800/50 flex gap-3.5 items-start ${
                        isRead ? 'opacity-60 bg-transparent' : 'bg-emerald-500/5'
                      }`}
                    >
                      <div className={`mt-0.5 p-2 rounded-xl border ${
                        isRead
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-500'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}>
                        <FiMail className="text-sm" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-xs font-bold truncate ${isRead ? 'text-zinc-400' : 'text-white'}`}>
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-zinc-500 whitespace-nowrap ml-2">
                            {formatTime(item.createdAt)}
                          </span>
                        </div>

                        <p className="text-[11px] text-emerald-400/90 font-medium truncate mb-1">
                          {item.email}
                        </p>

                        <p className="text-xs text-zinc-300 leading-snug line-clamp-2">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-[#181818]/60 border-t border-zinc-800 text-center">
              <a
                href="/admin/dashboard"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View all messages & analytics →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
