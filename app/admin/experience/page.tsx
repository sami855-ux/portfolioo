'use client';

import { Experience } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
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

export default function ExperienceAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [currentExp, setCurrentExp] = useState<Partial<Experience>>({
    role: '',
    company: '',
    duration: '',
    description: '',
    responsibilities: [],
    location: '',
    type: 'Full-time',
    technologies: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedExp, setSelectedExp] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newTechnology, setNewTechnology] = useState('');

  // React Query data fetching
  const { data: experiences = [], isLoading } = useQuery<Experience[]>({
    queryKey: ['experience'],
    queryFn: async () => {
      const res = await fetch('/api/experience');
      if (!res.ok) throw new Error('Failed to fetch experience data');
      return res.json();
    },
    enabled: status === 'authenticated',
  });

  // React Query mutations
  const saveExperienceMutation = useMutation({
    mutationFn: async (expData: Partial<Experience>) => {
      const method = expData.id ? 'PUT' : 'POST';
      const res = await fetch('/api/experience', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expData),
      });
      if (!res.ok) throw new Error('Failed to save experience');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      setIsEditing(false);
      setCurrentExp({ 
        role: '', 
        company: '', 
        duration: '', 
        description: '', 
        responsibilities: [],
        location: '',
        type: 'Full-time',
        technologies: []
      });
      showNotification('success', `Experience ${currentExp.id ? 'updated' : 'added'} successfully!`);
    },
    onError: () => {
      showNotification('error', 'Failed to save experience');
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/experience?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete experience');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      setDeleteConfirm(null);
      showNotification('success', 'Experience deleted successfully');
    },
    onError: () => {
      showNotification('error', 'Failed to delete experience');
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
    saveExperienceMutation.mutate(currentExp);
  };

  const handleDelete = (id: string) => {
    deleteExperienceMutation.mutate(id);
  };

  const handleBulkDelete = async () => {
    if (selectedExp.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedExp.length} items?`)) {
      try {
        await Promise.all(selectedExp.map(id => 
          fetch(`/api/experience?id=${id}`, { method: 'DELETE' })
        ));
        queryClient.invalidateQueries({ queryKey: ['experience'] });
        setSelectedExp([]);
        showNotification('success', `${selectedExp.length} items deleted successfully`);
      } catch (error) {
        showNotification('error', 'Failed to delete items');
      }
    }
  };

  const handleEdit = (exp: Experience) => {
    setCurrentExp(exp);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setCurrentExp({
        ...currentExp,
        responsibilities: [...(currentExp.responsibilities || []), newResponsibility.trim()]
      });
      setNewResponsibility('');
    }
  };

  const removeResponsibility = (index: number) => {
    setCurrentExp({
      ...currentExp,
      responsibilities: (currentExp.responsibilities || []).filter((_, i) => i !== index)
    });
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setCurrentExp({
        ...currentExp,
        technologies: [...(currentExp.technologies || []), newTechnology.trim()]
      });
      setNewTechnology('');
    }
  };

  const removeTechnology = (index: number) => {
    setCurrentExp({
      ...currentExp,
      technologies: (currentExp.technologies || []).filter((_, i) => i !== index)
    });
  };

  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCompany === 'all' || exp.company === filterCompany;
    return matchesSearch && matchesFilter;
  });

  const companies = [...new Set(experiences.map(exp => exp.company))];

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];

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
          <p className="text-gray-400 mt-6 text-lg">Loading experience data...</p>
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
                  <FiBriefcase className="text-indigo-400" />
                  Experience Management
                </h1>
                <p className="text-gray-400 text-sm mt-1">Manage your professional work history and achievements</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {selectedExp.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition border border-red-500/20"
                >
                  <FiTrash2 />
                  <span>Delete ({selectedExp.length})</span>
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
                    placeholder="Search experiences..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 focus:outline-none focus:border-indigo-500/50"
              >
                <option value="all">All Companies</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
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
              setCurrentExp({ 
                role: '', 
                company: '', 
                duration: '', 
                description: '', 
                responsibilities: [],
                location: '',
                type: 'Full-time',
                technologies: []
              });
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/25"
          >
            {isEditing ? <FiX className="text-lg" /> : <FiPlus className="text-lg" />}
            <span>{isEditing ? 'Cancel' : 'Add New Experience'}</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mb-8 bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A] rounded-xl border border-indigo-500/20 p-6 animate-slideDown">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FiEdit2 className="text-indigo-400" />
              {currentExp.id ? 'Edit Experience' : 'Add New Experience'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Role/Position</label>
                  <input
                    type="text"
                    required
                    value={currentExp.role}
                    onChange={(e) => setCurrentExp({ ...currentExp, role: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Company</label>
                  <input
                    type="text"
                    required
                    value={currentExp.company}
                    onChange={(e) => setCurrentExp({ ...currentExp, company: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                    placeholder="e.g., Google"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Duration</label>
                  <input
                    type="text"
                    required
                    value={currentExp.duration}
                    onChange={(e) => setCurrentExp({ ...currentExp, duration: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                    placeholder="e.g., Jan 2020 - Present"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Location</label>
                  <input
                    type="text"
                    value={currentExp.location || ''}
                    onChange={(e) => setCurrentExp({ ...currentExp, location: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Employment Type</label>
                  <select
                    value={currentExp.type || 'Full-time'}
                    onChange={(e) => setCurrentExp({ ...currentExp, type: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 focus:outline-none focus:border-indigo-500/50"
                  >
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  required
                  value={currentExp.description}
                  onChange={(e) => setCurrentExp({ ...currentExp, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                  rows={3}
                  placeholder="Brief overview of your role and achievements..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Responsibilities</label>
                <div className="space-y-2">
                  {(currentExp.responsibilities || []).map((resp, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1 text-gray-300 text-sm bg-[#1A1A1A] p-2 rounded-lg border border-gray-800">
                        • {resp}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeResponsibility(index)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newResponsibility}
                      onChange={(e) => setNewResponsibility(e.target.value)}
                      placeholder="Add a responsibility..."
                      className="flex-1 px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
                    />
                    <button
                      type="button"
                      onClick={addResponsibility}
                      className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Technologies Used</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {(currentExp.technologies || []).map((tech, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-sm border border-indigo-500/20">
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(index)}
                          className="hover:text-red-400"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      placeholder="Add a technology..."
                      className="flex-1 px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    />
                    <button
                      type="button"
                      onClick={addTechnology}
                      className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
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
                      <span>{currentExp.id ? 'Update' : 'Save'} Experience</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentExp({ 
                      role: '', 
                      company: '', 
                      duration: '', 
                      description: '', 
                      responsibilities: [],
                      location: '',
                      type: 'Full-time',
                      technologies: []
                    });
                  }}
                  className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Experience Grid/List */}
        {isLoading && !isEditing ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="text-center py-12 bg-[#0F0F0F] rounded-xl border border-gray-800/50">
            <FiBriefcase className="text-5xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No experience entries found</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((exp) => (
              <div
                key={exp.id}
                className={`group relative bg-[#0F0F0F] rounded-xl border transition-all hover:scale-[1.02] hover:shadow-lg ${
                  selectedExp.includes(exp.id!) 
                    ? 'border-indigo-500/50 bg-indigo-500/5' 
                    : 'border-gray-800/50 hover:border-gray-700/50'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                      <FiBriefcase className="text-2xl text-indigo-400" />
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedExp.includes(exp.id!)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedExp([...selectedExp, exp.id!]);
                        } else {
                          setSelectedExp(selectedExp.filter(id => id !== exp.id));
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500/50"
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-indigo-400 transition">
                    {exp.role}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-400 flex items-center gap-2 text-sm">
                      <FiBriefcase className="text-gray-600" />
                      {exp.company}
                    </p>
                    <p className="text-gray-400 flex items-center gap-2 text-sm">
                      <FiCalendar className="text-gray-600" />
                      {exp.duration}
                    </p>
                    {exp.location && (
                      <p className="text-gray-400 flex items-center gap-2 text-sm">
                        <FiMapPin className="text-gray-600" />
                        {exp.location}
                      </p>
                    )}
                    {exp.type && (
                      <p className="inline-block px-2 py-1 text-xs bg-indigo-500/10 text-indigo-400 rounded-full">
                        {exp.type}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className={`text-gray-500 text-sm ${expandedDesc !== exp.id ? 'line-clamp-2' : ''}`}>
                      {exp.description}
                    </p>
                    {exp.description.length > 100 && (
                      <button
                        onClick={() => setExpandedDesc(expandedDesc === exp.id ? null : exp.id!)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 flex items-center gap-1"
                      >
                        {expandedDesc === exp.id ? (
                          <>Show less <FiChevronUp /></>
                        ) : (
                          <>Read more <FiChevronDown /></>
                        )}
                      </button>
                    )}
                  </div>

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2">Technologies:</p>
                      <div className="flex flex-wrap gap-1">
                        {exp.technologies.slice(0, 3).map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                        {exp.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                            +{exp.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition text-sm"
                    >
                      <FiEdit2 />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(exp.id!)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition text-sm"
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === exp.id && (
                  <div className="absolute inset-0 bg-[#0F0F0F]/95 backdrop-blur-sm rounded-xl flex items-center justify-center p-6">
                    <div className="text-center">
                      <FiAlertCircle className="text-4xl text-red-400 mx-auto mb-3" />
                      <p className="text-white mb-4">Delete this experience?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(exp.id!)}
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
                      checked={selectedExp.length === filteredExperiences.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedExp(filteredExperiences.map(exp => exp.id!));
                        } else {
                          setSelectedExp([]);
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500/50"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Location</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredExperiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedExp.includes(exp.id!)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedExp([...selectedExp, exp.id!]);
                          } else {
                            setSelectedExp(selectedExp.filter(id => id !== exp.id));
                          }
                        }}
                        className="w-5 h-5 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500/50"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{exp.role}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{exp.company}</td>
                    <td className="px-6 py-4 text-gray-400">{exp.duration}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs bg-indigo-500/10 text-indigo-400 rounded-full">
                        {exp.type || 'Full-time'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{exp.location || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(exp)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(exp.id!)}
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
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Total Experiences:</span>
              <span className="text-white font-semibold">{experiences.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Selected:</span>
              <span className="text-indigo-400 font-semibold">{selectedExp.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Companies:</span>
              <span className="text-gray-300">{companies.length}</span>
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