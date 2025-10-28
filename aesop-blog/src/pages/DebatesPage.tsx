import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Debate, CommunityType, TopicType, COMMUNITIES, TOPICS } from '../types/database';
import { Swords, Plus, TrendingUp, CheckCircle, Search, X, Trash2 } from 'lucide-react';
import { formatRelativeTime } from '../utils/date';
import CreateDebateModal from '../components/CreateDebateModal';

export default function DebatesPage() {
  const { user } = useAuthStore();
  const [debates, setDebates] = useState<Debate[]>([]);
  const [filteredDebates, setFilteredDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'active' | 'voting' | 'concluded'>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Search/Filter state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCommunity, setFilterCommunity] = useState<CommunityType | 'all'>('all');
  const [filterTopic, setFilterTopic] = useState<TopicType | 'all'>('all');

  useEffect(() => {
    fetchDebates();
  }, [filter]);

  useEffect(() => {
    applyFilters();
  }, [debates, searchKeyword, filterCommunity, filterTopic]);

  const applyFilters = () => {
    let filtered = [...debates];

    // Filter by keyword
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (debate) =>
          debate.title.toLowerCase().includes(keyword) ||
          debate.description?.toLowerCase().includes(keyword) ||
          debate.keywords?.some((k) => k.toLowerCase().includes(keyword))
      );
    }

    // Filter by community
    if (filterCommunity !== 'all') {
      filtered = filtered.filter((debate) =>
        debate.communities?.includes(filterCommunity)
      );
    }

    // Filter by topic
    if (filterTopic !== 'all') {
      filtered = filtered.filter((debate) => debate.topics?.includes(filterTopic));
    }

    setFilteredDebates(filtered);
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setFilterCommunity('all');
    setFilterTopic('all');
  };

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

  const handleDeleteDebate = async (debateId: string) => {
    if (!confirm('Are you sure you want to delete this debate? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('debates')
        .delete()
        .eq('id', debateId);

      if (error) throw error;

      setDebates(debates.filter((d) => d.id !== debateId));
      alert('Debate deleted successfully');
    } catch (error) {
      console.error('Error deleting debate:', error);
      alert('Failed to delete debate');
    }
  };

  const handleConcludeDebate = async (debateId: string) => {
    if (!confirm('Are you sure you want to conclude this debate? Voting will end.')) {
      return;
    }

    try {
      console.log('Concluding debate:', debateId);
      console.log('Current user ID:', user?.id);
      console.log('Current filter:', filter);

      // Update the debate status in the database
      const { data, error } = await supabase
        .from('debates')
        .update({ status: 'concluded' })
        .eq('id', debateId)
        .select();

      if (error) {
        console.error('Database error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        alert(`Failed to conclude debate: ${error.message}\n\nThis might be a permissions issue. Please check the console for details.`);
        return;
      }

      if (!data || data.length === 0) {
        console.error('No data returned from update - debate may not exist or RLS policy blocking update');
        alert('Failed to conclude debate: No data returned. This is likely a permissions issue.');
        return;
      }

      console.log('Database updated successfully:', data);

      // Immediately remove from local state for instant feedback
      const updatedDebates = debates.filter((d) => d.id !== debateId);
      console.log('Removing debate from local state. New count:', updatedDebates.length);
      setDebates(updatedDebates);

      alert('Debate concluded successfully');
    } catch (error: any) {
      console.error('Error concluding debate:', error);
      alert(`Failed to conclude debate: ${error?.message || 'Unknown error'}`);
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

        {/* Status Filters */}
        <div className="flex gap-3 mb-6">
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

        {/* Search and Filters */}
        <div className="card p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {/* Keyword Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search Keyword
              </label>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Type keyword..."
                className="input"
              />
            </div>

            {/* Community Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Community</label>
              <select
                value={filterCommunity}
                onChange={(e) => setFilterCommunity(e.target.value as CommunityType | 'all')}
                className="input"
              >
                <option value="all">All Communities</option>
                {COMMUNITIES.map((community) => (
                  <option key={community.value} value={community.value}>
                    {community.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value as TopicType | 'all')}
                className="input"
              >
                <option value="all">All Topics</option>
                {TOPICS.map((topic) => (
                  <option key={topic.value} value={topic.value}>
                    {topic.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Search Button */}
          {(searchKeyword || filterCommunity !== 'all' || filterTopic !== 'all') && (
            <button
              onClick={handleClearSearch}
              className="btn btn-secondary flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Search
            </button>
          )}
        </div>

        {/* Debates list */}
        <div className="space-y-6">
          {filteredDebates.map((debate) => {
            const isCreator = user?.id === debate.creator_id;
            return (
            <div key={debate.id} className="card p-6">
              {/* Debate header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">{debate.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCreator && (
                      <>
                        {debate.status !== 'concluded' && (
                          <button
                            onClick={() => handleConcludeDebate(debate.id)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Conclude debate"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteDebate(debate.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete debate"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {debate.status === 'concluded' && (
                      <span className="badge bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Concluded
                      </span>
                    )}
                  </div>
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
                    className="block mb-4 hover:opacity-80 transition-opacity debate-text-block"
                  >
                    <h4 className="text-2xl font-black mb-3 leading-tight debate-title-black">
                      {debate.post_a?.title}
                    </h4>
                    <p className="text-base font-bold debate-author-black">
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
                    className="block mb-4 hover:opacity-80 transition-opacity debate-text-block"
                  >
                    <h4 className="text-2xl font-black mb-3 leading-tight debate-title-black">
                      {debate.post_b?.title}
                    </h4>
                    <p className="text-base font-bold debate-author-black">
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
            );
          })}
        </div>

        {filteredDebates.length === 0 && (
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
