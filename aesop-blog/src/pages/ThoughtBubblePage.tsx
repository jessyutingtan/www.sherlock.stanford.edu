import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { ThoughtBubble, Comment } from '../types/database';
import { MOODS } from '../types/database';
import { formatRelativeTime } from '../utils/date';
import { Heart, MessageCircle, Share2, Eye, Send } from 'lucide-react';
import CommentThread from '../components/CommentThread';
import DynamicIcon from '../components/DynamicIcon';
import ShareModal from '../components/ShareModal';

export default function ThoughtBubblePage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [bubble, setBubble] = useState<ThoughtBubble | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBubble();
      fetchComments();
      incrementViews();
    }
  }, [id]);

  const fetchBubble = async () => {
    try {
      const { data, error } = await supabase
        .from('thought_bubbles')
        .select(
          `
          *,
          author:profiles!thought_bubbles_author_id_fkey(*)
        `
        )
        .eq('id', id)
        .single();

      if (error) throw error;

      // Get likes and comments count
      const { count: likesCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('thought_bubble_id', id);

      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('thought_bubble_id', id);

      // Check if current user has liked
      let isLiked = false;

      if (user) {
        const { data: like } = await supabase
          .from('likes')
          .select('id')
          .eq('user_id', user.id)
          .eq('thought_bubble_id', id)
          .single();

        isLiked = !!like;
      }

      setBubble({
        ...data,
        likes_count: likesCount || 0,
        comments_count: commentsCount || 0,
        is_liked: isLiked,
      });
    } catch (error) {
      console.error('Error fetching thought bubble:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(
          `
          *,
          author:profiles!comments_author_id_fkey(*)
        `
        )
        .eq('thought_bubble_id', id)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const incrementViews = async () => {
    if (!id) return;

    try {
      const { data: currentBubble } = await supabase
        .from('thought_bubbles')
        .select('views')
        .eq('id', id)
        .single();

      if (currentBubble) {
        await supabase
          .from('thought_bubbles')
          .update({ views: (currentBubble.views || 0) + 1 })
          .eq('id', id);
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handleLike = async () => {
    if (!user || !bubble) return;

    if (bubble.is_liked) {
      await supabase.from('likes').delete().match({ user_id: user.id, thought_bubble_id: bubble.id });
      setBubble({
        ...bubble,
        is_liked: false,
        likes_count: (bubble.likes_count || 0) - 1,
      });
    } else {
      await supabase.from('likes').insert({ user_id: user.id, thought_bubble_id: bubble.id });
      setBubble({
        ...bubble,
        is_liked: true,
        likes_count: (bubble.likes_count || 0) + 1,
      });
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim() || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('comments').insert({
        thought_bubble_id: id,
        author_id: user.id,
        content: commentText.trim(),
      });

      if (error) throw error;

      setCommentText('');
      fetchComments();
      fetchBubble();
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!bubble) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Thought Bubble not found</h1>
          <Link to="/feed" className="text-cyan-300 hover:text-cyan-200">
            Go back to feed
          </Link>
        </div>
      </div>
    );
  }

  const mood = MOODS.find(m => m.value === bubble.mood);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Thought Bubble Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${mood?.gradient} text-white shadow-xl mb-8`}>
          {/* Mood indicator */}
          <div className="absolute top-6 right-6 opacity-20">
            {mood && <DynamicIcon name={mood.icon} size={64} />}
          </div>

          {/* Author */}
          <Link
            to={`/profile/${bubble.author?.username}`}
            className="flex items-center gap-4 mb-6 hover:opacity-90 transition-opacity"
          >
            {bubble.author?.avatar_url ? (
              <img
                src={bubble.author.avatar_url}
                alt={bubble.author.username}
                className="w-14 h-14 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center font-semibold border-2 border-white/30 text-xl">
                {bubble.author?.username[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-lg">
                {bubble.author?.full_name || bubble.author?.username}
              </p>
              <p className="text-sm text-white/80">
                {formatRelativeTime(bubble.created_at)}
              </p>
            </div>
          </Link>

          {/* Content */}
          <p className="text-2xl leading-relaxed mb-6 relative z-10">
            {bubble.content}
          </p>

          {/* Stats and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
              {mood && <DynamicIcon name={mood.icon} size={40} />}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Eye className="w-5 h-5" />
                <span>{bubble.views || 0}</span>
              </div>

              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  bubble.is_liked
                    ? 'bg-white text-red-600'
                    : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                }`}
              >
                <Heart className={`w-5 h-5 ${bubble.is_liked ? 'fill-current' : ''}`} />
                <span className="font-medium">{bubble.likes_count || 0}</span>
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Comments ({bubble.comments_count || 0})
          </h2>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="input resize-none mb-3"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || submitting}
                className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">
                <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in
                </Link>{' '}
                to leave a comment
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentThread
                  key={comment.id}
                  comment={comment}
                  thoughtBubbleId={id}
                  onUpdate={() => {
                    fetchComments();
                    fetchBubble();
                  }}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        thoughtBubbleId={bubble.id}
        title={`Thought Bubble by ${bubble.author?.username}`}
        url={`${window.location.origin}/#/bubble/${bubble.id}`}
        onShareSuccess={fetchBubble}
      />
    </div>
  );
}
