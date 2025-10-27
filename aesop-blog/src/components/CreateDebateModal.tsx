import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Post } from '../types/database';
import { X, Search } from 'lucide-react';

interface CreateDebateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateDebateModal({ isOpen, onClose, onCreated }: CreateDebateModalProps) {
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [postsA, setPostsA] = useState<Post[]>([]);
  const [postsB, setPostsB] = useState<Post[]>([]);
  const [selectedPostA, setSelectedPostA] = useState<Post | null>(null);
  const [selectedPostB, setSelectedPostB] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchA) {
      searchPosts(searchA, setPostsA);
    } else {
      setPostsA([]);
    }
  }, [searchA]);

  useEffect(() => {
    if (searchB) {
      searchPosts(searchB, setPostsB);
    } else {
      setPostsB([]);
    }
  }, [searchB]);

  const searchPosts = async (query: string, setPosts: (posts: Post[]) => void) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, author:profiles(username)')
        .eq('is_published', true)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(5);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPostA || !selectedPostB || !title.trim() || loading) return;

    if (selectedPostA.id === selectedPostB.id) {
      alert('Please select two different posts');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('debates').insert({
        title: title.trim(),
        description: description.trim() || null,
        post_a_id: selectedPostA.id,
        post_b_id: selectedPostB.id,
        creator_id: user.id,
        status: 'active',
      });

      if (error) throw error;

      setTitle('');
      setDescription('');
      setSearchA('');
      setSearchB('');
      setSelectedPostA(null);
      setSelectedPostB(null);
      onCreated();
      onClose();
    } catch (error) {
      console.error('Error creating debate:', error);
      alert('Failed to create debate');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-cyber-900/95 backdrop-blur-sm p-6 border-b border-cyber-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Create Debate</h2>
          <button
            onClick={onClose}
            className="text-cyber-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Debate Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Which approach is better?"
              required
              className="input"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what this debate is about..."
              rows={3}
              className="input resize-none"
            />
          </div>

          {/* Post A Selection */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              First Post *
            </label>
            {selectedPostA ? (
              <div className="card p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">{selectedPostA.title}</h4>
                  <p className="text-sm text-cyan-300">by @{selectedPostA.author?.username}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPostA(null)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                  <input
                    type="text"
                    value={searchA}
                    onChange={(e) => setSearchA(e.target.value)}
                    placeholder="Search for a post..."
                    className="input pl-10"
                  />
                </div>
                {postsA.length > 0 && (
                  <div className="mt-2 card divide-y divide-cyber-800">
                    {postsA.map((post) => (
                      <button
                        key={post.id}
                        type="button"
                        onClick={() => {
                          setSelectedPostA(post);
                          setSearchA('');
                        }}
                        className="w-full p-3 text-left hover:bg-cyber-800/50 transition-colors"
                      >
                        <h4 className="font-semibold text-white">{post.title}</h4>
                        <p className="text-sm text-cyan-300">by @{post.author?.username}</p>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Post B Selection */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Second Post *
            </label>
            {selectedPostB ? (
              <div className="card p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">{selectedPostB.title}</h4>
                  <p className="text-sm text-cyan-300">by @{selectedPostB.author?.username}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPostB(null)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                  <input
                    type="text"
                    value={searchB}
                    onChange={(e) => setSearchB(e.target.value)}
                    placeholder="Search for a post..."
                    className="input pl-10"
                  />
                </div>
                {postsB.length > 0 && (
                  <div className="mt-2 card divide-y divide-cyber-800">
                    {postsB.map((post) => (
                      <button
                        key={post.id}
                        type="button"
                        onClick={() => {
                          setSelectedPostB(post);
                          setSearchB('');
                        }}
                        className="w-full p-3 text-left hover:bg-cyber-800/50 transition-colors"
                      >
                        <h4 className="font-semibold text-white">{post.title}</h4>
                        <p className="text-sm text-cyan-300">by @{post.author?.username}</p>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !selectedPostA || !selectedPostB || loading}
              className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Debate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
