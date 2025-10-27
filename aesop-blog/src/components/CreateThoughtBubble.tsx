import { useState } from 'react';
import { MOODS, MoodType } from '../types/database';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Send } from 'lucide-react';
import DynamicIcon from './DynamicIcon';

interface CreateThoughtBubbleProps {
  onCreated: () => void;
}

export default function CreateThoughtBubble({ onCreated }: CreateThoughtBubbleProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType>('happy');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim() || loading) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('thought_bubbles').insert({
        author_id: user.id,
        content: content.trim(),
        mood: selectedMood,
      });

      if (error) throw error;

      setContent('');
      onCreated();
    } catch (error) {
      console.error('Error creating thought bubble:', error);
      alert('Failed to create thought bubble');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-cyan-200 mb-2">
            How are you feeling?
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() => setSelectedMood(mood.value)}
                className={`flex items-center justify-center px-4 py-3 rounded-xl border-2 transition-all flex-shrink-0 ${
                  selectedMood === mood.value
                    ? `border-transparent bg-gradient-to-br ${mood.gradient} text-white shadow-lg`
                    : 'border-cyber-700/50 hover:border-cyber-600 bg-cyber-900/30 text-white'
                }`}
              >
                <DynamicIcon name={mood.icon} size={32} />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts... (max 280 characters)"
            maxLength={280}
            rows={3}
            className="w-full px-4 py-3 bg-white text-gray-900 border border-cyber-700/50 rounded-lg focus:ring-2 focus:ring-cyber-500 focus:border-cyber-500 outline-none resize-none placeholder-gray-500"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">
              {content.length}/280 characters
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!content.trim() || loading}
          className={`w-full btn btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Send className="w-5 h-5" />
          {loading ? 'Sharing...' : 'Share Thought'}
        </button>
      </form>
    </div>
  );
}
