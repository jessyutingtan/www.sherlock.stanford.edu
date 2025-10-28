import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Post, ThoughtBubble } from '../types/database';
import { Edit2, Trash2, Eye, Heart, MessageSquare, Tag, Calendar, Share2, FileText, MessageCircle } from 'lucide-react';
import { formatDate } from '../utils/date';

type ContentType = 'posts' | 'bubbles';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ContentType>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [bubbles, setBubbles] = useState<ThoughtBubble[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchContent();
  }, [user, activeTab]);

  const fetchContent = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (activeTab === 'posts') {
        await fetchPosts();
      } else {
        await fetchBubbles();
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(*),
        likes_count:likes(count),
        comments_count:comments(count),
        shares_count:shares(count)
      `)
      .eq('author_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    const formattedPosts = data?.map((post) => ({
      ...post,
      likes_count: post.likes_count?.[0]?.count || 0,
      comments_count: post.comments_count?.[0]?.count || 0,
      shares_count: post.shares_count?.[0]?.count || 0,
    })) || [];

    setPosts(formattedPosts as Post[]);
  };

  const fetchBubbles = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('thought_bubbles')
      .select(`
        *,
        author:profiles!thought_bubbles_author_id_fkey(*),
        likes_count:likes(count),
        shares_count:shares(count)
      `)
      .eq('author_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bubbles:', error);
      return;
    }

    const formattedBubbles = data?.map((bubble) => ({
      ...bubble,
      likes_count: bubble.likes_count?.[0]?.count || 0,
      shares_count: bubble.shares_count?.[0]?.count || 0,
    })) || [];

    setBubbles(formattedBubbles as ThoughtBubble[]);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleDeleteBubble = async (bubbleId: string) => {
    if (!confirm('Are you sure you want to delete this thought bubble? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('thought_bubbles')
        .delete()
        .eq('id', bubbleId);

      if (error) throw error;

      setBubbles(bubbles.filter(b => b.id !== bubbleId));
    } catch (error) {
      console.error('Error deleting bubble:', error);
      alert('Failed to delete thought bubble');
    }
  };

  const handleEditPost = (postId: string) => {
    navigate(`/write?edit=${postId}`);
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage all your content in one place</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'posts'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              Blog Posts ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('bubbles')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'bubbles'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              Thought Bubbles ({bubbles.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'posts' ? (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-6">Start writing your first blog post!</p>
                <Link
                  to="/write"
                  className="btn bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2"
                >
                  <Edit2 className="w-5 h-5" />
                  Create Post
                </Link>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <Link
                        to={`/post/${post.id}`}
                        className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors block mb-2"
                      >
                        {post.title}
                      </Link>

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.is_published ? 'Published' : 'Draft'} {formatDate(post.published_at || post.created_at)}
                        </span>
                        {post.updated_at !== post.created_at && (
                          <span className="flex items-center gap-1">
                            <Edit2 className="w-4 h-4" />
                            Updated {formatDate(post.updated_at)}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Eye className="w-4 h-4" />
                          {post.views || 0} views
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <Heart className="w-4 h-4" />
                          {post.likes_count || 0} likes
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <MessageSquare className="w-4 h-4" />
                          {post.comments_count || 0} comments
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <Share2 className="w-4 h-4" />
                          {post.shares_count || 0} shares
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditPost(post.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit post"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {bubbles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No thought bubbles yet</h3>
                <p className="text-gray-600 mb-6">Share your quick thoughts with the community!</p>
                <Link
                  to="/feed"
                  className="btn bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Create Thought Bubble
                </Link>
              </div>
            ) : (
              bubbles.map((bubble) => (
                <div
                  key={bubble.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Content */}
                      <p className="text-gray-900 mb-4 text-lg">{bubble.content}</p>

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(bubble.created_at)}
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-semibold">
                          {bubble.mood}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Eye className="w-4 h-4" />
                          {bubble.views || 0} views
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <Heart className="w-4 h-4" />
                          {bubble.likes_count || 0} likes
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <Share2 className="w-4 h-4" />
                          {bubble.shares_count || 0} shares
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteBubble(bubble.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete thought bubble"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
