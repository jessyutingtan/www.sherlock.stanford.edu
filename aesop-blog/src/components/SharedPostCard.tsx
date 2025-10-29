import { Link } from 'react-router-dom';
import { Share2, X, Edit2 } from 'lucide-react';
import { Share } from '../types/database';
import { formatRelativeTime } from '../utils/date';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { useState } from 'react';
import PostCard from './PostCard';
import ThoughtBubbleCard from './ThoughtBubbleCard';

interface SharedPostCardProps {
  share: Share;
  onUpdate?: () => void;
}

export default function SharedPostCard({ share, onUpdate }: SharedPostCardProps) {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState(share.comment || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const isOwnShare = user?.id === share.user_id;

  const handleUnshare = async () => {
    if (!confirm('Are you sure you want to unshare this?')) return;

    try {
      const { error } = await supabase
        .from('shares')
        .delete()
        .eq('id', share.id);

      if (error) throw error;

      onUpdate?.();
    } catch (error) {
      console.error('Error unsharing:', error);
      alert('Failed to unshare. Please try again.');
    }
  };

  const handleUpdateComment = async () => {
    try {
      setIsUpdating(true);

      const { error } = await supabase
        .from('shares')
        .update({ comment: comment.trim() || null })
        .eq('id', share.id);

      if (error) throw error;

      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Share Attribution Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Share2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/profile/${share.user?.username}`}
                  className="font-bold text-blue-900 hover:text-blue-700 transition-colors"
                >
                  {share.user?.full_name || share.user?.username}
                </Link>
                <span className="text-gray-600">shared this</span>
                <span className="text-gray-500 text-sm">
                  · {formatRelativeTime(share.created_at)}
                </span>
              </div>

              {/* Share Comment */}
              {!isEditing && share.comment && (
                <p className="mt-2 text-gray-800 bg-white/60 rounded-lg p-3 border border-blue-200">
                  "{share.comment}"
                </p>
              )}

              {/* Edit Comment Form */}
              {isEditing && (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your thoughts... (optional)"
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    rows={3}
                    maxLength={500}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateComment}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium text-sm"
                    >
                      {isUpdating ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setComment(share.comment || '');
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Edit/Unshare Buttons */}
          {isOwnShare && !isEditing && (
            <div className="flex gap-2 ml-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="Edit comment"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleUnshare}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Unshare"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Original Content */}
      <div className="ml-4 border-l-2 border-gray-200 pl-4">
        {share.post && <PostCard post={share.post} onUpdate={onUpdate} />}
        {share.thought_bubble && (
          <ThoughtBubbleCard bubble={share.thought_bubble} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
}
