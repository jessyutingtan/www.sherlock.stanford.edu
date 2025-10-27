import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Bookmark as BookmarkType, Post } from '../types/database';
import PostCard from '../components/PostCard';
import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  const { user } = useAuthStore();
  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(
          `
          *,
          post:posts(
            *,
            author:profiles!posts_author_id_fkey(*),
            likes_count:likes(count),
            comments_count:comments(count)
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format posts with user data
      const posts = await Promise.all(
        data?.map(async (bookmark) => {
          const post = bookmark.post;

          const { data: like } = await supabase
            .from('likes')
            .select('id')
            .eq('user_id', user.id)
            .eq('post_id', post.id)
            .single();

          return {
            ...post,
            is_liked: !!like,
            is_bookmarked: true,
            likes_count: post.likes_count?.[0]?.count || 0,
            comments_count: post.comments_count?.[0]?.count || 0,
          };
        }) || []
      );

      setBookmarks(posts as Post[]);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Bookmarks</h1>
          <p className="text-gray-600">Your saved posts for later reading</p>
        </div>

        {/* Bookmarks list */}
        <div className="space-y-6">
          {bookmarks.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={fetchBookmarks} />
          ))}
        </div>

        {bookmarks.length === 0 && (
          <div className="text-center py-12 card">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
            <p className="text-gray-600">
              Save posts you want to read later by clicking the bookmark icon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
