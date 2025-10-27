import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMMUNITIES, TOPICS, CommunityType, TopicType } from '../types/database';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Check } from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, fetchUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCommunities, setSelectedCommunities] = useState<CommunityType[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<TopicType[]>([]);

  const toggleCommunity = (community: CommunityType) => {
    setSelectedCommunities((prev) =>
      prev.includes(community)
        ? prev.filter((c) => c !== community)
        : [...prev, community]
    );
  };

  const toggleTopic = (topic: TopicType) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          communities: selectedCommunities,
          topics: selectedTopics,
        })
        .eq('id', user.id);

      if (error) throw error;

      await fetchUser();
      navigate('/feed');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl font-bold gradient-text">A</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to Aesop Blog!</h1>
          <p className="text-white/80 text-lg">
            Let's personalize your experience
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? 'bg-white text-blue-600' : 'bg-white/30 text-white'
              }`}
            >
              {step > 1 ? <Check className="w-6 h-6" /> : '1'}
            </div>
            <span className="ml-3 text-white font-medium">Communities</span>
          </div>
          <div className="w-12 h-1 bg-white/30"></div>
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? 'bg-white text-blue-600' : 'bg-white/30 text-white'
              }`}
            >
              2
            </div>
            <span className="ml-3 text-white font-medium">Topics</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Communities
              </h2>
              <p className="text-gray-600 mb-6">
                Select the communities you belong to (choose at least 3)
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {COMMUNITIES.map((community) => (
                  <button
                    key={community.value}
                    onClick={() => toggleCommunity(community.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedCommunities.includes(community.value)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{community.icon}</div>
                    <div className="font-medium text-gray-900">{community.label}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={selectedCommunities.length < 3}
                className="w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue ({selectedCommunities.length} selected)
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Topics
              </h2>
              <p className="text-gray-600 mb-6">
                Select topics you're interested in (choose at least 3)
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {TOPICS.map((topic) => (
                  <button
                    key={topic.value}
                    onClick={() => toggleTopic(topic.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedTopics.includes(topic.value)
                        ? 'border-cyan-600 bg-cyan-50'
                        : 'border-gray-200 hover:border-cyan-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{topic.icon}</div>
                    <div className="font-medium text-gray-900">{topic.label}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 btn btn-secondary py-3 text-lg font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={selectedTopics.length < 3 || loading}
                  className="flex-1 btn btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : `Complete (${selectedTopics.length} selected)`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
