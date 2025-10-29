import { useState } from 'react';
import { X, Link as LinkIcon, Share2, MessageSquare, Twitter, Facebook, Linkedin, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
  thoughtBubbleId?: string;
  title: string;
  url: string;
  onShareSuccess?: () => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  postId,
  thoughtBubbleId,
  title,
  url,
  onShareSuccess,
}: ShareModalProps) {
  const { user } = useAuthStore();
  const [shareComment, setShareComment] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const handleInternalShare = async () => {
    if (!user) return;

    try {
      setIsSharing(true);

      const { error } = await supabase.from('shares').insert({
        user_id: user.id,
        post_id: postId || null,
        thought_bubble_id: thoughtBubbleId || null,
        comment: shareComment.trim() || null,
      });

      if (error) throw error;

      onShareSuccess?.();
      onClose();
      setShareComment('');
      alert('Shared to your profile successfully!');
    } catch (error: any) {
      console.error('Error sharing:', error);
      if (error.message?.includes('duplicate')) {
        alert('You have already shared this content!');
      } else {
        alert('Failed to share. Please try again.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleExternalShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-cyber-900 to-cyber-950 rounded-2xl shadow-2xl max-w-lg w-full border border-cyan-500/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-cyan-400" />
            Share
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cyber-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-cyan-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Internal Share Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Share to Your Profile
            </h3>
            <p className="text-cyan-200/80 text-sm">
              Share this to your profile and add an optional comment
            </p>

            <textarea
              value={shareComment}
              onChange={(e) => setShareComment(e.target.value)}
              placeholder="Add your thoughts... (optional)"
              className="w-full px-4 py-3 bg-cyber-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-400/50 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all resize-none"
              rows={3}
              maxLength={500}
            />

            <button
              onClick={handleInternalShare}
              disabled={isSharing}
              className="w-full btn bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30"
            >
              {isSharing ? 'Sharing...' : 'Share to Profile'}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-500/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-cyber-900 text-cyan-300">or share externally</span>
            </div>
          </div>

          {/* External Share Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Share Link
            </h3>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between p-4 bg-cyber-800/50 border border-cyan-500/30 rounded-lg hover:bg-cyber-800 hover:border-cyan-400 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                  <Copy className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">Copy Link</p>
                  <p className="text-sm text-cyan-300/70">
                    {copySuccess ? 'Copied!' : 'Copy to clipboard'}
                  </p>
                </div>
              </div>
              {copySuccess && (
                <span className="text-green-400 font-semibold">✓</span>
              )}
            </button>

            {/* Social Media Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleExternalShare('twitter')}
                className="p-4 bg-cyber-800/50 border border-cyan-500/30 rounded-lg hover:bg-blue-500/20 hover:border-blue-400 transition-all group"
              >
                <Twitter className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-cyan-300">Twitter</p>
              </button>

              <button
                onClick={() => handleExternalShare('facebook')}
                className="p-4 bg-cyber-800/50 border border-cyan-500/30 rounded-lg hover:bg-blue-600/20 hover:border-blue-500 transition-all group"
              >
                <Facebook className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-cyan-300">Facebook</p>
              </button>

              <button
                onClick={() => handleExternalShare('linkedin')}
                className="p-4 bg-cyber-800/50 border border-cyan-500/30 rounded-lg hover:bg-blue-700/20 hover:border-blue-600 transition-all group"
              >
                <Linkedin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-cyan-300">LinkedIn</p>
              </button>
            </div>

            {/* Native Share (mobile) */}
            {typeof navigator.share !== 'undefined' && (
              <button
                onClick={handleNativeShare}
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-400 hover:to-pink-500 transition-all font-semibold shadow-lg shadow-purple-500/30"
              >
                <Share2 className="w-5 h-5 inline mr-2" />
                More Sharing Options
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
