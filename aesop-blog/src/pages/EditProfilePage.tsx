import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { uploadImage, validateImageFile } from '../utils/imageUpload';
import { Camera, Save, X, Bell, Mail } from 'lucide-react';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, fetchUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [backgroundUploading, setBackgroundUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || '',
    website: user?.website || '',
    avatar_url: user?.avatar_url || '',
    background_image: user?.background_image || '',
    notification_web: user?.notification_web !== undefined ? user.notification_web : true,
    notification_email: user?.notification_email || false,
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      validateImageFile(file, 5);
      setUploading(true);

      const publicUrl = await uploadImage(file, 'avatars', user.id);
      setFormData({ ...formData, avatar_url: publicUrl });
    } catch (error: any) {
      alert(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      validateImageFile(file, 10); // 10MB limit for background images
      setBackgroundUploading(true);

      const publicUrl = await uploadImage(file, 'backgrounds', user.id);
      setFormData({ ...formData, background_image: publicUrl });
    } catch (error: any) {
      alert(error.message || 'Failed to upload background image');
    } finally {
      setBackgroundUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name || null,
          bio: formData.bio || null,
          website: formData.website || null,
          avatar_url: formData.avatar_url || null,
          background_image: formData.background_image || null,
          notification_web: formData.notification_web,
          notification_email: formData.notification_email,
        })
        .eq('id', user.id);

      if (error) throw error;

      await fetchUser();
      navigate(`/profile/${user.username}`);
    } catch (error: any) {
      alert(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyber-950 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-400 to-neon-400">
            Edit Profile
          </h1>
          <button
            onClick={() => navigate(`/profile/${user?.username}`)}
            className="p-2 rounded-lg bg-slate-800/50 border border-cyber-500/20 text-gray-400 hover:text-white hover:border-cyber-500/40 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="bg-slate-900/50 border border-cyber-500/20 rounded-xl p-6 backdrop-blur-sm">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Profile Photo
            </label>
            <div className="flex items-center gap-6">
              <div className="relative group">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-cyber-500/30 group-hover:ring-cyber-500/60 transition-all"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyber-600 to-neon-600 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-cyber-500/30 group-hover:ring-cyber-500/60 transition-all">
                    {user?.username[0].toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 p-3 rounded-full bg-cyber-600 border-2 border-slate-900 text-white hover:bg-cyber-500 disabled:opacity-50 transition-all shadow-lg hover:shadow-cyber-500/50"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-2">
                  Upload a profile photo (JPG, PNG, WebP, or GIF)
                </p>
                <p className="text-gray-500 text-xs">
                  Max file size: 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Background Image Upload */}
          <div className="bg-slate-900/50 border border-cyber-500/20 rounded-xl p-6 backdrop-blur-sm">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Background Image
            </label>
            <div className="space-y-4">
              {/* Background Preview */}
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-800/50 border border-cyber-500/20">
                {formData.background_image ? (
                  <>
                    <img
                      src={formData.background_image}
                      alt="Background"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, background_image: '' })}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p className="text-center">
                      <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      No background image
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div>
                <button
                  type="button"
                  onClick={() => backgroundInputRef.current?.click()}
                  disabled={backgroundUploading}
                  className="w-full px-4 py-3 rounded-lg bg-cyber-600 text-white hover:bg-cyber-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <Camera className="w-5 h-5" />
                  {backgroundUploading ? 'Uploading...' : 'Upload Background Image'}
                </button>
                <p className="text-gray-400 text-sm mt-2">
                  Upload a cover photo (JPG, PNG, WebP, or GIF). Max file size: 10MB
                </p>
                <input
                  ref={backgroundInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-slate-900/50 border border-cyber-500/20 rounded-xl p-6 backdrop-blur-sm space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyber-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20 outline-none transition-all"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                maxLength={200}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyber-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20 outline-none transition-all resize-none"
                placeholder="Tell us about yourself..."
              />
              <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/200 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyber-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20 outline-none transition-all"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-slate-900/50 border border-cyber-500/20 rounded-xl p-6 backdrop-blur-sm space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-cyber-400" />
                <div>
                  <p className="text-white font-medium">Web Notifications</p>
                  <p className="text-sm text-gray-400">Get notified in the app</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notification_web}
                  onChange={(e) => setFormData({ ...formData, notification_web: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyber-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-neon-400" />
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive updates via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notification_email}
                  onChange={(e) => setFormData({ ...formData, notification_email: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-600"></div>
              </label>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              You'll receive notifications for: new comments, likes, follows, mentions, and @you interactions
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/profile/${user?.username}`)}
              className="flex-1 px-6 py-3 rounded-lg bg-slate-800/50 border border-cyber-500/20 text-gray-300 hover:text-white hover:border-cyber-500/40 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading || backgroundUploading}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-cyber-600 to-neon-600 text-white font-medium hover:from-cyber-500 hover:to-neon-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-cyber-500/50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : uploading || backgroundUploading ? 'Uploading...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
