import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Debate } from '../types/database';
import { Swords, Plus, TrendingUp, CheckCircle } from 'lucide-react';
import { formatRelativeTime } from '../utils/date';
import CreateDebateModal from '../components/CreateDebateModal';

export default function DebatesPage() {
  const { user } = useAuthStore();
  const [debates, setDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'active' | 'voting' | 'concluded'>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchDebates();
  }, [filter]);

  const fetchDebates = async () => {
    try {
      const { data, error } = await supabase
        .from('debates')
        .select(
          `
          *,
          post_a:posts!debates_post_a_id_fkey(id, title, author:profiles(username)),
          post_b:posts!debates_post_b_id_fkey(id, title, author:profiles(username)),
          creator:profiles!debates_creator_id_fkey(username),
          votes:debate_votes(count)
        `
        )
        .eq('status', filter)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate vote counts
      const debatesWithVotes = await Promise.all(
        data?.map(async (debate) => {
          const { count: votesA } = await supabase
            .from('debate_votes')
            .select('*', { count: 'exact', head: true })
            .eq('debate_id', debate.id)
            .eq('voted_for_post_id', debate.post_a_id);

          const { count: votesB } = await supabase
            .from('debate_votes')
            .select('*', { count: 'exact', head: true })
            .eq('debate_id', debate.id)
            .eq('voted_for_post_id', debate.post_b_id);

          // Check user vote
          let userVote = null;
          if (user) {
            const { data: vote } = await supabase
              .from('debate_votes')
              .select('voted_for_post_id')
              .eq('debate_id', debate.id)
              .eq('user_id', user.id)
              .single();

            userVote = vote?.voted_for_post_id || null;
          }

          return {
            ...debate,
            votes_a: votesA || 0,
            votes_b: votesB || 0,
            user_vote: userVote,
          };
        }) || []
      );

      setDebates(debatesWithVotes);
    } catch (error) {
      console.error('Error fetching debates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (debateId: string, postId: string) => {
    if (!user) return;

    try {
      // Check if already voted
      const { data: existingVote } = await supabase
        .from('debate_votes')
        .select('id')
        .eq('debate_id', debateId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        alert('You have already voted in this debate');
        return;
      }

      const { error } = await supabase.from('debate_votes').insert({
        debate_id: debateId,
        user_id: user.id,
        voted_for_post_id: postId,
      });

      if (error) throw error;

      fetchDebates();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote');
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
              <Swords className="w-10 h-10" />
              Post Debates
            </h1>
            <p className="text-gray-600">Vote on the best arguments and ideas</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Debate
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setFilter('active')}
            className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('voting')}
            className={`btn ${filter === 'voting' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Voting
          </button>
          <button
            onClick={() => setFilter('concluded')}
            className={`btn ${filter === 'concluded' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Concluded
          </button>
        </div>

        {/* Debates list */}
        <div className="space-y-6">
          {debates.map((debate) => (
            <div key={debate.id} className="card p-6">
              {/* Debate header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{debate.title}</h3>
                  {debate.status === 'concluded' && (
                    <span className="badge bg-green-100 text-green-800 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Concluded
                    </span>
                  )}
                </div>
                {debate.description && (
                  <p className="text-gray-600">{debate.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Created by @{debate.creator?.username} • {formatRelativeTime(debate.created_at)}
                </p>
              </div>

              {/* Competing posts */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Post A */}
                <div
                  className={`p-6 rounded-xl border-2 transition-all bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 shadow-lg shadow-orange-400/50 ${
                    debate.user_vote === debate.post_a_id
                      ? 'border-orange-600'
                      : 'border-orange-300 hover:border-orange-500'
                  }`}
                >
                  <Link
                    to={`/post/${debate.post_a?.id}`}
                    className="block mb-4 hover:opacity-80 transition-opacity"
                  >
                    <h4 className="text-2xl font-black text-black mb-3 leading-tight" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
                      {debate.post_a?.title}
                    </h4>
                    <p className="text-base text-black font-bold" style={{textShadow: '0 1px 1px rgba(0,0,0,0.1)'}}>
                      by @{debate.post_a?.author?.username}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-red-600">{debate.votes_a} votes</span>
                    </div>
                    {debate.status !== 'concluded' && !debate.user_vote && (
                      <button
                        onClick={() => handleVote(debate.id, debate.post_a_id)}
                        className="btn btn-primary text-sm"
                      >
                        Vote
                      </button>
                    )}
                    {debate.user_vote === debate.post_a_id && (
                      <span className="text-sm font-medium text-blue-600">Your vote</span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all"
                      style={{
                        width: `${
                          (debate.votes_a ?? 0) + (debate.votes_b ?? 0) > 0
                            ? ((debate.votes_a ?? 0) / ((debate.votes_a ?? 0) + (debate.votes_b ?? 0))) * 100
                            : 50
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Post B */}
                <div
                  className={`p-6 rounded-xl border-2 transition-all bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 shadow-lg shadow-yellow-400/50 ${
                    debate.user_vote === debate.post_b_id
                      ? 'border-yellow-600'
                      : 'border-yellow-300 hover:border-yellow-500'
                  }`}
                >
                  <Link
                    to={`/post/${debate.post_b?.id}`}
                    className="block mb-4 hover:opacity-80 transition-opacity"
                  >
                    <h4 className="text-2xl font-black text-black mb-3 leading-tight" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
                      {debate.post_b?.title}
                    </h4>
                    <p className="text-base text-black font-bold" style={{textShadow: '0 1px 1px rgba(0,0,0,0.1)'}}>
                      by @{debate.post_b?.author?.username}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-600" />
                      <span className="font-bold text-red-600">{debate.votes_b} votes</span>
                    </div>
                    {debate.status !== 'concluded' && !debate.user_vote && (
                      <button
                        onClick={() => handleVote(debate.id, debate.post_b_id)}
                        className="btn bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm"
                      >
                        Vote
                      </button>
                    )}
                    {debate.user_vote === debate.post_b_id && (
                      <span className="text-sm font-medium text-cyan-600">Your vote</span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 transition-all"
                      style={{
                        width: `${
                          (debate.votes_a ?? 0) + (debate.votes_b ?? 0) > 0
                            ? ((debate.votes_b ?? 0) / ((debate.votes_a ?? 0) + (debate.votes_b ?? 0))) * 100
                            : 50
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Total votes */}
              <div className="mt-6 text-center text-sm text-white font-medium">
                Total votes: {(debate.votes_a ?? 0) + (debate.votes_b ?? 0)}
              </div>
            </div>
          ))}
        </div>

        {debates.length === 0 && (
          <div className="text-center py-12 card">
            <Swords className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {filter} debates
            </h3>
            <p className="text-gray-600 mb-6">
              Create a debate to pit two great posts against each other
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Debate
            </button>
          </div>
        )}
      </div>

      {/* Create Debate Modal */}
      <CreateDebateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => {
          setShowCreateModal(false);
          fetchDebates();
        }}
      />
    </div>
  );
}
