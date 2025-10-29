import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Comment } from '../types/database';
import { formatRelativeTime } from '../utils/date';
import { MessageCircle, Send } from 'lucide-react';

interface CommentThreadProps {
  comment: Comment;
  postId?: string;
  thoughtBubbleId?: string;
  onUpdate: () => void;
  depth?: number;
}

export default function CommentThread({ comment, postId, thoughtBubbleId, onUpdate, depth = 0 }: CommentThreadProps) {
  const { user } = useAuthStore();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<Comment[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReplies();
  }, [comment.id]);

  const fetchReplies = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(
          `
          *,
          author:profiles!comments_author_id_fkey(*)
        `
        )
        .eq('parent_id', comment.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyText.trim() || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('comments').insert({
        post_id: postId || null,
        thought_bubble_id: thoughtBubbleId || null,
        author_id: user.id,
        parent_id: comment.id,
        content: replyText.trim(),
      });

      if (error) throw error;

      setReplyText('');
      setShowReplyForm(false);
      fetchReplies();
      onUpdate();
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply');
    } finally {
      setSubmitting(false);
    }
  };

  const maxDepth = 3;
  const indent = Math.min(depth, maxDepth) * 24;

  return (
    <div className={`${depth > 0 ? 'mt-4' : ''}`} style={{ marginLeft: `${indent}px` }}>
      <div className="card p-4">
        {/* Comment header */}
        <div className="flex items-start gap-3 mb-3">
          <Link to={`/profile/${comment.author?.username}`}>
            {comment.author?.avatar_url ? (
              <img
                src={comment.author.avatar_url}
                alt={comment.author.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-semibold">
                {comment.author?.username[0].toUpperCase()}
              </div>
            )}
          </Link>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Link
                to={`/profile/${comment.author?.username}`}
                className="font-semibold text-gray-900 hover:text-blue-600"
              >
                {comment.author?.full_name || comment.author?.username}
              </Link>
              <span className="text-sm text-gray-500">
                {formatRelativeTime(comment.created_at)}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>

            {/* Actions */}
            {depth < maxDepth && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="mt-2 text-sm text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                Reply
              </button>
            )}
          </div>
        </div>

        {/* Reply form */}
        {showReplyForm && (
          <form onSubmit={handleSubmitReply} className="mt-4 ml-13">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              className="input resize-none mb-2 text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!replyText.trim() || submitting}
                className="btn btn-primary text-sm py-1.5 px-3 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Posting...' : 'Post Reply'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyText('');
                }}
                className="btn btn-secondary text-sm py-1.5 px-3"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Nested replies */}
      {replies.length > 0 && (
        <div className="mt-2">
          {replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              postId={postId}
              thoughtBubbleId={thoughtBubbleId}
              onUpdate={onUpdate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
