import { Link } from 'react-router-dom';
import { Heart, Share2 } from 'lucide-react';
import { ThoughtBubble } from '../types/database';
import { MOODS } from '../types/database';
import { formatRelativeTime } from '../utils/date';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import DynamicIcon from './DynamicIcon';
import ShareModal from './ShareModal';

interface ThoughtBubbleCardProps {
  bubble: ThoughtBubble;
  onUpdate?: () => void;
}

export default function ThoughtBubbleCard({ bubble, onUpdate }: ThoughtBubbleCardProps) {
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(bubble.is_liked || false);
  const [likesCount, setLikesCount] = useState(bubble.likes_count || 0);
  const [showShareModal, setShowShareModal] = useState(false);

  const mood = MOODS.find(m => m.value === bubble.mood);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;

    if (isLiked) {
      await supabase.from('likes').delete().match({ user_id: user.id, thought_bubble_id: bubble.id });
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      await supabase.from('likes').insert({ user_id: user.id, thought_bubble_id: bubble.id });
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
    }
    onUpdate?.();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowShareModal(true);
  };

  return (
    <>
    <Link to={`/bubble/${bubble.id}`} className="block">
      <div className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${mood?.gradient} text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]`}>
        {/* Mood indicator */}
        <div className="absolute top-4 right-4 opacity-20">
          {mood && <DynamicIcon name={mood.icon} size={48} />}
        </div>

        {/* Author */}
        <Link
          to={`/profile/${bubble.author?.username}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity"
        >
          {bubble.author?.avatar_url ? (
            <img
              src={bubble.author.avatar_url}
              alt={bubble.author.username}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold border-2 border-white/30">
              {bubble.author?.username[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <p className="font-semibold">
              {bubble.author?.full_name || bubble.author?.username}
            </p>
            <p className="text-sm text-white/80">
              {formatRelativeTime(bubble.created_at)}
            </p>
          </div>
        </Link>

        {/* Content */}
        <p className="text-lg leading-relaxed mb-4 relative z-10">
          {bubble.content}
        </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
          {mood && <DynamicIcon name={mood.icon} size={32} />}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleLike(e);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              isLiked
                ? 'bg-white text-red-600'
                : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              handleShare(e);
            }}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    </Link>

    {/* Share Modal */}
    <ShareModal
      isOpen={showShareModal}
      onClose={() => setShowShareModal(false)}
      thoughtBubbleId={bubble.id}
      title={`Thought Bubble by ${bubble.author?.username}`}
      url={`${window.location.origin}/#/feed`}
      onShareSuccess={onUpdate}
    />
  </>
  );
}
