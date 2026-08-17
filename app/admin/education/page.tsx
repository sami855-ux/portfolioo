'use client';

import { Education } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiEdit2,
  FiFilter,
  FiGrid,
  FiList,
  FiMapPin,
  FiPlus,
  FiSave,
  FiSearch,
  FiTrash2,
  FiX
} from 'react-icons/fi';

export default function EducationAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [currentEdu, setCurrentEdu] = useState<Partial<Education>>({
    institution: '',
    degree: '',
    year: '',
    description: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedEdu, setSelectedEdu] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // React Query data fetching
  const { data: education = [], isLoading } = useQuery<Education[]>({
    queryKey: ['education'],
    queryFn: async () => {
      const res = await fetch('/api/education');
      if (!res.ok) throw new Error('Failed to fetch education data');
      return res.json();
    },
    enabled: status === 'authenticated',
  });

  // React Query mutations
  const saveEducationMutation = useMutation({
    mutationFn: async (eduData: Partial<Education>) => {
      const method = eduData.id ? 'PUT' : 'POST';
      const res = await fetch('/api/education', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eduData),
      });
      if (!res.ok) throw new Error('Failed to save education');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      setIsEditing(false);
      setCurrentEdu({ institution: '', degree: '', year: '', description: '' });
      showNotification('success', `Education ${currentEdu.id ? 'updated' : 'added'} successfully!`);
    },
    onError: () => {
      showNotification('error', 'Failed to save education');
    },
  });

  const deleteEducationMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/education?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete education');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      setDeleteConfirm(null);
      showNotification('success', 'Education deleted successfully');
    },
    onError: () => {
      showNotification('error', 'Failed to delete education');
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveEducationMutation.mutate(currentEdu);
  };

  const handleDelete = (id: string) => {
    deleteEducationMutation.mutate(id);
  };

  const handleBulkDelete = async () => {
    if (selectedEdu.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedEdu.length} items?`)) {
      try {
        await Promise.all(selectedEdu.map(id => 
          fetch(`/api/education?id=${id}`, { method: 'DELETE' })
        ));
        queryClient.invalidateQueries({ queryKey: ['education'] });
        setSelectedEdu([]);
        showNotification('success', `${selectedEdu.length} items deleted successfully`);
      } catch (error) {
        showNotification('error', 'Failed to delete items');
      }
    }
  };

  const handleEdit = (edu: Education) => {
    setCurrentEdu(edu);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredEducation = education.filter(edu => {
    const matchesSearch = edu.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         edu.degree.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterYear === 'all' || edu.year.includes(filterYear);
    return matchesSearch && matchesFilter;
  });

  const years = [...new Set(education.map(edu => edu.year.split(' - ')[0] || edu.year))];

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
          <p className="text-gray-400 mt-6 text-lg">Loading education data...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A] border-b border-gray-800/50 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition"
              >
                <FiArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <FiBookOpen className="text-indigo-400" />
                  Education Management
                </h1>
                <p className="text-gray-400 text-sm mt-1">Manage your academic qualifications and certifications</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {selectedEdu.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition border border-red-500/20"
                >
                  <FiTrash2 />
                  <span>Delete ({selectedEdu.length})</span>
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-xl transition ${
                  showFilters 
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FiFilter className="text-xl" />
              </button>
              <div className="flex gap-1 bg-[#1A1A1A] p-1 rounded-xl border border-gray-800/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'grid' 
                      ? 'bg-indigo-500/20 text-indigo-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'list' 
                      ? 'bg-indigo-500/20 text-indigo-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-slideDown ${
            notification.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {notification.type === 'success' ? (
              <FiCheckCircle className="text-xl flex-shrink-0" />
            ) : (
              <FiAlertCircle className="text-xl flex-shrink-0" />
            )}
            <p>{notification.message}</p>
          </div>
        )}

        {/* Filters Bar */}
        {showFilters && (
          <div className="mb-6 p-4 bg-[#0F0F0F] rounded-xl border border-gray-800/50 animate-slideDown">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search education..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 focus:outline-none focus:border-indigo-500/50"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Add New Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setCurrentEdu({ institution: '', degree: '', year: '', description: '' });
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/25"
          >
            {isEditing ? <FiX className="text-lg" /> : <FiPlus className="text-lg" />}
            <span>{isEditing ? 'Cancel' : 'Add New Education'}</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mb-8 bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A] rounded-xl border border-indigo-500/20 p-6 animate-slideDown">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FiEdit2 className="text-indigo-400" />
              {currentEdu.id ? 'Edit Education' : 'Add New Education'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Institution</label>
                  <input
                    type="text"
                    required
                    value={currentEdu.institution}
                    onChange={(e) => setCurrentEdu({ ...currentEdu, institution: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                    placeholder="e.g., Stanford University"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Degree</label>
                  <input
                    type="text"
                    required
                    value={currentEdu.degree}
                    onChange={(e) => setCurrentEdu({ ...currentEdu, degree: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                    placeholder="e.g., Bachelor of Science"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Year</label>
                  <input
                    type="text"
                    required
                    value={currentEdu.year}
                    onChange={(e) => setCurrentEdu({ ...currentEdu, year: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                    placeholder="e.g., 2020 - 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Location (Optional)</label>
                  <input
                    type="text"
                    value={currentEdu.location || ''}
                    onChange={(e) => setCurrentEdu({ ...currentEdu, location: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                    placeholder="e.g., California, USA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  required
                  value={currentEdu.description}
                  onChange={(e) => setCurrentEdu({ ...currentEdu, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                  rows={4}
                  placeholder="Describe your studies, achievements, and key learnings..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition font-medium disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiSave />
                      <span>{currentEdu.id ? 'Update' : 'Save'} Education</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentEdu({ institution: '', degree: '', year: '', description: '' });
                  }}
                  className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Education Grid/List */}
        {isLoading && !isEditing ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredEducation.length === 0 ? (
          <div className="text-center py-12 bg-[#0F0F0F] rounded-xl border border-gray-800/50">
            <FiBookOpen className="text-5xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No education entries found</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEducation.map((edu) => (
              <div
                key={edu.id}
                className={`group relative bg-[#0F0F0F] rounded-xl border transition-all hover:scale-[1.02] hover:shadow-lg ${
                  selectedEdu.includes(edu.id!) 
                    ? 'border-indigo-500/50 bg-indigo-500/5' 
                    : 'border-gray-800/50 hover:border-gray-700/50'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                      <FiBookOpen className="text-2xl text-indigo-400" />
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedEdu.includes(edu.id!)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEdu([...selectedEdu, edu.id!]);
                        } else {
                          setSelectedEdu(selectedEdu.filter(id => id !== edu.id));
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500/50"
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition">
                    {edu.degree}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-400 flex items-center gap-2 text-sm">
                      <FiMapPin className="text-gray-600" />
                      {edu.institution}
                    </p>
                    <p className="text-gray-400 flex items-center gap-2 text-sm">
                      <FiCalendar className="text-gray-600" />
                      {edu.year}
                    </p>
                    {edu.location && (
                      <p className="text-gray-400 flex items-center gap-2 text-sm">
                        <FiMapPin className="text-gray-600" />
                        {edu.location}
                      </p>
                    )}
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{edu.description}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(edu)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition text-sm"
                    >
                      <FiEdit2 />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(edu.id!)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition text-sm"
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === edu.id && (
                  <div className="absolute inset-0 bg-[#0F0F0F]/95 backdrop-blur-sm rounded-xl flex items-center justify-center p-6">
                    <div className="text-center">
                      <FiAlertCircle className="text-4xl text-red-400 mx-auto mb-3" />
                      <p className="text-white mb-4">Delete this education?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(edu.id!)}
                          className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#0F0F0F] rounded-xl border border-gray-800/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#1A1A1A] border-b border-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedEdu.length === filteredEducation.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEdu(filteredEducation.map(edu => edu.id!));
                        } else {
                          setSelectedEdu([]);
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500/50"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Degree</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Institution</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Year</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Location</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredEducation.map((edu) => (
                  <tr key={edu.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEdu.includes(edu.id!)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEdu([...selectedEdu, edu.id!]);
                          } else {
                            setSelectedEdu(selectedEdu.filter(id => id !== edu.id));
                          }
                        }}
                        className="w-5 h-5 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500/50"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{edu.degree}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{edu.institution}</td>
                    <td className="px-6 py-4 text-gray-400">{edu.year}</td>
                    <td className="px-6 py-4 text-gray-400">{edu.location || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(edu)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(edu.id!)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 p-4 bg-[#0F0F0F] rounded-xl border border-gray-800/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Total Entries:</span>
              <span className="text-white font-semibold">{education.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Selected:</span>
              <span className="text-indigo-400 font-semibold">{selectedEdu.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Latest Update:</span>
              <span className="text-gray-300">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}