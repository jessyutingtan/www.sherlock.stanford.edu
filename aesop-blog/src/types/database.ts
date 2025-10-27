// Database types for Aesop Blog

export type CommunityType =
  | 'students' | 'scholars' | 'professionals' | 'coders' | 'engineers'
  | 'geeks' | 'service_providers' | 'writers' | 'artists' | 'entrepreneurs'
  | 'government_workers' | 'entertainment' | 'healthcare' | 'educators'
  | 'creatives' | 'scientists' | 'business' | 'freelancers' | 'researchers' | 'others';

export type TopicType =
  | 'lifestyle' | 'educational' | 'medical' | 'physics' | 'cosmology'
  | 'chemistry' | 'biology' | 'technology' | 'electrical' | 'ai_tools'
  | 'culture' | 'environment' | 'art' | 'socialization' | 'philosophy'
  | 'movies' | 'tv_shows' | 'politics' | 'gaming' | 'others';

export type MoodType = 'happy' | 'inspired' | 'thoughtful' | 'energized' | 'loving' | 'chill';

export type DebateStatus = 'active' | 'voting' | 'concluded';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  communities: CommunityType[];
  topics: TopicType[];
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  tags: string[];
  communities: CommunityType[];
  topics: TopicType[];
  reading_time: number | null;
  is_published: boolean;
  published_at: string | null;
  views: number;
  created_at: string;
  updated_at: string;
  // Joined data
  author?: Profile;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

export interface ThoughtBubble {
  id: string;
  author_id: string;
  content: string;
  mood: MoodType;
  attached_post_id: string | null;
  created_at: string;
  // Joined data
  author?: Profile;
  likes_count?: number;
  is_liked?: boolean;
}

export interface CollaborativeSpace {
  id: string;
  title: string;
  description: string | null;
  creator_id: string;
  content: string;
  is_public: boolean;
  max_collaborators: number;
  created_at: string;
  updated_at: string;
  // Joined data
  creator?: Profile;
  collaborators?: Profile[];
  collaborator_count?: number;
}

export interface SpaceCollaborator {
  id: string;
  space_id: string;
  user_id: string;
  role: 'owner' | 'contributor' | 'viewer';
  joined_at: string;
}

export interface Debate {
  id: string;
  title: string;
  description: string | null;
  post_a_id: string;
  post_b_id: string;
  creator_id: string;
  status: DebateStatus;
  voting_ends_at: string | null;
  created_at: string;
  // Joined data
  post_a?: Post;
  post_b?: Post;
  creator?: Profile;
  votes_a?: number;
  votes_b?: number;
  user_vote?: string | null;
}

export interface DebateVote {
  id: string;
  debate_id: string;
  user_id: string;
  voted_for_post_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  // Joined data
  author?: Profile;
  replies?: Comment[];
  likes_count?: number;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string | null;
  thought_bubble_id: string | null;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
  post?: Post;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'debate_invite' | 'space_invite';
  actor_id: string;
  post_id: string | null;
  comment_id: string | null;
  is_read: boolean;
  created_at: string;
  // Joined data
  actor?: Profile;
  post?: Post;
}

// Constants for UI
export const COMMUNITIES: { value: CommunityType; label: string; icon: string }[] = [
  { value: 'students', label: 'Students', icon: '🎓' },
  { value: 'scholars', label: 'Scholars', icon: '📚' },
  { value: 'professionals', label: 'Professionals', icon: '💼' },
  { value: 'coders', label: 'Coders', icon: '💻' },
  { value: 'engineers', label: 'Engineers', icon: '⚙️' },
  { value: 'geeks', label: 'Geeks', icon: '🤓' },
  { value: 'service_providers', label: 'Service Providers', icon: '🛠️' },
  { value: 'writers', label: 'Writers', icon: '✍️' },
  { value: 'artists', label: 'Artists', icon: '🎨' },
  { value: 'entrepreneurs', label: 'Entrepreneurs', icon: '🚀' },
  { value: 'government_workers', label: 'Government Workers', icon: '🏛️' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'healthcare', label: 'Healthcare', icon: '⚕️' },
  { value: 'educators', label: 'Educators', icon: '👨‍🏫' },
  { value: 'creatives', label: 'Creatives', icon: '✨' },
  { value: 'scientists', label: 'Scientists', icon: '🔬' },
  { value: 'business', label: 'Business', icon: '📈' },
  { value: 'freelancers', label: 'Freelancers', icon: '🌟' },
  { value: 'researchers', label: 'Researchers', icon: '🔍' },
  { value: 'others', label: 'Others', icon: '👥' },
];

export const TOPICS: { value: TopicType; label: string; icon: string }[] = [
  { value: 'lifestyle', label: 'Lifestyle', icon: '🌺' },
  { value: 'educational', label: 'Educational', icon: '📖' },
  { value: 'medical', label: 'Medical', icon: '🏥' },
  { value: 'physics', label: 'Physics', icon: '⚛️' },
  { value: 'cosmology', label: 'Cosmology', icon: '🌌' },
  { value: 'chemistry', label: 'Chemistry', icon: '🧪' },
  { value: 'biology', label: 'Biology', icon: '🧬' },
  { value: 'technology', label: 'Technology', icon: '📱' },
  { value: 'electrical', label: 'Electrical Devices', icon: '🔌' },
  { value: 'ai_tools', label: 'AI Tools', icon: '🤖' },
  { value: 'culture', label: 'Culture', icon: '🌍' },
  { value: 'environment', label: 'Environment', icon: '🌱' },
  { value: 'art', label: 'Art', icon: '🖼️' },
  { value: 'socialization', label: 'Socialization', icon: '👫' },
  { value: 'philosophy', label: 'Philosophy', icon: '💭' },
  { value: 'movies', label: 'Movies', icon: '🎥' },
  { value: 'tv_shows', label: 'TV Shows', icon: '📺' },
  { value: 'politics', label: 'Politics', icon: '🗳️' },
  { value: 'gaming', label: 'Gaming', icon: '🎮' },
  { value: 'others', label: 'Others', icon: '🔖' },
];

export const MOODS: { value: MoodType; label: string; icon: string; gradient: string }[] = [
  { value: 'happy', label: 'Happy', icon: '😊', gradient: 'from-yellow-400 to-orange-400' },
  { value: 'inspired', label: 'Inspired', icon: '✨', gradient: 'from-purple-400 to-pink-400' },
  { value: 'thoughtful', label: 'Thoughtful', icon: '🤔', gradient: 'from-blue-400 to-indigo-400' },
  { value: 'energized', label: 'Energized', icon: '⚡', gradient: 'from-green-400 to-emerald-400' },
  { value: 'loving', label: 'Loving', icon: '❤️', gradient: 'from-red-400 to-pink-400' },
  { value: 'chill', label: 'Chill', icon: '😎', gradient: 'from-cyan-400 to-blue-400' },
];
