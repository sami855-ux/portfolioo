'use client';

import { Hero, SocialLinks, UploadResponse } from '@/types';
import { getValidFileUrl } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, ChangeEvent, FormEvent } from 'react';
import { 
  FiUser, 
  FiBriefcase, 
  FiTag, 
  FiImage, 
  FiFileText, 
  FiGithub, 
  FiLinkedin, 
  FiMail,
  FiSave,
  FiArrowLeft,
  FiEye,
  FiEdit3,
  FiCheckCircle,
  FiAlertCircle,
  FiLink,
  FiUpload,
  FiCopy,
  FiRefreshCw,
  FiX
} from 'react-icons/fi';

interface NotificationMessage {
  type: 'success' | 'error';
  text: string;
}

export default function HeroAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hero, setHero] = useState<Partial<Hero>>({
    fullName: '',
    professionalTitle: '',
    tagline: '',
    profileImage: '',
    resumeLink: '',
    socialLinks: { github: '', linkedin: '', email: '' },
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<NotificationMessage | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [copied, setCopied] = useState<boolean>(false);
  const [isUploadingResume, setIsUploadingResume] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchHero();
    }
  }, [status, router]);

  const fetchHero = async (): Promise<void> => {
    try {
      const res = await fetch('/api/hero');
      const data: Hero = await res.json();
      if (data.fullName) {
        setHero(data);
        if (data.profileImage) {
          setImagePreview(data.profileImage);
        }
      }
    } catch (error) {
      showNotification('error', 'Failed to fetch hero data');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string): void => {
    setSaveMessage({ type, text: message });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data: UploadResponse = await res.json();
        return data.url;
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Failed to upload image');
      throw error;
    }
  };

  const handleResumeUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'resume');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data: UploadResponse = await res.json();
        return data.url;
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Failed to upload resume');
      throw error;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    setUploadProgress(0);

    try {
      const updatedHero = { ...hero };

      // Upload image if selected
      if (imageFile) {
        setUploadProgress(30);
        const imageUrl = await handleImageUpload(imageFile);
        updatedHero.profileImage = imageUrl;
      }

      // Upload resume if selected
      if (resumeFile) {
        setUploadProgress(60);
        const resumeUrl = await handleResumeUpload(resumeFile);
        updatedHero.resumeLink = resumeUrl;
      }

      setUploadProgress(90);

      const res = await fetch('/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedHero),
      });

      if (res.ok) {
        setUploadProgress(100);
        showNotification('success', 'Hero section updated successfully!');
        setImageFile(null);
        setResumeFile(null);
        await fetchHero(); // Refresh data
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        showNotification('error', 'Please select an image file');
      }
    }
  };

  const handleResumeChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type)) {
      showNotification('error', 'Please select a PDF or Word document');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      showNotification('error', 'Resume file size exceeds 4MB limit.');
      return;
    }

    setIsUploadingResume(true);
    setResumeFile(file);

    try {
      const uploadedUrl = await handleResumeUpload(file);
      setHero(prev => ({ ...prev, resumeLink: uploadedUrl }));
      showNotification('success', 'Resume uploaded successfully!');
    } catch {
      showNotification('error', 'Failed to upload resume');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const removeImage = (): void => {
    setImageFile(null);
    setImagePreview(null);
    setHero({ ...hero, profileImage: '' });
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const removeResume = (): void => {
    setResumeFile(null);
    setHero({ ...hero, resumeLink: '' });
    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showNotification('error', 'Failed to copy to clipboard');
    }
  };

  const resetForm = (): void => {
    fetchHero();
    setImageFile(null);
    setResumeFile(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (resumeInputRef.current) resumeInputRef.current.value = '';
    showNotification('success', 'Form reset to last saved version');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string): void => {
    setHero({
      ...hero,
      socialLinks: {
        ...hero.socialLinks!,
        [platform]: value
      }
    });
  };

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
          <p className="text-gray-400 mt-6 text-lg">Loading hero section...</p>
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
                  <FiEdit3 className="text-indigo-400" />
                  Hero Section Manager
                </h1>
                <p className="text-gray-400 text-sm mt-1">Upload images and documents from your computer</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={resetForm}
                className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition"
                title="Reset to saved version"
              >
                <FiRefreshCw className="text-xl" />
              </button>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`p-3 rounded-xl transition ${
                  previewMode 
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title="Toggle preview mode"
              >
                <FiEye className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
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

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-6 p-4 bg-[#0F0F0F] rounded-xl border border-indigo-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Uploading...</span>
              <span className="text-sm text-indigo-400">{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
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
        </div>

        {activeTab === 'edit' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Card */}
                <div className="bg-[#0F0F0F] rounded-xl border border-gray-800/50 overflow-hidden">
                  <div className="border-b border-gray-800/50 px-6 py-4 bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A]">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FiUser className="text-indigo-400" />
                      Personal Information
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={hero.fullName || ''}
                        onChange={(e) => setHero({ ...hero, fullName: e.target.value })}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Professional Title</label>
                      <input
                        type="text"
                        required
                        value={hero.professionalTitle || ''}
                        onChange={(e) => setHero({ ...hero, professionalTitle: e.target.value })}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition"
                        placeholder="Senior Software Engineer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Tagline</label>
                      <input
                        type="text"
                        required
                        value={hero.tagline || ''}
                        onChange={(e) => setHero({ ...hero, tagline: e.target.value })}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition"
                        placeholder="Building innovative solutions for real-world problems"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Image Card */}
                <div className="bg-[#0F0F0F] rounded-xl border border-gray-800/50 overflow-hidden">
                  <div className="border-b border-gray-800/50 px-6 py-4 bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A]">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FiImage className="text-indigo-400" />
                      Profile Image
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-400 mb-2">Upload Image</label>
                        <div className="relative">
                          <input
                            type="file"
                            ref={imageInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="flex items-center justify-center gap-2 w-full px-4 py-8 bg-[#1A1A1A] border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer transition-all"
                          >
                            <FiUpload className="text-xl" />
                            <span>Click to upload or drag and drop</span>
                          </label>
                          {imageFile && (
                            <div className="mt-3 flex items-center justify-between bg-[#1A1A1A] p-3 rounded-lg border border-gray-700">
                              <div className="flex items-center gap-2">
                                <FiImage className="text-indigo-400" />
                                <span className="text-sm text-gray-300 truncate max-w-[200px]">
                                  {imageFile.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({formatFileSize(imageFile.size)})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={removeImage}
                                className="p-1 hover:bg-red-500/10 rounded-lg text-red-400"
                              >
                                <FiX />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-32 h-32 bg-[#1A1A1A] rounded-xl border border-gray-800 overflow-hidden flex-shrink-0">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Profile preview" 
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
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: Square image, at least 400x400 pixels. Max size: 4MB.
                    </p>
                  </div>
                </div>

                {/* Resume Upload Card */}
                <div className="bg-[#0F0F0F] rounded-xl border border-gray-800/50 overflow-hidden">
                  <div className="border-b border-gray-800/50 px-6 py-4 bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A]">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FiFileText className="text-indigo-400" />
                      Resume
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Upload Resume</label>
                        <div className="relative">
                          <input
                            type="file"
                            ref={resumeInputRef}
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeChange}
                            className="hidden"
                            id="resume-upload"
                          />
                          <label
                            htmlFor="resume-upload"
                            className="flex items-center justify-center gap-2 w-full px-4 py-8 bg-[#1A1A1A] border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer transition-all"
                          >
                            {isUploadingResume ? (
                              <>
                                <FiRefreshCw className="text-xl animate-spin text-indigo-400" />
                                <span className="text-indigo-400 font-medium">Uploading resume...</span>
                              </>
                            ) : (
                              <>
                                <FiUpload className="text-xl text-indigo-400" />
                                <span>Click to upload PDF / Word document</span>
                              </>
                            )}
                          </label>
                          {resumeFile && (
                            <div className="mt-3 flex items-center justify-between bg-[#1A1A1A] p-3 rounded-lg border border-gray-700">
                              <div className="flex items-center gap-2">
                                <FiFileText className="text-indigo-400" />
                                <span className="text-sm text-gray-300 truncate max-w-[200px]">
                                  {resumeFile.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({formatFileSize(resumeFile.size)})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={removeResume}
                                className="p-1 hover:bg-red-500/10 rounded-lg text-red-400"
                              >
                                <FiX />
                              </button>
                            </div>
                          )}
                          {hero.resumeLink && !resumeFile && (
                            <div className="mt-3 flex items-center justify-between bg-[#1A1A1A] p-3 rounded-lg border border-gray-700">
                              <div className="flex items-center gap-2">
                                <FiFileText className="text-green-400" />
                                <span className="text-sm text-gray-300 truncate max-w-[200px]">
                                  Current resume (from URL)
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => hero.resumeLink && copyToClipboard(hero.resumeLink)}
                                  className="p-1 hover:bg-indigo-500/10 rounded-lg text-indigo-400"
                                  title="Copy link"
                                >
                                  <FiCopy />
                                </button>
                                <a
                                  href={getValidFileUrl(hero.resumeLink)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 hover:bg-blue-500/10 rounded-lg text-blue-400"
                                  title="View"
                                >
                                  <FiEye />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Accepted formats: PDF, DOC, DOCX. Max size: 4MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links Card */}
                <div className="bg-[#0F0F0F] rounded-xl border border-gray-800/50 overflow-hidden">
                  <div className="border-b border-gray-800/50 px-6 py-4 bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A]">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FiLink className="text-indigo-400" />
                      Social Links
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                        <FiGithub className="text-gray-500" />
                        GitHub URL
                      </label>
                      <input
                        type="text"
                        value={hero.socialLinks?.github || ''}
                        onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition"
                        placeholder="https://github.com/username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                        <FiLinkedin className="text-gray-500" />
                        LinkedIn URL
                      </label>
                      <input
                        type="text"
                        value={hero.socialLinks?.linkedin || ''}
                        onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                        <FiMail className="text-gray-500" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={hero.socialLinks?.email || ''}
                        onChange={(e) => handleSocialLinkChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition"
                        placeholder="email@example.com"
                      />
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
            </div>

            {/* Right Sidebar - Tips & Info */}
            <div className="lg:col-span-1">
              <div className="bg-[#0F0F0F] rounded-xl border border-gray-800/50 p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-white mb-4">Upload Tips</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                    <h4 className="text-indigo-400 font-medium mb-2 text-sm">Profile Image</h4>
                    <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                      <li>Square images work best</li>
                      <li>Recommended size: 400x400 pixels</li>
                      <li>Max file size: 5MB</li>
                      <li>Formats: JPG, PNG, GIF, WebP</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/10">
                    <h4 className="text-purple-400 font-medium mb-2 text-sm">Resume</h4>
                    <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                      <li>Accepted formats: PDF, DOC, DOCX</li>
                      <li>Max file size: 10MB</li>
                      <li>Keep filename simple (no spaces)</li>
                      <li>PDF format is recommended</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-pink-500/5 rounded-lg border border-pink-500/10">
                    <h4 className="text-pink-400 font-medium mb-2 text-sm">General Tips</h4>
                    <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                      <li>Upload progress bar shows status</li>
                      <li>You can upload one file at a time</li>
                      <li>Existing files will be replaced</li>
                      <li>Preview before saving changes</li>
                    </ul>
                  </div>
                </div>

                {/* Copy Notification */}
                {copied && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm flex items-center gap-2">
                    <FiCheckCircle />
                    <span>Link copied to clipboard!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="bg-[#0F0F0F] rounded-xl border border-gray-800/50 p-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <FiEye className="text-indigo-400" />
              Live Preview
            </h3>
            
            {/* Hero Preview Card */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-[#1A1A1A] to-[#0F0F0F] rounded-2xl border border-gray-800/50 p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Profile Image */}
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-indigo-500/20 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="text-white text-4xl" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {hero.fullName || 'Your Name'}
                    </h1>
                    <p className="text-xl text-indigo-400 mb-3">
                      {hero.professionalTitle || 'Professional Title'}
                    </p>
                    <p className="text-gray-400 mb-4">
                      {hero.tagline || 'Your tagline will appear here'}
                    </p>

                    {/* Social Links */}
                    <div className="flex gap-4 justify-center md:justify-start">
                      {hero.socialLinks?.github && (
                        <a href="#" className="text-gray-400 hover:text-white transition">
                          <FiGithub className="text-xl" />
                        </a>
                      )}
                      {hero.socialLinks?.linkedin && (
                        <a href="#" className="text-gray-400 hover:text-white transition">
                          <FiLinkedin className="text-xl" />
                        </a>
                      )}
                      {hero.socialLinks?.email && (
                        <a href="#" className="text-gray-400 hover:text-white transition">
                          <FiMail className="text-xl" />
                        </a>
                      )}
                    </div>

                    {/* Resume Button */}
                    {(hero.resumeLink || resumeFile) && (
                      <button className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm">
                        View Resume
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Status */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#1A1A1A] rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Profile Image</p>
                <p className={`text-sm ${imageFile || hero.profileImage ? 'text-green-400' : 'text-red-400'}`}>
                  {imageFile ? '✓ New file ready' : hero.profileImage ? '✓ Existing file' : '✗ No file'}
                </p>
              </div>
              <div className="p-4 bg-[#1A1A1A] rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Resume</p>
                <p className={`text-sm ${resumeFile || hero.resumeLink ? 'text-green-400' : 'text-red-400'}`}>
                  {resumeFile ? '✓ New file ready' : hero.resumeLink ? '✓ Existing file' : '✗ No file'}
                </p>
              </div>
            </div>
          </div>
        )}
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
