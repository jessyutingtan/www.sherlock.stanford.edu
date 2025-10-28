import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Profile, Post, ThoughtBubble } from '../types/database';
import { Search, TrendingUp, Users, FileText, MessageCircle, Clock } from 'lucide-react';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingTags, setTrendingTags] = useState<string[]>([]);
  const [topWriters, setTopWriters] = useState<Profile[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [recentThoughts, setRecentThoughts] = useState<ThoughtBubble[]>([]);

  useEffect(() => {
    fetchTrendingTags();
    fetchTopWriters();
    fetchRecentContent();
  }, []);

  const fetchTrendingTags = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('tags')
        .eq('is_published', true)
        .limit(100);

      if (error) throw error;

      const allTags: string[] = [];
      data?.forEach((post) => {
        if (post.tags) {
          allTags.push(...post.tags);
        }
      });

      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sorted = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag]) => tag);

      setTrendingTags(sorted);
    } catch (error) {
      console.error('Error fetching trending tags:', error);
    }
  };

  const fetchTopWriters = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(
          `
          *,
          posts(count)
        `
        )
        .limit(10);

      if (error) throw error;

      const sorted = data
        ?.sort((a, b) => (b.posts?.[0]?.count || 0) - (a.posts?.[0]?.count || 0))
        .slice(0, 10);

      setTopWriters(sorted || []);
    } catch (error) {
      console.error('Error fetching top writers:', error);
    }
  };

  const fetchRecentContent = async () => {
    try {
      // Fetch recent posts
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*, author:profiles!posts_author_id_fkey(*)')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(10);

      if (postsError) throw postsError;
      setRecentPosts(posts || []);

      // Fetch recent thought bubbles
      const { data: thoughts, error: thoughtsError } = await supabase
        .from('thought_bubbles')
        .select('*, author:profiles!thought_bubbles_author_id_fkey(*)')
        .order('created_at', { ascending: false })
        .limit(10);

      if (thoughtsError) throw thoughtsError;
      setRecentThoughts(thoughts || []);
    } catch (error) {
      console.error('Error fetching recent content:', error);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const { data: posts, error } = await supabase
        .from('posts')
        .select(
          `
          *,
          author:profiles!posts_author_id_fkey(*)
        `
        )
        .eq('is_published', true)
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .limit(20);

      if (error) throw error;
      setSearchResults(posts || []);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Explore</h1>
          <p className="text-gray-600">Discover trending topics and top writers</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for posts, topics, or tags..."
              className="w-full pl-14 pr-48 py-4 text-lg text-gray-900 bg-white border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-text placeholder:text-gray-400"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="btn btn-secondary text-sm"
                >
                  Clear Search
                </button>
              )}
              <button
                type="submit"
                disabled={searching}
                className="btn btn-primary"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Search className="w-6 h-6" />
              Search Results ({searchResults.length})
            </h2>
            <div className="grid gap-4">
              {searchResults.map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="card p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                  {post.excerpt && <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>}
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <span>By {post.author?.full_name || post.author?.username}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Trending Tags */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Trending Tags
            </h2>
            <div className="card p-6">
              <div className="flex flex-wrap gap-3">
                {trendingTags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/feed?tag=${tag}`}
                    className="badge badge-primary text-base px-4 py-2 hover:scale-105 transition-transform"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              {trendingTags.length === 0 && (
                <p className="text-gray-500 text-center py-4">No trending tags yet</p>
              )}
            </div>
          </div>

          {/* Top Writers */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Top Writers
            </h2>
            <div className="card p-6">
              <div className="space-y-4">
                {topWriters.map((writer) => (
                  <Link
                    key={writer.id}
                    to={`/profile/${writer.username}`}
                    className="flex items-center gap-3 hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  >
                    {writer.avatar_url ? (
                      <img
                        src={writer.avatar_url}
                        alt={writer.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-semibold">
                        {writer.username[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-white">
                        {writer.full_name || writer.username}
                      </p>
                      <p className="text-sm text-orange-500">@{writer.username}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {topWriters.length === 0 && (
                <p className="text-gray-500 text-center py-4">No writers yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recently Published Content */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Published</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Recent Blog Posts */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Latest Articles
              </h3>
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="card p-4 hover:shadow-md transition-shadow block"
                  >
                    <h4 className="font-semibold text-white mb-2 line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-white">
                      <span className="font-medium text-orange-500">
                        {post.author?.full_name || post.author?.username}
                      </span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateTime(post.published_at || post.created_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                {recentPosts.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No recent posts</p>
                )}
              </div>
            </div>

            {/* Recent Thought Bubbles */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Latest Thought Bubbles
              </h3>
              <div className="space-y-3">
                {recentThoughts.map((thought) => (
                  <div
                    key={thought.id}
                    className="card p-4 hover:shadow-md transition-shadow"
                  >
                    <p className="text-white mb-2 line-clamp-3">
                      {thought.content}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-white">
                      <span className="font-medium text-orange-500">
                        {thought.author?.full_name || thought.author?.username}
                      </span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateTime(thought.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {recentThoughts.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No recent thought bubbles</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
