import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { CollaborativeSpace, CommunityType, TopicType, COMMUNITIES, TOPICS } from '../types/database';
import { Users, Plus, Lock, Globe, Search, X, Trash2, CheckCircle } from 'lucide-react';
import DynamicIcon from '../components/DynamicIcon';

export default function CollaborativeSpacesPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<CollaborativeSpace[]>([]);
  const [filteredSpaces, setFilteredSpaces] = useState<CollaborativeSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Search/Filter state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCommunity, setFilterCommunity] = useState<CommunityType | 'all'>('all');
  const [filterTopic, setFilterTopic] = useState<TopicType | 'all'>('all');

  // Create modal state
  const [newSpace, setNewSpace] = useState({
    title: '',
    description: '',
    isPublic: true,
    communities: [] as CommunityType[],
    topics: [] as TopicType[],
    keywords: [] as string[],
    keywordInput: '',
  });

  useEffect(() => {
    fetchSpaces();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [spaces, searchKeyword, filterCommunity, filterTopic]);

  const fetchSpaces = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('collaborative_spaces')
        .select(
          `
          *,
          creator:profiles!collaborative_spaces_creator_id_fkey(*),
          collaborators:space_collaborators(count)
        `
        )
        .or(`creator_id.eq.${user.id},is_public.eq.true`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedSpaces = data?.map((space) => ({
        ...space,
        collaborator_count: space.collaborators?.[0]?.count || 0,
      }));

      setSpaces(formattedSpaces || []);
    } catch (error) {
      console.error('Error fetching spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...spaces];

    // Filter by keyword
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (space) =>
          space.title.toLowerCase().includes(keyword) ||
          space.description?.toLowerCase().includes(keyword) ||
          space.keywords?.some((k) => k.toLowerCase().includes(keyword))
      );
    }

    // Filter by community
    if (filterCommunity !== 'all') {
      filtered = filtered.filter((space) =>
        space.communities?.includes(filterCommunity)
      );
    }

    // Filter by topic
    if (filterTopic !== 'all') {
      filtered = filtered.filter((space) => space.topics?.includes(filterTopic));
    }

    setFilteredSpaces(filtered);
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setFilterCommunity('all');
    setFilterTopic('all');
  };

  const toggleCommunity = (community: CommunityType) => {
    setNewSpace((prev) => ({
      ...prev,
      communities: prev.communities.includes(community)
        ? prev.communities.filter((c) => c !== community)
        : [...prev.communities, community],
    }));
  };

  const toggleTopic = (topic: TopicType) => {
    setNewSpace((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic],
    }));
  };

  const handleAddKeyword = () => {
    if (newSpace.keywordInput.trim() && !newSpace.keywords.includes(newSpace.keywordInput.trim())) {
      setNewSpace((prev) => ({
        ...prev,
        keywords: [...prev.keywords, prev.keywordInput.trim()],
        keywordInput: '',
      }));
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setNewSpace((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }));
  };

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newSpace.title.trim()) return;

    if (newSpace.communities.length === 0) {
      alert('Please select at least one community');
      return;
    }

    if (newSpace.topics.length === 0) {
      alert('Please select at least one topic');
      return;
    }

    if (newSpace.keywords.length === 0) {
      alert('Please add at least one keyword');
      return;
    }

    try {
      const { error } = await supabase.from('collaborative_spaces').insert({
        creator_id: user.id,
        title: newSpace.title.trim(),
        description: newSpace.description.trim() || null,
        is_public: newSpace.isPublic,
        communities: newSpace.communities,
        topics: newSpace.topics,
        keywords: newSpace.keywords,
        status: 'active',
        content: '',
      });

      if (error) throw error;

      setShowCreateModal(false);
      setNewSpace({
        title: '',
        description: '',
        isPublic: true,
        communities: [],
        topics: [],
        keywords: [],
        keywordInput: '',
      });
      fetchSpaces();
    } catch (error) {
      console.error('Error creating space:', error);
      alert('Failed to create space');
    }
  };

  const handleDeleteSpace = async (spaceId: string) => {
    if (!confirm('Are you sure you want to delete this space? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('collaborative_spaces')
        .delete()
        .eq('id', spaceId);

      if (error) throw error;

      setSpaces(spaces.filter((s) => s.id !== spaceId));
      alert('Space deleted successfully');
    } catch (error) {
      console.error('Error deleting space:', error);
      alert('Failed to delete space');
    }
  };

  const handleConcludeSpace = async (spaceId: string) => {
    if (!confirm('Are you sure you want to conclude this space? It will become read-only.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('collaborative_spaces')
        .update({ status: 'concluded' })
        .eq('id', spaceId);

      if (error) throw error;

      fetchSpaces();
      alert('Space concluded successfully');
    } catch (error) {
      console.error('Error concluding space:', error);
      alert('Failed to conclude space');
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
            <h1 className="text-4xl font-bold gradient-text mb-2">Collaborative Spaces</h1>
            <p className="text-gray-600">Write together in real-time</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Space
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

        {/* Spaces grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpaces.map((space) => {
            const isCreator = user?.id === space.creator_id;
            return (
              <div key={space.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{space.title}</h3>
                      {space.is_public ? (
                        <Globe className="w-5 h-5 text-green-600" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-600" />
                      )}
                      {space.status === 'concluded' && (
                        <CheckCircle className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    {space.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{space.description}</p>
                    )}

                    {/* Keywords */}
                    {space.keywords && space.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {space.keywords.slice(0, 3).map((keyword) => (
                          <span
                            key={keyword}
                            className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-white mb-4">
                  <Users className="w-4 h-4" />
                  <span>{space.collaborator_count} collaborators</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-blue-700">
                  <div className="flex items-center gap-2">
                    {space.creator?.avatar_url ? (
                      <img
                        src={space.creator.avatar_url}
                        alt={space.creator.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-semibold">
                        {space.creator?.username[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-white">{space.creator?.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/space/${space.id}`)}
                      className="btn btn-primary text-sm"
                    >
                      Open
                    </button>
                    {isCreator && (
                      <>
                        {space.status === 'active' && (
                          <button
                            onClick={() => handleConcludeSpace(space.id)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Conclude space"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteSpace(space.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete space"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSpaces.length === 0 && (
          <div className="text-center py-12 card">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchKeyword || filterCommunity !== 'all' || filterTopic !== 'all'
                ? 'No spaces found'
                : 'No collaborative spaces yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchKeyword || filterCommunity !== 'all' || filterTopic !== 'all'
                ? 'Try adjusting your search filters'
                : 'Create a space to start writing with others in real-time'}
            </p>
            {!searchKeyword && filterCommunity === 'all' && filterTopic === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Your First Space
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Collaborative Space</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSpace} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newSpace.title}
                  onChange={(e) => setNewSpace({ ...newSpace, title: e.target.value })}
                  placeholder="My Awesome Space"
                  className="input"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newSpace.description}
                  onChange={(e) => setNewSpace({ ...newSpace, description: e.target.value })}
                  placeholder="What's this space about?"
                  rows={3}
                  className="input resize-none"
                />
              </div>

              {/* Communities */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Communities * (select at least 1)
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {COMMUNITIES.map((community) => (
                    <button
                      key={community.value}
                      type="button"
                      onClick={() => toggleCommunity(community.value)}
                      className={`badge flex items-center gap-2 ${
                        newSpace.communities.includes(community.value)
                          ? 'bg-orange-500 text-white border-2 border-yellow-400'
                          : 'bg-gray-100 text-gray-700 border border-gray-300'
                      }`}
                    >
                      <DynamicIcon name={community.icon} size={16} />
                      {community.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Topics * (select at least 1)
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {TOPICS.map((topic) => (
                    <button
                      key={topic.value}
                      type="button"
                      onClick={() => toggleTopic(topic.value)}
                      className={`badge flex items-center gap-2 ${
                        newSpace.topics.includes(topic.value)
                          ? 'bg-orange-500 text-white border-2 border-yellow-400'
                          : 'bg-gray-100 text-gray-700 border border-gray-300'
                      }`}
                    >
                      <DynamicIcon name={topic.icon} size={16} />
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords * (add at least 1)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSpace.keywordInput}
                    onChange={(e) => setNewSpace({ ...newSpace, keywordInput: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                    placeholder="Add a keyword..."
                    className="input flex-1"
                  />
                  <button type="button" onClick={handleAddKeyword} className="btn btn-primary">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newSpace.keywords.map((keyword) => (
                    <span key={keyword} className="badge bg-blue-100 text-blue-700 flex items-center gap-1">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Public/Private */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newSpace.isPublic}
                  onChange={(e) => setNewSpace({ ...newSpace, isPublic: e.target.checked })}
                  className="w-5 h-5 text-blue-600"
                />
                <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                  Make this space public
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn btn-primary">
                  Create Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
