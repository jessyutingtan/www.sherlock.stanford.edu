import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Post, ThoughtBubble, COMMUNITIES, TOPICS } from '../types/database';
import PostCard from '../components/PostCard';
import ThoughtBubbleCard from '../components/ThoughtBubbleCard';
import CreateThoughtBubble from '../components/CreateThoughtBubble';
import DynamicIcon from '../components/DynamicIcon';
import { Sparkles, TrendingUp, Users as UsersIcon, Filter, Grid } from 'lucide-react';

type FeedFilter = 'latest' | 'trending' | 'following';
type ContentType = 'articles' | 'thoughts';

export default function FeedPage() {
  const { user } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('latest');
  const [contentType, setContentType] = useState<ContentType>('articles');
  const [posts, setPosts] = useState<Post[]>([]);
  const [thoughts, setThoughts] = useState<ThoughtBubble[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { ref: loadMoreRef, inView } = useInView();

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchContent();
  }, [activeFilter, contentType, selectedCommunities, selectedTopics]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView]);

  const fetchContent = async () => {
    setLoading(true);
    setPage(0);

    if (contentType === 'articles') {
      await fetchPosts(0);
    } else {
      await fetchThoughts(0);
    }

    setLoading(false);
  };

  const fetchPosts = async (pageNum: number) => {
    try {
      let query = supabase
        .from('posts')
        .select(
          `
          *,
          author:profiles!posts_author_id_fkey(*),
          likes_count:likes(count),
          comments_count:comments(count)
        `,
          { count: 'exact' }
        )
        .eq('is_published', true)
        .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);

      // Apply community filter
      if (selectedCommunities.length > 0) {
        query = query.overlaps('communities', selectedCommunities);
      }

      // Apply topic filter
      if (selectedTopics.length > 0) {
        query = query.overlaps('topics', selectedTopics);
      }

      // Apply feed filter
      if (activeFilter === 'latest') {
        query = query.order('published_at', { ascending: false });
      } else if (activeFilter === 'trending') {
        query = query.order('views', { ascending: false });
      } else if (activeFilter === 'following' && user) {
        const { data: following } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id);

        const followingIds = following?.map((f) => f.following_id) || [];
        if (followingIds.length > 0) {
          query = query.in('author_id', followingIds);
        } else {
          setPosts([]);
          setHasMore(false);
          return;
        }
        query = query.order('published_at', { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) throw error;

      // Check if user has liked/bookmarked each post
      if (user && data) {
        const postsWithUserData = await Promise.all(
          data.map(async (post) => {
            const { data: likes } = await supabase
              .from('likes')
              .select('id')
              .eq('user_id', user.id)
              .eq('post_id', post.id)
              .single();

            const { data: bookmark } = await supabase
              .from('bookmarks')
              .select('id')
              .eq('user_id', user.id)
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

        if (pageNum === 0) {
          setPosts(postsWithUserData as Post[]);
        } else {
          setPosts((prev) => [...prev, ...(postsWithUserData as Post[])]);
        }
      } else {
        const formattedPosts = data?.map((post) => ({
          ...post,
          likes_count: post.likes_count?.[0]?.count || 0,
          comments_count: post.comments_count?.[0]?.count || 0,
        }));

        if (pageNum === 0) {
          setPosts(formattedPosts as Post[]);
        } else {
          setPosts((prev) => [...prev, ...(formattedPosts as Post[])]);
        }
      }

      setHasMore((count || 0) > (pageNum + 1) * ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchThoughts = async (pageNum: number) => {
    try {
      let query = supabase
        .from('thought_bubbles')
        .select(
          `
          *,
          author:profiles!thought_bubbles_author_id_fkey(*),
          likes_count:likes(count)
        `,
          { count: 'exact' }
        )
        .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1)
        .order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      // Check if user has liked each thought
      if (user && data) {
        const thoughtsWithUserData = await Promise.all(
          data.map(async (thought) => {
            const { data: likes } = await supabase
              .from('likes')
              .select('id')
              .eq('user_id', user.id)
              .eq('thought_bubble_id', thought.id)
              .single();

            return {
              ...thought,
              is_liked: !!likes,
              likes_count: thought.likes_count?.[0]?.count || 0,
            };
          })
        );

        if (pageNum === 0) {
          setThoughts(thoughtsWithUserData as ThoughtBubble[]);
        } else {
          setThoughts((prev) => [...prev, ...(thoughtsWithUserData as ThoughtBubble[])]);
        }
      } else {
        const formattedThoughts = data?.map((thought) => ({
          ...thought,
          likes_count: thought.likes_count?.[0]?.count || 0,
        }));

        if (pageNum === 0) {
          setThoughts(formattedThoughts as ThoughtBubble[]);
        } else {
          setThoughts((prev) => [...prev, ...(formattedThoughts as ThoughtBubble[])]);
        }
      }

      setHasMore((count || 0) > (pageNum + 1) * ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching thoughts:', error);
    }
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);

    if (contentType === 'articles') {
      await fetchPosts(nextPage);
    } else {
      await fetchThoughts(nextPage);
    }
  };

  const toggleCommunityFilter = (community: string) => {
    setSelectedCommunities((prev) =>
      prev.includes(community) ? prev.filter((c) => c !== community) : [...prev, community]
    );
  };

  const toggleTopicFilter = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Your Feed</h1>
          <p className="text-gray-600">Discover amazing content from your community</p>
        </div>

        {/* Content Type Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setContentType('articles')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              contentType === 'articles'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg border-4 border-yellow-400'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-300'
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => setContentType('thoughts')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              contentType === 'thoughts'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg border-4 border-yellow-400'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-300'
            }`}
          >
            Thought Bubbles
          </button>
        </div>

        {/* Create Thought Bubble */}
        {contentType === 'thoughts' && (
          <div className="mb-6">
            <CreateThoughtBubble onCreated={fetchContent} />
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setActiveFilter('latest')}
              className={`btn ${
                activeFilter === 'latest' ? 'btn-primary' : 'btn-secondary'
              } flex items-center gap-2`}
            >
              <Sparkles className="w-5 h-5" />
              Latest
            </button>
            <button
              onClick={() => setActiveFilter('trending')}
              className={`btn ${
                activeFilter === 'trending' ? 'btn-primary' : 'btn-secondary'
              } flex items-center gap-2`}
            >
              <TrendingUp className="w-5 h-5" />
              Trending
            </button>
            <button
              onClick={() => setActiveFilter('following')}
              className={`btn ${
                activeFilter === 'following' ? 'btn-primary' : 'btn-secondary'
              } flex items-center gap-2`}
            >
              <UsersIcon className="w-5 h-5" />
              Following
            </button>
            {contentType === 'articles' && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 ml-auto px-4 py-2 rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-all"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            )}
          </div>

          {/* Community and Topic Filters */}
          {showFilters && contentType === 'articles' && (
            <div className="card p-6 mb-6 animate-slide-down">
              <div className="mb-6">
                <h3 className="font-semibold text-cyber-100 mb-3">Communities</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCommunities([])}
                    className={`badge flex items-center gap-2 ${
                      selectedCommunities.length === 0
                        ? 'badge-primary'
                        : 'bg-cyber-800/30 text-white border-cyber-700/30'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    All
                  </button>
                  {COMMUNITIES.map((community) => (
                    <button
                      key={community.value}
                      onClick={() => toggleCommunityFilter(community.value)}
                      className={`badge flex items-center gap-2 ${
                        selectedCommunities.includes(community.value)
                          ? 'bg-orange-500 text-white border-2 border-yellow-400'
                          : 'bg-cyber-800/30 text-white border-cyber-700/30'
                      }`}
                    >
                      <DynamicIcon name={community.icon} size={16} />
                      {community.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-cyber-100 mb-3">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTopics([])}
                    className={`badge flex items-center gap-2 ${
                      selectedTopics.length === 0
                        ? 'badge-cyan'
                        : 'bg-cyber-800/30 text-white border-cyber-700/30'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    All
                  </button>
                  {TOPICS.map((topic) => (
                    <button
                      key={topic.value}
                      onClick={() => toggleTopicFilter(topic.value)}
                      className={`badge flex items-center gap-2 ${
                        selectedTopics.includes(topic.value)
                          ? 'bg-orange-500 text-white border-2 border-yellow-400'
                          : 'bg-cyber-800/30 text-white border-cyber-700/30'
                      }`}
                    >
                      <DynamicIcon name={topic.icon} size={16} />
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>

              {(selectedCommunities.length > 0 || selectedTopics.length > 0) && (
                <button
                  onClick={() => {
                    setSelectedCommunities([]);
                    setSelectedTopics([]);
                  }}
                  className="mt-4 text-sm text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {loading && page === 0 ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 loading-shimmer h-64"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {contentType === 'articles'
                ? posts.map((post) => (
                    <PostCard key={post.id} post={post} onUpdate={fetchContent} />
                  ))
                : thoughts.map((thought) => (
                    <ThoughtBubbleCard
                      key={thought.id}
                      bubble={thought}
                      onUpdate={fetchContent}
                    />
                  ))}
            </div>

            {/* Load more trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              </div>
            )}

            {!hasMore && (contentType === 'articles' ? posts.length : thoughts.length) > 0 && (
              <p className="text-center text-gray-500 py-8">
                You've reached the end!
              </p>
            )}

            {!loading &&
              (contentType === 'articles' ? posts.length : thoughts.length) === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    {contentType === 'articles'
                      ? 'No posts found. Try adjusting your filters.'
                      : 'No thought bubbles yet. Be the first to share!'}
                  </p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
