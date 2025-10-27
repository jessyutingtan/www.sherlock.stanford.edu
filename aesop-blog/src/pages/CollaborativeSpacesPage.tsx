import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { CollaborativeSpace } from '../types/database';
import { Users, Plus, Lock, Globe } from 'lucide-react';
import { formatRelativeTime } from '../utils/date';

export default function CollaborativeSpacesPage() {
  const { user } = useAuthStore();
  const [spaces, setSpaces] = useState<CollaborativeSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSpace, setNewSpace] = useState({
    title: '',
    description: '',
    isPublic: true,
  });

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('collaborative_spaces')
        .select(
          `
          *,
          creator:profiles!collaborative_spaces_creator_id_fkey(*),
          collaborators:space_collaborators(count)
        `
        )
        .or(`creator_id.eq.${user.id},is_public.eq.true`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedSpaces = data?.map((space) => ({
        ...space,
        collaborator_count: space.collaborators?.[0]?.count || 0,
      }));

      setSpaces(formattedSpaces || []);
    } catch (error) {
      console.error('Error fetching spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newSpace.title.trim()) return;

    try {
      const { error } = await supabase.from('collaborative_spaces').insert({
        creator_id: user.id,
        title: newSpace.title.trim(),
        description: newSpace.description.trim() || null,
        is_public: newSpace.isPublic,
      });

      if (error) throw error;

      setShowCreateModal(false);
      setNewSpace({ title: '', description: '', isPublic: true });
      fetchSpaces();
    } catch (error) {
      console.error('Error creating space:', error);
      alert('Failed to create space');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Collaborative Spaces</h1>
            <p className="text-gray-600">Write together in real-time</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Space
          </button>
        </div>

        {/* Spaces grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <div key={space.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{space.title}</h3>
                  {space.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">{space.description}</p>
                  )}
                </div>
                {space.is_public ? (
                  <Globe className="w-5 h-5 text-green-600" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-600" />
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Users className="w-4 h-4" />
                <span>{space.collaborator_count} collaborators</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  {space.creator?.avatar_url ? (
                    <img
                      src={space.creator.avatar_url}
                      alt={space.creator.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-semibold">
                      {space.creator?.username[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-gray-600">
                    {space.creator?.username}
                  </span>
                </div>
                <button className="btn btn-primary text-sm">Open</button>
              </div>
            </div>
          ))}
        </div>

        {spaces.length === 0 && (
          <div className="text-center py-12 card">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No collaborative spaces yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create a space to start writing with others in real-time
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Space
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Create Collaborative Space
            </h2>

            <form onSubmit={handleCreateSpace} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newSpace.title}
                  onChange={(e) => setNewSpace({ ...newSpace, title: e.target.value })}
                  placeholder="My Awesome Space"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newSpace.description}
                  onChange={(e) => setNewSpace({ ...newSpace, description: e.target.value })}
                  placeholder="What's this space about?"
                  rows={3}
                  className="input resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newSpace.isPublic}
                  onChange={(e) => setNewSpace({ ...newSpace, isPublic: e.target.checked })}
                  className="w-5 h-5 text-blue-600"
                />
                <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                  Make this space public
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn btn-primary">
                  Create Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
