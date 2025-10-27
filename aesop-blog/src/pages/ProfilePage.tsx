import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Profile, Post } from '../types/database';
import PostCard from '../components/PostCard';
import { Link as LinkIcon, Calendar, Users, Edit, LogOut } from 'lucide-react';
import { formatDate } from '../utils/date';

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser, signOut } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'drafts'>('posts');

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    fetchProfile();
  }, [username]);

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

      // Fetch posts
      await fetchPosts(profileData.id);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (userId: string) => {
    try {
      let query = supabase
        .from('posts')
        .select(
          `
          *,
          author:profiles!posts_author_id_fkey(*),
          likes_count:likes(count),
          comments_count:comments(count)
        `
        )
        .eq('author_id', userId);

      if (activeTab === 'posts') {
        query = query.eq('is_published', true);
      } else {
        query = query.eq('is_published', false);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Add user-specific data
      if (currentUser && data) {
        const postsWithUserData = await Promise.all(
          data.map(async (post) => {
            const { data: likes } = await supabase
              .from('likes')
              .select('id')
              .eq('user_id', currentUser.id)
              .eq('post_id', post.id)
              .single();

            const { data: bookmark } = await supabase
              .from('bookmarks')
              .select('id')
              .eq('user_id', currentUser.id)
              .eq('post_id', post.id)
              .single();

            return {
              ...post,
              is_liked: !!likes,
              is_bookmarked: !!bookmark,
              likes_count: post.likes_count?.[0]?.count || 0,
              comments_count: post.comments_count?.[0]?.count || 0,
            };
          })
        );

        setPosts(postsWithUserData as Post[]);
      } else {
        const formattedPosts = data?.map((post) => ({
          ...post,
          likes_count: post.likes_count?.[0]?.count || 0,
          comments_count: post.comments_count?.[0]?.count || 0,
        }));
        setPosts(formattedPosts as Post[]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
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
        await supabase
          .from('follows')
          .insert({ follower_id: currentUser.id, following_id: profile.id });
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
      {/* Header */}
      <div className="gradient-bg text-white">
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

              {profile.bio && <p className="text-white/90 mb-4 max-w-2xl">{profile.bio}</p>}

              <div className="flex flex-wrap gap-4 text-sm text-white/80">
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

              <div className="flex items-center gap-6 mt-4">
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
                    to="/write"
                    className="btn bg-white text-blue-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </Link>
                  <button
                    onClick={signOut}
                    className="btn bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`btn flex items-center gap-2 ${
                    isFollowing
                      ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                      : 'bg-white text-blue-600 hover:bg-gray-100'
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        {isOwnProfile && (
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab('posts');
                if (profile) fetchPosts(profile.id);
              }}
              className={`pb-3 px-1 font-semibold transition-colors ${
                activeTab === 'posts'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Published Posts
            </button>
            <button
              onClick={() => {
                setActiveTab('drafts');
                if (profile) fetchPosts(profile.id);
              }}
              className={`pb-3 px-1 font-semibold transition-colors ${
                activeTab === 'drafts'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Drafts
            </button>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={() => fetchPosts(profile.id)} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {activeTab === 'posts'
                ? 'No published posts yet.'
                : 'No drafts yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
