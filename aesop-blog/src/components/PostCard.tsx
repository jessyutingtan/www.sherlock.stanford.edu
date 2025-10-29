import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Share2, Eye, Edit } from 'lucide-react';
import { Post } from '../types/database';
import { formatRelativeTime } from '../utils/date';
import { formatReadingTime } from '../utils/readingTime';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import ShareModal from './ShareModal';

interface PostCardProps {
  post: Post;
  onUpdate?: () => void;
}

export default function PostCard({ post, onUpdate }: PostCardProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [showShareModal, setShowShareModal] = useState(false);

  const isOwnPost = user?.id === post.author_id;

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;

    if (isLiked) {
      await supabase.from('likes').delete().match({ user_id: user.id, post_id: post.id });
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
    }
    onUpdate?.();
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;

    if (isBookmarked) {
      await supabase.from('bookmarks').delete().match({ user_id: user.id, post_id: post.id });
      setIsBookmarked(false);
    } else {
      await supabase.from('bookmarks').insert({ user_id: user.id, post_id: post.id });
      setIsBookmarked(true);
    }
    onUpdate?.();
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    setShowShareModal(true);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/write/${post.id}`);
  };

  return (
    <>
    <Link to={`/post/${post.id}`}>
      <article className="card p-6 hover:scale-[1.01] transition-transform">
        {/* Author info */}
        <div className="flex items-center gap-3 mb-4">
          <Link
            to={`/profile/${post.author?.username}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            {post.author?.avatar_url ? (
              <img
                src={post.author.avatar_url}
                alt={post.author.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-semibold">
                {post.author?.username[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-white">
                {post.author?.full_name || post.author?.username}
              </p>
              <p className="text-sm text-white">
                {formatRelativeTime(post.published_at || post.created_at)}
              </p>
            </div>
          </Link>
        </div>

        {/* Cover image */}
        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}

        {/* Title and excerpt */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="badge badge-primary"
                onClick={(e) => e.preventDefault()}
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-sm text-gray-500">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-blue-700">
          <div className="flex items-center gap-4 text-sm text-yellow-400 font-medium">
            {post.reading_time && (
              <span className="flex items-center gap-1">
                {formatReadingTime(post.reading_time)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isOwnPost && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              >
                <Edit className="w-5 h-5" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            )}

            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                isLiked
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments_count || 0}</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </article>
    </Link>

    {/* Share Modal */}
    <ShareModal
      isOpen={showShareModal}
      onClose={() => setShowShareModal(false)}
      postId={post.id}
      title={post.title}
      url={`${window.location.origin}/#/post/${post.id}`}
      onShareSuccess={onUpdate}
    />
  </>
  );
}
