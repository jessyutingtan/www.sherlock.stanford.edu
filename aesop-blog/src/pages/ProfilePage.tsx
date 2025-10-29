import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Profile, Post, ThoughtBubble, Share } from '../types/database';
import PostCard from '../components/PostCard';
import ThoughtBubbleCard from '../components/ThoughtBubbleCard';
import SharedPostCard from '../components/SharedPostCard';
import {
  Link as LinkIcon,
  Calendar,
  Users,
  Edit,
  LogOut,
  FileText,
  MessageCircle,
  Eye,
  TrendingUp,
  Share2,
} from 'lucide-react';
import { formatDate } from '../utils/date';

type ContentTab = 'all' | 'posts' | 'bubbles' | 'shares';

export default function UserProfilePage() {
  const { username } = useParams();
  const { user: currentUser, signOut } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [bubbles, setBubbles] = useState<ThoughtBubble[]>([]);
  const [shares, setShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<ContentTab>('all');
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalBubbles: 0,
    totalShares: 0,
    totalViews: 0,
    totalLikes: 0,
  });

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    fetchProfile();
  }, [username]);

  useEffect(() => {
    if (profile) {
      fetchContent();
    }
  }, [profile, activeTab]);

  const fetchProfile = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch followers/following counts
      const { count: followersCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profileData.id);

      const { count: followingCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profileData.id);

      setFollowersCount(followersCount || 0);
      setFollowingCount(followingCount || 0);

      // Check if current user is following
      if (currentUser && !isOwnProfile) {
        const { data: follow } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', currentUser.id)
          .eq('following_id', profileData.id)
          .single();

        setIsFollowing(!!follow);
      }

      // Fetch user stats
      await fetchStats(profileData.id);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (userId: string) => {
    try {
      // Count posts
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', userId)
        .eq('is_published', true);

      // Count bubbles
      const { count: bubblesCount } = await supabase
        .from('thought_bubbles')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', userId);

      // Count shares
      const { count: sharesCount } = await supabase
        .from('shares')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Sum views from posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('views')
        .eq('author_id', userId)
        .eq('is_published', true);

      // Sum views from bubbles
      const { data: bubblesData } = await supabase
        .from('thought_bubbles')
        .select('views')
        .eq('author_id', userId);

      const postViews = postsData?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
      const bubbleViews = bubblesData?.reduce((sum, b) => sum + (b.views || 0), 0) || 0;

      // Count total likes
      const { count: likesCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .or(`post_id.in.(${postsData?.map(() => 'id').join(',')}),thought_bubble_id.in.(${bubblesData?.map(() => 'id').join(',')})`)
        .eq('user_id', userId);

      setStats({
        totalPosts: postsCount || 0,
        totalBubbles: bubblesCount || 0,
        totalShares: sharesCount || 0,
        totalViews: postViews + bubbleViews,
        totalLikes: likesCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchContent = async () => {
    if (!profile) return;

    try {
      if (activeTab === 'all' || activeTab === 'posts') {
        await fetchPosts(profile.id);
      }
      if (activeTab === 'all' || activeTab === 'bubbles') {
        await fetchBubbles(profile.id);
      }
      if (activeTab === 'shares') {
        await fetchShares(profile.id);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const fetchPosts = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(
          `
          *,
          author:profiles!posts_author_id_fkey(*),
          likes_count:likes(count),
          comments_count:comments(count),
          shares_count:shares(count)
        `
        )
        .eq('author_id', userId)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;

      const formattedPosts =
        data?.map((post) => ({
          ...post,
          likes_count: post.likes_count?.[0]?.count || 0,
          comments_count: post.comments_count?.[0]?.count || 0,
          shares_count: post.shares_count?.[0]?.count || 0,
        })) || [];

      setPosts(formattedPosts as Post[]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchBubbles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('thought_bubbles')
        .select(
          `
          *,
          author:profiles!thought_bubbles_author_id_fkey(*),
          likes_count:likes(count),
          shares_count:shares(count)
        `
        )
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedBubbles =
        data?.map((bubble) => ({
          ...bubble,
          likes_count: bubble.likes_count?.[0]?.count || 0,
          shares_count: bubble.shares_count?.[0]?.count || 0,
        })) || [];

      setBubbles(formattedBubbles as ThoughtBubble[]);
    } catch (error) {
      console.error('Error fetching bubbles:', error);
    }
  };

  const fetchShares = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('shares')
        .select(
          `
          *,
          user:profiles!shares_user_id_fkey(*),
          post:posts(*,
            author:profiles!posts_author_id_fkey(*),
            likes_count:likes(count),
            comments_count:comments(count),
            shares_count:shares(count)
          ),
          thought_bubble:thought_bubbles(*,
            author:profiles!thought_bubbles_author_id_fkey(*),
            likes_count:likes(count),
            shares_count:shares(count)
          )
        `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedShares =
        data?.map((share) => ({
          ...share,
          post: share.post
            ? {
                ...share.post,
                likes_count: share.post.likes_count?.[0]?.count || 0,
                comments_count: share.post.comments_count?.[0]?.count || 0,
                shares_count: share.post.shares_count?.[0]?.count || 0,
              }
            : null,
          thought_bubble: share.thought_bubble
            ? {
                ...share.thought_bubble,
                likes_count: share.thought_bubble.likes_count?.[0]?.count || 0,
                shares_count: share.thought_bubble.shares_count?.[0]?.count || 0,
              }
            : null,
        })) || [];

      setShares(formattedShares as Share[]);
    } catch (error) {
      console.error('Error fetching shares:', error);
    }
  };

  const handleFollow = async () => {
    if (!currentUser || !profile) return;

    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .match({ follower_id: currentUser.id, following_id: profile.id });
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
      } else {
        await supabase.from('follows').insert({
          follower_id: currentUser.id,
          following_id: profile.id,
        });
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h1>
          <Link to="/feed" className="text-blue-600 hover:text-blue-700">
            Go back to feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      {profile.background_image && (
        <div className="h-64 w-full relative">
          <img
            src={profile.background_image}
            alt="Profile background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      )}

      {/* Header */}
      <div
        className={`${
          profile.background_image
            ? '-mt-32 relative'
            : 'gradient-bg'
        } text-white`}
      >
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-blue-600 text-5xl font-bold border-4 border-white shadow-lg">
                {profile.username[0].toUpperCase()}
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">
                {profile.full_name || profile.username}
              </h1>
              <p className="text-white/80 text-lg mb-4">@{profile.username}</p>

              {profile.bio && (
                <p className="text-white/90 mb-4 max-w-2xl">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-white/80 mb-4">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(profile.created_at)}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <span className="font-bold text-2xl">{followersCount}</span>
                  <span className="text-white/80 ml-2">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-2xl">{followingCount}</span>
                  <span className="text-white/80 ml-2">Following</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {isOwnProfile ? (
                <>
                  <Link
                    to="/profile/edit"
                    className="btn bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2 shadow-lg border-2 border-white"
                  >
                    <Edit className="w-5 h-5" />
                    <span className="font-bold">Edit Profile</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="btn bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2 shadow-lg border-2 border-white"
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold">Dashboard</span>
                  </Link>
                  <button
                    onClick={signOut}
                    className="btn bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2 shadow-lg border-2 border-white"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-bold">Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`btn flex items-center gap-2 ${
                    isFollowing
                      ? 'bg-gray-900 text-white hover:bg-gray-800 border-2 border-white'
                      : 'bg-gray-900 text-white hover:bg-gray-800 border-2 border-white'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalPosts}</div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalBubbles}</div>
                <div className="text-sm text-gray-600">Bubbles</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <Share2 className="w-8 h-8 text-cyan-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalShares}</div>
                <div className="text-sm text-gray-600">Shared</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalViews.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalLikes.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Likes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-1 font-semibold transition-colors ${
              activeTab === 'all'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Content
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3 px-1 font-semibold transition-colors ${
              activeTab === 'posts'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Posts ({stats.totalPosts})
          </button>
          <button
            onClick={() => setActiveTab('bubbles')}
            className={`pb-3 px-1 font-semibold transition-colors ${
              activeTab === 'bubbles'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Thought Bubbles ({stats.totalBubbles})
          </button>
          <button
            onClick={() => setActiveTab('shares')}
            className={`pb-3 px-1 font-semibold transition-colors ${
              activeTab === 'shares'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Shared ({stats.totalShares})
          </button>
        </div>

        {/* Content Feed */}
        <div className="space-y-6">
          {(activeTab === 'all' || activeTab === 'posts') &&
            posts.map((post) => (
              <PostCard key={post.id} post={post} onUpdate={fetchContent} />
            ))}

          {(activeTab === 'all' || activeTab === 'bubbles') &&
            bubbles.map((bubble) => (
              <ThoughtBubbleCard
                key={bubble.id}
                bubble={bubble}
                onUpdate={fetchContent}
              />
            ))}

          {activeTab === 'shares' &&
            shares.map((share) => (
              <SharedPostCard key={share.id} share={share} onUpdate={fetchContent} />
            ))}

          {((activeTab === 'posts' && posts.length === 0) ||
            (activeTab === 'bubbles' && bubbles.length === 0) ||
            (activeTab === 'shares' && shares.length === 0) ||
            (activeTab === 'all' && posts.length === 0 && bubbles.length === 0)) && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {activeTab === 'posts'
                  ? 'No posts yet.'
                  : activeTab === 'bubbles'
                  ? 'No thought bubbles yet.'
                  : activeTab === 'shares'
                  ? 'No shared content yet.'
                  : 'No content yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
