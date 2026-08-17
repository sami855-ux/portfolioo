'use client';

import { Project } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiCopy,
  FiEdit2,
  FiExternalLink,
  FiFilter,
  FiFolder,
  FiGithub,
  FiGrid,
  FiImage,
  FiList,
  FiPlus,
  FiSave,
  FiSearch,
  FiStar,
  FiTrash2,
  FiX
} from 'react-icons/fi';

export default function ProjectsAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    technologies: [],
    image: '',
    githubLink: '',
    liveLink: '',
    featured: false,
    category: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'regular'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);
  const [newTechnology, setNewTechnology] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // React Query data fetching
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },
    enabled: status === 'authenticated',
  });

  // React Query mutations
  const saveProjectMutation = useMutation({
    mutationFn: async (projectData: Partial<Project>) => {
      const method = projectData.id ? 'PUT' : 'POST';
      const res = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      if (!res.ok) throw new Error('Failed to save project');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsEditing(false);
      setCurrentProject({
        title: '',
        description: '',
        technologies: [],
        image: '',
        githubLink: '',
        liveLink: '',
        featured: false,
        category: '',
      });
      setImagePreview(null);
      showNotification('success', `Project ${currentProject.id ? 'updated' : 'added'} successfully!`);
    },
    onError: () => {
      showNotification('error', 'Failed to save project');
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setDeleteConfirm(null);
      showNotification('success', 'Project deleted successfully');
    },
    onError: () => {
      showNotification('error', 'Failed to delete project');
    },
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProjectMutation.mutate(currentProject);
  };

  const handleDelete = (id: string) => {
    deleteProjectMutation.mutate(id);
  };

  const handleBulkDelete = async () => {
    if (selectedProjects.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedProjects.length} projects?`)) {
      try {
        await Promise.all(selectedProjects.map(id => 
          fetch(`/api/projects?id=${id}`, { method: 'DELETE' })
        ));
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        setSelectedProjects([]);
        showNotification('success', `${selectedProjects.length} projects deleted successfully`);
      } catch (error) {
        showNotification('error', 'Failed to delete projects');
      }
    }
  };

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setImagePreview(project.image || null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setCurrentProject({
        ...currentProject,
        technologies: [...(currentProject.technologies || []), newTechnology.trim()]
      });
      setNewTechnology('');
    }
  };

  const removeTechnology = (index: number) => {
    setCurrentProject({
      ...currentProject,
      technologies: (currentProject.technologies || []).filter((_, i) => i !== index)
    });
  };

  const handleImageChange = (url: string) => {
    setCurrentProject({ ...currentProject, image: url });
    setImagePreview(url);
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        handleImageChange(data.url);
        showNotification('success', 'Image uploaded successfully');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      showNotification('error', 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setCurrentProject({ ...project, featured: !currentFeatured });
      await handleSubmit(new Event('submit') as any);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    const matchesFeatured = filterFeatured === 'all' || 
                           (filterFeatured === 'featured' && project.featured) ||
                           (filterFeatured === 'regular' && !project.featured);
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];

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
          <p className="text-gray-400 mt-6 text-lg">Loading projects...</p>
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
                  <FiFolder className="text-indigo-400" />
                  Projects Management
                </h1>
                <p className="text-gray-400 text-sm mt-1">Manage your portfolio projects and case studies</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {selectedProjects.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition border border-red-500/20"
                >
                  <FiTrash2 />
                  <span>Delete ({selectedProjects.length})</span>
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
                    placeholder="Search projects..."
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
                value={filterFeatured}
                onChange={(e) => setFilterFeatured(e.target.value as any)}
                className="px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 focus:outline-none focus:border-indigo-500/50"
              >
                <option value="all">All Projects</option>
                <option value="featured">Featured Only</option>
                <option value="regular">Regular Only</option>
              </select>
            </div>
          </div>
        )}

        {/* Add New Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setCurrentProject({
                title: '',
                description: '',
                technologies: [],
                image: '',
                githubLink: '',
                liveLink: '',
                featured: false,
                category: '',
              });
              setImagePreview(null);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/25"
          >
            {isEditing ? <FiX className="text-lg" /> : <FiPlus className="text-lg" />}
            <span>{isEditing ? 'Cancel' : 'Add New Project'}</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mb-8 bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A] rounded-xl border border-indigo-500/20 p-6 animate-slideDown">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FiEdit2 className="text-indigo-400" />
              {currentProject.id ? 'Edit Project' : 'Add New Project'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Project Title</label>
                  <input
                    type="text"
                    required
                    value={currentProject.title}
                    onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                    placeholder="e.g., E-commerce Platform"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category</label>
                  <input
                    type="text"
                    required
                    value={currentProject.category}
                    onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                    placeholder="e.g., Web Development"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  required
                  value={currentProject.description}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                  rows={3}
                  placeholder="Describe your project, its features, and impact..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Technologies</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(currentProject.technologies || []).map((tech, index) => (
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

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">GitHub Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentProject.githubLink}
                      onChange={(e) => setCurrentProject({ ...currentProject, githubLink: e.target.value })}
                      className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                      placeholder="https://github.com/..."
                    />
                    {currentProject.githubLink && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(currentProject.githubLink!)}
                        className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                        title="Copy link"
                      >
                        <FiCopy />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Live Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentProject.liveLink}
                      onChange={(e) => setCurrentProject({ ...currentProject, liveLink: e.target.value })}
                      className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                      placeholder="https://..."
                    />
                    {currentProject.liveLink && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(currentProject.liveLink!)}
                        className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                        title="Copy link"
                      >
                        <FiCopy />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Project Image</label>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-3">
                    {/* URL Input */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={currentProject.image}
                        onChange={(e) => handleImageChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    {/* File Upload */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Or Upload Image</label>
                      <input
                        type="file"
                        ref={imageInputRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="project-image-upload"
                      />
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-indigo-500/50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {uploadingImage ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-600 border-t-indigo-500 rounded-full animate-spin"></div>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <FiImage />
                            <span>Choose Image File</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Image Preview */}
                  <div className="w-32 h-32 bg-[#1A1A1A] rounded-lg border border-gray-800 overflow-hidden flex-shrink-0">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={() => setImagePreview(null)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiImage className="text-gray-600 text-3xl" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={currentProject.featured}
                    onChange={(e) => setCurrentProject({ ...currentProject, featured: e.target.checked })}
                    className="w-4 h-4 bg-[#1A1A1A] border-gray-700 rounded text-indigo-500 focus:ring-indigo-500/50"
                  />
                  <FiStar className={`${currentProject.featured ? 'text-yellow-400' : 'text-gray-500'}`} />
                  <span>Featured Project</span>
                </label>
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
                      <span>{currentProject.id ? 'Update' : 'Save'} Project</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentProject({
                      title: '',
                      description: '',
                      technologies: [],
                      image: '',
                      githubLink: '',
                      liveLink: '',
                      featured: false,
                      category: '',
                    });
                    setImagePreview(null);
                  }}
                  className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Copy Notification */}
            {copied && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm flex items-center gap-2">
                <FiCheckCircle />
                <span>Link copied to clipboard!</span>
              </div>
            )}
          </div>
        )}

        {/* Projects Grid/List */}
        {isLoading && !isEditing ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-[#0F0F0F] rounded-xl border border-gray-800/50">
            <FiFolder className="text-5xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No projects found</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`group relative bg-[#0F0F0F] rounded-xl border transition-all hover:scale-[1.02] hover:shadow-lg ${
                  selectedProjects.includes(project.id!) 
                    ? 'border-indigo-500/50 bg-indigo-500/5' 
                    : 'border-gray-800/50 hover:border-gray-700/50'
                }`}
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-t-xl overflow-hidden">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiImage className="text-4xl text-gray-600" />
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm">
                      <FiStar className="text-xs" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition">
                      {project.title}
                    </h3>
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id!)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProjects([...selectedProjects, project.id!]);
                        } else {
                          setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500/50"
                    />
                  </div>

                  <p className="text-sm text-gray-500 mb-2">{project.category}</p>

                  <div className="mb-4">
                    <p className={`text-gray-400 text-sm ${expandedDesc !== project.id ? 'line-clamp-2' : ''}`}>
                      {project.description}
                    </p>
                    {project.description.length > 100 && (
                      <button
                        onClick={() => setExpandedDesc(expandedDesc === project.id ? null : project.id!)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 flex items-center gap-1"
                      >
                        {expandedDesc === project.id ? (
                          <>Show less <FiChevronUp /></>
                        ) : (
                          <>Read more <FiChevronDown /></>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-3 mb-4">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-white transition"
                      >
                        <FiGithub className="text-lg" />
                      </a>
                    )}
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-white transition"
                      >
                        <FiExternalLink className="text-lg" />
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition text-sm"
                    >
                      <FiEdit2 />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleFeatured(project.id!, project.featured)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition text-sm ${
                        project.featured 
                          ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400' 
                          : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400'
                      }`}
                    >
                      <FiStar />
                      {project.featured ? 'Featured' : 'Feature'}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(project.id!)}
                      className="flex items-center justify-center px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition text-sm"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === project.id && (
                  <div className="absolute inset-0 bg-[#0F0F0F]/95 backdrop-blur-sm rounded-xl flex items-center justify-center p-6">
                    <div className="text-center">
                      <FiAlertCircle className="text-4xl text-red-400 mx-auto mb-3" />
                      <p className="text-white mb-4">Delete this project?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(project.id!)}
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
                      checked={selectedProjects.length === filteredProjects.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProjects(filteredProjects.map(p => p.id!));
                        } else {
                          setSelectedProjects([]);
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500/50"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Featured</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Links</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(project.id!)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProjects([...selectedProjects, project.id!]);
                          } else {
                            setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                          }
                        }}
                        className="w-5 h-5 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500/50"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 bg-[#1A1A1A] rounded-lg overflow-hidden">
                        {project.image ? (
                          <img src={project.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiImage className="text-gray-600" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{project.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">{project.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      {project.featured ? (
                        <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs">
                          Featured
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs">Regular</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white">
                            <FiGithub />
                          </a>
                        )}
                        {project.liveLink && (
                          <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white">
                            <FiExternalLink />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(project.id!)}
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
              <span className="text-gray-400">Total Projects:</span>
              <span className="text-white font-semibold">{projects.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Selected:</span>
              <span className="text-indigo-400 font-semibold">{selectedProjects.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Featured:</span>
              <span className="text-yellow-400 font-semibold">{projects.filter(p => p.featured).length}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Categories:</span>
              <span className="text-gray-300">{categories.length}</span>
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