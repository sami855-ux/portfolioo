'use client';

import { About } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  FiUser, 
  FiTarget, 
  FiFileText, 
  FiSave, 
  FiArrowLeft,
  FiEdit3,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiClock,
  FiEye,
  FiSettings,
  FiHelpCircle,
  FiRefreshCw
} from 'react-icons/fi';

export default function AboutAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [about, setAbout] = useState<Partial<About>>({
    summary: '',
    careerGoals: '',
    bio: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [charCounts, setCharCounts] = useState({
    summary: 0,
    careerGoals: 0,
    bio: 0,
  });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  // React Query data fetching
  const { data: aboutData, refetch } = useQuery<About>({
    queryKey: ['about'],
    queryFn: async () => {
      const res = await fetch('/api/about');
      if (!res.ok) throw new Error('Failed to fetch about section');
      return res.json();
    },
    enabled: status === 'authenticated',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (aboutData && aboutData.summary) {
      setAbout(aboutData);
      setCharCounts({
        summary: aboutData.summary?.length || 0,
        careerGoals: aboutData.careerGoals?.length || 0,
        bio: aboutData.bio?.length || 0,
      });
      setLastSaved(new Date());
    }
  }, [aboutData]);

  // React Query mutation
  const saveAboutMutation = useMutation({
    mutationFn: async (updatedAboutData: Partial<About>) => {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAboutData),
      });
      if (!res.ok) throw new Error('Failed to save about section');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
      setSaveMessage({ type: 'success', text: 'About section updated successfully!' });
      setLastSaved(new Date());
      setTimeout(() => setSaveMessage(null), 3000);
    },
    onError: () => {
      setSaveMessage({ type: 'error', text: 'Error saving changes. Please try again.' });
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    saveAboutMutation.mutate(about);
  };

  const handleTextChange = (
    field: keyof typeof about,
    value: string
  ) => {
    setAbout({ ...about, [field]: value });
    setCharCounts({ ...charCounts, [field]: value.length });
  };

  const resetForm = () => {
    queryClient.invalidateQueries({ queryKey: ['about'] });
    setSaveMessage({ type: 'success', text: 'Form reset to last saved version' });
    setTimeout(() => setSaveMessage(null), 2000);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A] border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <FiEdit3 className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">About Section Manager</h1>
                <p className="text-gray-400 text-sm mt-1">Edit and manage your professional profile content</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetForm}
                className="p-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all"
                title="Reset to saved version"
              >
                <FiRefreshCw className="text-xl" />
              </button>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`p-3 rounded-xl transition-all ${
                  previewMode 
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
                title="Toggle preview mode"
              >
                <FiEye className="text-xl" />
              </button>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center gap-2 px-5 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-xl transition-all border border-gray-700/50"
              >
                <FiArrowLeft className="text-lg" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-6 bg-[#0F0F0F] rounded-xl p-4 border border-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-gray-400">{isSaving ? 'Saving...' : 'Connected'}</span>
            </div>
            {lastSaved && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiClock className="text-gray-600" />
                <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <FiHelpCircle className="text-gray-600" />
            <span className="text-sm text-gray-500">Need help?</span>
          </div>
        </div>

        {/* Notification Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-slideDown ${
            saveMessage.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {saveMessage.type === 'success' ? (
              <FiCheckCircle className="text-xl flex-shrink-0" />
            ) : (
              <FiAlertCircle className="text-xl flex-shrink-0" />
            )}
            <p>{saveMessage.text}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-[#0F0F0F] p-1 rounded-xl border border-gray-800/50 w-fit">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'edit' 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Edit Content
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'preview' 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Live Preview
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'settings' 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Settings
          </button>
        </div>

        {activeTab === 'edit' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Professional Summary Card */}
            <div className="bg-[#0F0F0F] rounded-xl border border-gray-800/50 overflow-hidden hover:border-gray-700/50 transition-all">
              <div className="border-b border-gray-800/50 px-6 py-4 bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-500/30">
                    <FiUser className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Professional Summary</h2>
                    <p className="text-gray-500 text-xs">Brief overview of your professional background</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="relative">
                  <textarea
                    required
                    rows={5}
                    value={about.summary}
                    onChange={(e) => handleTextChange('summary', e.target.value)}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
                    placeholder="Write a compelling professional summary..."
                    maxLength={500}
                  />
                  <div className="absolute bottom-3 right-3 text-xs">
                    <span className={`${charCounts.summary > 450 ? 'text-yellow-500' : 'text-gray-600'}`}>
                      {charCounts.summary}/500
                    </span>
                  </div>
                </div>
                {charCounts.summary > 450 && (
                  <p className="mt-2 text-xs text-yellow-500 flex items-center gap-1">
                    <FiInfo /> Approaching character limit
                  </p>
                )}
              </div>
            </div>

            {/* Career Goals Card */}
            <div className="bg-[#0F0F0F] rounded-xl border border-gray-800/50 overflow-hidden hover:border-gray-700/50 transition-all">
              <div className="border-b border-gray-800/50 px-6 py-4 bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-500/30">
                    <FiTarget className="text-purple-400 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Career Goals</h2>
                    <p className="text-gray-500 text-xs">Your professional aspirations and objectives</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="relative">
                  <textarea
                    required
                    rows={5}
                    value={about.careerGoals}
                    onChange={(e) => handleTextChange('careerGoals', e.target.value)}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
                    placeholder="Describe your career goals and aspirations..."
                    maxLength={500}
                  />
                  <div className="absolute bottom-3 right-3 text-xs">
                    <span className={`${charCounts.careerGoals > 450 ? 'text-yellow-500' : 'text-gray-600'}`}>
                      {charCounts.careerGoals}/500
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Card */}
            <div className="bg-[#0F0F0F] rounded-xl border border-gray-800/50 overflow-hidden hover:border-gray-700/50 transition-all">
              <div className="border-b border-gray-800/50 px-6 py-4 bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-lg border border-pink-500/30">
                    <FiFileText className="text-pink-400 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Biography</h2>
                    <p className="text-gray-500 text-xs">Detailed personal and professional background</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="relative">
                  <textarea
                    required
                    rows={6}
                    value={about.bio}
                    onChange={(e) => handleTextChange('bio', e.target.value)}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
                    placeholder="Write your detailed biography..."
                    maxLength={1000}
                  />
                  <div className="absolute bottom-3 right-3 text-xs">
                    <span className={`${charCounts.bio > 900 ? 'text-yellow-500' : 'text-gray-600'}`}>
                      {charCounts.bio}/1000
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push('/admin/dashboard')}
                className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-all border border-gray-700/50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all font-medium shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="text-lg" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'preview' && (
          <div className="bg-[#0F0F0F] rounded-xl border border-gray-800/50 p-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <FiEye className="text-indigo-400" />
              Live Preview
            </h3>
            <div className="space-y-6">
              <div className="border-l-2 border-blue-500/30 pl-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Professional Summary</h4>
                <p className="text-gray-300 leading-relaxed">{about.summary || 'Not set'}</p>
              </div>
              <div className="border-l-2 border-purple-500/30 pl-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Career Goals</h4>
                <p className="text-gray-300 leading-relaxed">{about.careerGoals || 'Not set'}</p>
              </div>
              <div className="border-l-2 border-pink-500/30 pl-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Biography</h4>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{about.bio || 'Not set'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-[#0F0F0F] rounded-xl border border-gray-800/50 p-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <FiSettings className="text-indigo-400" />
              Content Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Auto-save</h4>
                  <p className="text-sm text-gray-500">Automatically save changes as you type</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Word count warnings</h4>
                  <p className="text-sm text-gray-500">Show warnings when approaching limits</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}