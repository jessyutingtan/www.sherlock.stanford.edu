import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Post, Comment } from '../types/database';
import { formatDate } from '../utils/date';
import { formatReadingTime } from '../utils/readingTime';
import { Heart, MessageCircle, Bookmark, Share2, Eye, Send } from 'lucide-react';
import CommentThread from '../components/CommentThread';

export default function PostPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
      incrementViews();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(
          `
          *,
          author:profiles!posts_author_id_fkey(*)
        `
        )
        .eq('id', id)
        .single();

      if (error) throw error;

      // Get likes and bookmarks count
      const { count: likesCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', id);

      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', id);

      // Check if current user has liked/bookmarked
      let isLiked = false;
      let isBookmarked = false;

      if (user) {
        const { data: like } = await supabase
          .from('likes')
          .select('id')
          .eq('user_id', user.id)
          .eq('post_id', id)
          .single();

        const { data: bookmark } = await supabase
          .from('bookmarks')
          .select('id')
          .eq('user_id', user.id)
          .eq('post_id', id)
          .single();

        isLiked = !!like;
        isBookmarked = !!bookmark;
      }

      setPost({
        ...data,
        likes_count: likesCount || 0,
        comments_count: commentsCount || 0,
        is_liked: isLiked,
        is_bookmarked: isBookmarked,
      });
    } catch (error) {
      console.error('Error fetching post:', error);
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
        .eq('post_id', id)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const incrementViews = async () => {
    try {
      await supabase.rpc('increment', {
        row_id: id,
        x: 1,
        table_name: 'posts',
        column_name: 'views',
      });
    } catch (error) {
      // Ignore errors
    }
  };

  const handleLike = async () => {
    if (!user || !post) return;

    if (post.is_liked) {
      await supabase.from('likes').delete().match({ user_id: user.id, post_id: post.id });
      setPost({
        ...post,
        is_liked: false,
        likes_count: (post.likes_count || 0) - 1,
      });
    } else {
      await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
      setPost({
        ...post,
        is_liked: true,
        likes_count: (post.likes_count || 0) + 1,
      });
    }
  };

  const handleBookmark = async () => {
    if (!user || !post) return;

    if (post.is_bookmarked) {
      await supabase.from('bookmarks').delete().match({ user_id: user.id, post_id: post.id });
      setPost({ ...post, is_bookmarked: false });
    } else {
      await supabase.from('bookmarks').insert({ user_id: user.id, post_id: post.id });
      setPost({ ...post, is_bookmarked: true });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: post?.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim() || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('comments').insert({
        post_id: id,
        author_id: user.id,
        content: commentText.trim(),
      });

      if (error) throw error;

      setCommentText('');
      fetchComments();
      if (post) {
        setPost({
          ...post,
          comments_count: (post.comments_count || 0) + 1,
        });
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h1>
          <Link to="/feed" className="text-blue-600 hover:text-blue-700">
            Go back to feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Cover Image */}
        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-96 object-cover rounded-2xl mb-8 shadow-lg"
          />
        )}

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>

          {post.excerpt && <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>}

          {/* Author and meta */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link
              to={`/profile/${post.author?.username}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              {post.author?.avatar_url ? (
                <img
                  src={post.author.avatar_url}
                  alt={post.author.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-semibold text-lg">
                  {post.author?.username[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">
                  {post.author?.full_name || post.author?.username}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(post.published_at || post.created_at)}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              {post.reading_time && <span>{formatReadingTime(post.reading_time)}</span>}
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views}
              </span>
            </div>
          </div>
        </header>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span key={tag} className="badge badge-primary">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Actions */}
        <div className="flex items-center justify-between py-6 border-y border-gray-200 mb-12">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                post.is_liked
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-6 h-6 ${post.is_liked ? 'fill-current' : ''}`} />
              <span className="font-medium">{post.likes_count}</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <MessageCircle className="w-6 h-6" />
              <span className="font-medium">{post.comments_count}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                post.is_bookmarked
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Bookmark className={`w-6 h-6 ${post.is_bookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Comments */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({post.comments_count})
          </h2>

          {/* Comment form */}
          <form onSubmit={handleSubmitComment} className="mb-8 card p-6">
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

          {/* Comments list */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                postId={id!}
                onUpdate={fetchComments}
              />
            ))}
          </div>

          {comments.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </section>
      </article>
    </div>
  );
}
