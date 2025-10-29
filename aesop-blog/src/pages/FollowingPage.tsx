import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Follow, Profile } from '../types/database';
import { User, Loader, UserCheck } from 'lucide-react';

interface FollowingWithProfile extends Follow {
  following: Profile;
  has_new_content: boolean;
}

export default function FollowingPage() {
  const { user } = useAuthStore();
  const [following, setFollowing] = useState<FollowingWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFollowing();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchFollowing = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch all users the current user follows
      const { data: followsData, error: followsError } = await supabase
        .from('follows')
        .select('*, following:profiles!follows_following_id_fkey(*)')
        .eq('follower_id', user.id)
        .order('created_at', { ascending: false });

      if (followsError) throw followsError;

      // Check for new content for each followed user
      const followingWithNewContent = await Promise.all(
        (followsData || []).map(async (follow) => {
          const hasNew = await checkForNewContent(
            follow.following_id,
            follow.last_checked_at || follow.created_at
          );

          return {
            ...follow,
            has_new_content: hasNew,
          } as FollowingWithProfile;
        })
      );

      setFollowing(followingWithNewContent);
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkForNewContent = async (
    authorId: string,
    lastChecked: string
  ): Promise<boolean> => {
    try {
      // Check for new posts
      const { data: newPosts } = await supabase
        .from('posts')
        .select('id')
        .eq('author_id', authorId)
        .eq('is_published', true)
        .gt('published_at', lastChecked)
        .limit(1);

      if (newPosts && newPosts.length > 0) return true;

      // Check for new thought bubbles
      const { data: newBubbles } = await supabase
        .from('thought_bubbles')
        .select('id')
        .eq('author_id', authorId)
        .gt('created_at', lastChecked)
        .limit(1);

      if (newBubbles && newBubbles.length > 0) return true;

      return false;
    } catch (error) {
      console.error('Error checking for new content:', error);
      return false;
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    // Subscribe to new posts from followed users
    const postsSubscription = supabase
      .channel('following-posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
          filter: `is_published=eq.true`,
        },
        (payload) => {
          // Check if the new post is from someone we follow
          setFollowing((prev) =>
            prev.map((follow) =>
              follow.following_id === payload.new.author_id
                ? { ...follow, has_new_content: true }
                : follow
            )
          );
        }
      )
      .subscribe();

    // Subscribe to new thought bubbles from followed users
    const bubblesSubscription = supabase
      .channel('following-bubbles')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'thought_bubbles',
        },
        (payload) => {
          setFollowing((prev) =>
            prev.map((follow) =>
              follow.following_id === payload.new.author_id
                ? { ...follow, has_new_content: true }
                : follow
            )
          );
        }
      )
      .subscribe();

    return () => {
      postsSubscription.unsubscribe();
      bubblesSubscription.unsubscribe();
    };
  };

  const handleVisitProfile = async (followId: string) => {
    // Update last_checked_at when user clicks on a followed user
    try {
      await supabase
        .from('follows')
        .update({ last_checked_at: new Date().toISOString() })
        .eq('id', followId);

      // Update local state to remove red dot
      setFollowing((prev) =>
        prev.map((follow) =>
          follow.id === followId ? { ...follow, has_new_content: false } : follow
        )
      );
    } catch (error) {
      console.error('Error updating last_checked_at:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-blue-600 mb-2 flex items-center gap-3">
            <UserCheck className="w-10 h-10 text-blue-900" />
            Following
          </h1>
          <p className="text-gray-900 text-lg font-semibold">
            Authors you follow • {following.length} total
          </p>
        </div>

        {/* Following List */}
        {following.length === 0 ? (
          <div className="card p-12 text-center">
            <User className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Not following anyone yet
            </h2>
            <p className="text-cyan-300 mb-6">
              Follow authors to see their latest content here
            </p>
            <Link
              to="/explore"
              className="btn btn-primary inline-block px-6 py-3 text-lg"
            >
              Discover Authors
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {following.map((follow) => (
              <Link
                key={follow.id}
                to={`/profile/${follow.following.username}`}
                onClick={() => handleVisitProfile(follow.id)}
                className="card p-6 flex items-center gap-6 hover:scale-[1.02] transition-all group"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {follow.following.avatar_url ? (
                    <img
                      src={follow.following.avatar_url}
                      alt={follow.following.username}
                      className="w-20 h-20 rounded-full object-cover border-4 border-cyan-500/50 group-hover:border-cyan-400 transition-colors"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center border-4 border-cyan-500/50 group-hover:border-cyan-400 transition-colors">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}

                  {/* Red dot indicator for new content */}
                  {follow.has_new_content && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-cyber-900 animate-pulse shadow-lg shadow-red-500/50">
                      <div className="absolute inset-0 bg-red-400 rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {follow.following.username}
                    </h3>
                    {follow.has_new_content && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex-shrink-0">
                        NEW
                      </span>
                    )}
                  </div>
                  {follow.following.full_name && (
                    <p className="text-cyan-200 mb-2 truncate">
                      {follow.following.full_name}
                    </p>
                  )}
                  {follow.following.bio && (
                    <p className="text-cyan-300/80 text-sm line-clamp-2">
                      {follow.following.bio}
                    </p>
                  )}
                </div>

                {/* Arrow indicator */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/40 transition-colors">
                    <svg
                      className="w-5 h-5 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
