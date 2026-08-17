'use client';

import { Skill } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiAward,
  FiBarChart2,
  FiCheckCircle,
  FiCode,
  FiCpu,
  FiDatabase,
  FiEdit2,
  FiFilter,
  FiGrid,
  FiLayers,
  FiList,
  FiPlus,
  FiSave,
  FiSearch,
  FiStar,
  FiTool,
  FiTrash2,
  FiTrendingUp,
  FiX
} from 'react-icons/fi';

export default function SkillsAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill>>({
    name: '',
    category: 'Frontend',
    proficiency: 50,
    icon: '',
    description: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'proficiency' | 'category'>('category');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const categories = ['Frontend', 'Backend', 'Machine Learning', 'Tools', 'Database', 'Cloud', 'Mobile', 'Design'];
  
  const categoryIcons: Record<string, React.ReactNode> = {
    'Frontend': <FiCode />,
    'Backend': <FiDatabase />,
    'Machine Learning': <FiCpu />,
    'Tools': <FiTool />,
    'Database': <FiDatabase />,
    'Cloud': <FiTrendingUp />,
    'Mobile': <FiLayers />,
    'Design': <FiAward />
  };
  
  // React Query data fetching
  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: async () => {
      const res = await fetch('/api/skills');
      if (!res.ok) throw new Error('Failed to fetch skills');
      return res.json();
    },
    enabled: status === 'authenticated',
  });

  // React Query mutations
  const saveSkillMutation = useMutation({
    mutationFn: async (skillData: Partial<Skill>) => {
      const method = skillData.id ? 'PUT' : 'POST';
      const res = await fetch('/api/skills', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillData),
      });
      if (!res.ok) throw new Error('Failed to save skill');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsEditing(false);
      setCurrentSkill({ name: '', category: 'Frontend', proficiency: 50, icon: '', description: '' });
      showNotification('success', `Skill ${currentSkill.id ? 'updated' : 'added'} successfully!`);
    },
    onError: () => {
      showNotification('error', 'Failed to save skill');
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/skills?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete skill');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setDeleteConfirm(null);
      showNotification('success', 'Skill deleted successfully');
    },
    onError: () => {
      showNotification('error', 'Failed to delete skill');
    },
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSkillMutation.mutate(currentSkill);
  };

  const handleDelete = (id: string) => {
    deleteSkillMutation.mutate(id);
  };

  const handleBulkDelete = async () => {
    if (selectedSkills.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedSkills.length} skills?`)) {
      try {
        await Promise.all(selectedSkills.map(id => 
          fetch(`/api/skills?id=${id}`, { method: 'DELETE' })
        ));
        queryClient.invalidateQueries({ queryKey: ['skills'] });
        setSelectedSkills([]);
        showNotification('success', `${selectedSkills.length} skills deleted successfully`);
      } catch (error) {
        showNotification('error', 'Failed to delete skills');
      }
    }
  };

  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 80) return 'text-green-400';
    if (proficiency >= 60) return 'text-blue-400';
    if (proficiency >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProficiencyBgColor = (proficiency: number) => {
    if (proficiency >= 80) return 'bg-green-500';
    if (proficiency >= 60) return 'bg-blue-500';
    if (proficiency >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredSkills = skills
    .filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           skill.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || skill.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'proficiency') {
        return sortOrder === 'asc' 
          ? a.proficiency - b.proficiency
          : b.proficiency - a.proficiency;
      } else {
        return sortOrder === 'asc'
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      }
    });

  const categoryStats = categories.reduce((acc, category) => {
    acc[category] = skills.filter(s => s.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  const averageProficiency = skills.reduce((acc, s) => acc + s.proficiency, 0) / (skills.length || 1);

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
          <p className="text-gray-400 mt-6 text-lg">Loading skills...</p>
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
                  <FiCode className="text-indigo-400" />
                  Skills Management
                </h1>
                <p className="text-gray-400 text-sm mt-1">Manage your technical skills and proficiencies</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {selectedSkills.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition border border-red-500/20"
                >
                  <FiTrash2 />
                  <span>Delete ({selectedSkills.length})</span>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0F0F0F] p-6 rounded-xl border border-gray-800/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FiCode className="text-blue-400 text-xl" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{skills.length}</h3>
            <p className="text-sm text-gray-500">Total Skills</p>
          </div>

          <div className="bg-[#0F0F0F] p-6 rounded-xl border border-gray-800/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <FiLayers className="text-purple-400 text-xl" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {Object.keys(categoryStats).filter(c => categoryStats[c] > 0).length}
            </h3>
            <p className="text-sm text-gray-500">Categories</p>
          </div>

          <div className="bg-[#0F0F0F] p-6 rounded-xl border border-gray-800/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <FiBarChart2 className="text-green-400 text-xl" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{averageProficiency.toFixed(1)}%</h3>
            <p className="text-sm text-gray-500">Avg. Proficiency</p>
          </div>

          <div className="bg-[#0F0F0F] p-6 rounded-xl border border-gray-800/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <FiStar className="text-yellow-400 text-xl" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {skills.filter(s => s.proficiency >= 80).length}
            </h3>
            <p className="text-sm text-gray-500">Expert Level</p>
          </div>
        </div>

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
                    placeholder="Search skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 focus:outline-none focus:border-indigo-500/50"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 focus:outline-none focus:border-indigo-500/50"
              >
                <option value="category">Sort by Category</option>
                <option value="name">Sort by Name</option>
                <option value="proficiency">Sort by Proficiency</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 hover:text-white transition"
              >
                {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
              </button>
            </div>
          </div>
        )}

        {/* Add New Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setCurrentSkill({ name: '', category: 'Frontend', proficiency: 50, icon: '', description: '' });
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/25"
          >
            {isEditing ? <FiX className="text-lg" /> : <FiPlus className="text-lg" />}
            <span>{isEditing ? 'Cancel' : 'Add New Skill'}</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mb-8 bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A] rounded-xl border border-indigo-500/20 p-6 animate-slideDown">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FiEdit2 className="text-indigo-400" />
              {currentSkill.id ? 'Edit Skill' : 'Add New Skill'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Skill Name</label>
                  <input
                    type="text"
                    required
                    value={currentSkill.name}
                    onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                    placeholder="e.g., React, Python, AWS"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category</label>
                  <select
                    value={currentSkill.category}
                    onChange={(e) => setCurrentSkill({ ...currentSkill, category: e.target.value as any })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 focus:outline-none focus:border-indigo-500/50"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description (Optional)</label>
                <textarea
                  value={currentSkill.description || ''}
                  onChange={(e) => setCurrentSkill({ ...currentSkill, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                  rows={2}
                  placeholder="Brief description of your experience with this skill..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Icon (Optional)</label>
                <input
                  type="text"
                  value={currentSkill.icon || ''}
                  onChange={(e) => setCurrentSkill({ ...currentSkill, icon: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                  placeholder="Icon name or URL"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Proficiency: <span className={getProficiencyColor(currentSkill.proficiency || 50)}>
                    {currentSkill.proficiency}%
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={currentSkill.proficiency}
                  onChange={(e) => setCurrentSkill({ ...currentSkill, proficiency: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                  <span>Expert</span>
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
                      <span>{currentSkill.id ? 'Update' : 'Save'} Skill</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentSkill({ name: '', category: 'Frontend', proficiency: 50, icon: '', description: '' });
                  }}
                  className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Skills Grid/List */}
        {isLoading && !isEditing ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-12 bg-[#0F0F0F] rounded-xl border border-gray-800/50">
            <FiCode className="text-5xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No skills found</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className={`group relative bg-[#0F0F0F] rounded-xl border transition-all hover:scale-[1.02] hover:shadow-lg ${
                  selectedSkills.includes(skill.id!) 
                    ? 'border-indigo-500/50 bg-indigo-500/5' 
                    : 'border-gray-800/50 hover:border-gray-700/50'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                        skill.category === 'Frontend' ? 'bg-blue-500/10 text-blue-400' :
                        skill.category === 'Backend' ? 'bg-green-500/10 text-green-400' :
                        skill.category === 'Machine Learning' ? 'bg-purple-500/10 text-purple-400' :
                        skill.category === 'Tools' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {categoryIcons[skill.category as keyof typeof categoryIcons] || <FiCode />}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition">
                          {skill.name}
                        </h3>
                        <p className="text-xs text-gray-500">{skill.category}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill.id!)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSkills([...selectedSkills, skill.id!]);
                        } else {
                          setSelectedSkills(selectedSkills.filter(id => id !== skill.id));
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500/50"
                    />
                  </div>

                  {skill.description && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{skill.description}</p>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Proficiency</span>
                      <span className={getProficiencyColor(skill.proficiency)}>{skill.proficiency}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProficiencyBgColor(skill.proficiency)} rounded-full transition-all duration-500`}
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition text-sm"
                    >
                      <FiEdit2 />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(skill.id!)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition text-sm"
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === skill.id && (
                  <div className="absolute inset-0 bg-[#0F0F0F]/95 backdrop-blur-sm rounded-xl flex items-center justify-center p-6">
                    <div className="text-center">
                      <FiAlertCircle className="text-4xl text-red-400 mx-auto mb-3" />
                      <p className="text-white mb-4">Delete this skill?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(skill.id!)}
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
                      checked={selectedSkills.length === filteredSkills.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSkills(filteredSkills.map(s => s.id!));
                        } else {
                          setSelectedSkills([]);
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500/50"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Skill</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Proficiency</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Description</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill.id!)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSkills([...selectedSkills, skill.id!]);
                          } else {
                            setSelectedSkills(selectedSkills.filter(id => id !== skill.id));
                          }
                        }}
                        className="w-5 h-5 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500/50"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{skill.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400">{skill.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={getProficiencyColor(skill.proficiency)}>{skill.proficiency}%</span>
                        <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProficiencyBgColor(skill.proficiency)} rounded-full`}
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 line-clamp-1">{skill.description || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(skill.id!)}
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
              <span className="text-gray-400">Total Skills:</span>
              <span className="text-white font-semibold">{skills.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Selected:</span>
              <span className="text-indigo-400 font-semibold">{selectedSkills.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Categories:</span>
              <div className="flex gap-2">
                {Object.entries(categoryStats)
                  .filter(([_, count]) => count > 0)
                  .map(([cat, count]) => (
                    <span key={cat} className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">
                      {cat}: {count}
                    </span>
                  ))}
              </div>
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