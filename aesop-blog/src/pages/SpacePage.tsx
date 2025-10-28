import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { CollaborativeSpace } from '../types/database';
import { Users, Globe, Lock, ArrowLeft, Save, UserPlus, X } from 'lucide-react';
import { formatDate } from '../utils/date';

export default function SpacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [space, setSpace] = useState<CollaborativeSpace | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCollaborator, setIsCollaborator] = useState(false);
  const [joinRequestStatus, setJoinRequestStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchSpace();
    }
  }, [id]);

  const fetchSpace = async () => {
    try {
      const { data, error } = await supabase
        .from('collaborative_spaces')
        .select(`
          *,
          creator:profiles!collaborative_spaces_creator_id_fkey(*),
          collaborators:space_collaborators(
            user:profiles(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setSpace(data);
      setContent(data.content || '');

      // Check if user is creator or collaborator
      if (user) {
        const creator = data.creator_id === user.id;
        const isCollab = data.collaborators?.some(
          (c: any) => c.user?.id === user.id
        );
        setIsCollaborator(creator || isCollab);

        // Check if user has a join request
        if (!creator && !isCollab) {
          const { data: request } = await supabase
            .from('space_join_requests')
            .select('status')
            .eq('space_id', id)
            .eq('user_id', user.id)
            .single();

          if (request) {
            setJoinRequestStatus(request.status as any);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching space:', error);
      alert('Space not found or you do not have access');
      navigate('/spaces');
    } finally {
      setLoading(false);
    }
  };

  const handleSendJoinRequest = async () => {
    if (!user || !space) return;

    try {
      const { error } = await supabase
        .from('space_join_requests')
        .insert({
          space_id: space.id,
          user_id: user.id,
          message: joinMessage.trim() || null,
          status: 'pending',
        });

      if (error) throw error;

      // Create notification for space creator
      await supabase.from('notifications').insert({
        user_id: space.creator_id,
        type: 'space_join_request',
        actor_id: user.id,
        space_id: space.id,
        is_read: false,
      });

      setJoinRequestStatus('pending');
      setShowJoinModal(false);
      setJoinMessage('');
      alert('Join request sent successfully!');
    } catch (error) {
      console.error('Error sending join request:', error);
      alert('Failed to send join request. You may have already requested.');
    }
  };

  const handleSave = async () => {
    if (!space || !isCollaborator) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('collaborative_spaces')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', space.id);

      if (error) throw error;

      alert('Space saved successfully!');
    } catch (error) {
      console.error('Error saving space:', error);
      alert('Failed to save space');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!space) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/spaces')}
            className="btn btn-secondary flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Spaces
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">{space.title}</h1>
                {space.is_public ? (
                  <Globe className="w-6 h-6 text-green-600" />
                ) : (
                  <Lock className="w-6 h-6 text-gray-600" />
                )}
                {space.status === 'concluded' && (
                  <span className="badge bg-gray-500 text-white">Concluded</span>
                )}
              </div>
              {space.description && (
                <p className="text-gray-600 mb-4">{space.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Created by @{space.creator?.username}</span>
                <span>•</span>
                <span>{formatDate(space.created_at)}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {space.collaborators?.length || 0} collaborators
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isCollaborator && space.status === 'active' && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}

              {!isCollaborator && space.status === 'active' && space.is_public && (
                <>
                  {joinRequestStatus === 'none' && (
                    <button
                      onClick={() => setShowJoinModal(true)}
                      className="btn bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                    >
                      <UserPlus className="w-5 h-5" />
                      Join Space
                    </button>
                  )}
                  {joinRequestStatus === 'pending' && (
                    <span className="badge bg-yellow-100 text-yellow-800 px-4 py-2">
                      Request Pending
                    </span>
                  )}
                  {joinRequestStatus === 'rejected' && (
                    <span className="badge bg-red-100 text-red-800 px-4 py-2">
                      Request Rejected
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="card p-8">
          {isCollaborator && space.status === 'active' ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing together..."
              className="w-full min-h-[600px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-mono text-gray-900"
            />
          ) : (
            <div className="prose max-w-none">
              {content ? (
                <pre className="whitespace-pre-wrap font-sans text-gray-900">{content}</pre>
              ) : (
                <p className="text-gray-500 italic">No content yet...</p>
              )}
            </div>
          )}
        </div>

        {/* Collaborators List */}
        {space.collaborators && space.collaborators.length > 0 && (
          <div className="card p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaborators</h3>
            <div className="flex flex-wrap gap-3">
              {space.collaborators.map((collab: any) => (
                <div
                  key={collab.user.id}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
                >
                  {collab.user.avatar_url ? (
                    <img
                      src={collab.user.avatar_url}
                      alt={collab.user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-semibold">
                      {collab.user.username[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    @{collab.user.username}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Join Request Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Request to Join Space</h2>
              <button
                onClick={() => setShowJoinModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Send a request to <span className="font-semibold">@{space?.creator?.username}</span> to join this collaborative space.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                placeholder="Why would you like to join this space?"
                rows={4}
                className="input resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {joinMessage.length}/500 characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSendJoinRequest}
                className="flex-1 btn bg-green-600 text-white hover:bg-green-700"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
