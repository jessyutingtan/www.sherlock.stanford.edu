import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/database';
import { TOPICS } from '../types/database';
import { Search, TrendingUp, Users } from 'lucide-react';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingTags, setTrendingTags] = useState<string[]>([]);
  const [topWriters, setTopWriters] = useState<Profile[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchTrendingTags();
    fetchTopWriters();
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
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for posts, topics, or tags..."
              className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="submit"
              disabled={searching}
              className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
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
                      <p className="font-semibold text-gray-900">
                        {writer.full_name || writer.username}
                      </p>
                      <p className="text-sm text-gray-500">@{writer.username}</p>
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

        {/* Popular Topics */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TOPICS.slice(0, 12).map((topic) => (
              <Link
                key={topic.value}
                to={`/feed?topic=${topic.value}`}
                className="card p-6 text-center hover:shadow-lg transition-shadow group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {topic.icon}
                </div>
                <p className="font-semibold text-gray-900">{topic.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
