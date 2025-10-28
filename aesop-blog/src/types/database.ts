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
  background_image: string | null;
  bio: string | null;
  website: string | null;
  communities: CommunityType[];
  topics: TopicType[];
  notification_web: boolean;
  notification_email: boolean;
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
  shares_count?: number;
  is_liked?: boolean;
  is_bookmarked?: boolean;
  is_shared?: boolean;
}

export interface ThoughtBubble {
  id: string;
  author_id: string;
  content: string;
  mood: MoodType;
  attached_post_id: string | null;
  views: number;
  created_at: string;
  // Joined data
  author?: Profile;
  likes_count?: number;
  shares_count?: number;
  is_liked?: boolean;
  is_shared?: boolean;
}

export interface CollaborativeSpace {
  id: string;
  title: string;
  description: string | null;
  creator_id: string;
  content: string;
  is_public: boolean;
  max_collaborators: number;
  communities: CommunityType[];
  topics: TopicType[];
  keywords: string[];
  status: 'active' | 'concluded';
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
  communities: CommunityType[];
  topics: TopicType[];
  keywords: string[];
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

export interface Share {
  id: string;
  user_id: string;
  post_id: string | null;
  thought_bubble_id: string | null;
  comment: string | null;
  created_at: string;
  // Joined data
  user?: Profile;
  post?: Post;
  thought_bubble?: ThoughtBubble;
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
  { value: 'students', label: 'Students', icon: 'GraduationCap' },
  { value: 'scholars', label: 'Scholars', icon: 'BookOpen' },
  { value: 'professionals', label: 'Professionals', icon: 'Briefcase' },
  { value: 'coders', label: 'Coders', icon: 'Code2' },
  { value: 'engineers', label: 'Engineers', icon: 'Cpu' },
  { value: 'geeks', label: 'Geeks', icon: 'Glasses' },
  { value: 'service_providers', label: 'Service Providers', icon: 'Wrench' },
  { value: 'writers', label: 'Writers', icon: 'PenTool' },
  { value: 'artists', label: 'Artists', icon: 'Palette' },
  { value: 'entrepreneurs', label: 'Entrepreneurs', icon: 'Rocket' },
  { value: 'government_workers', label: 'Government Workers', icon: 'Building2' },
  { value: 'entertainment', label: 'Entertainment', icon: 'Clapperboard' },
  { value: 'healthcare', label: 'Healthcare', icon: 'HeartPulse' },
  { value: 'educators', label: 'Educators', icon: 'BookOpenCheck' },
  { value: 'creatives', label: 'Creatives', icon: 'Sparkles' },
  { value: 'scientists', label: 'Scientists', icon: 'FlaskConical' },
  { value: 'business', label: 'Business', icon: 'TrendingUp' },
  { value: 'freelancers', label: 'Freelancers', icon: 'Zap' },
  { value: 'researchers', label: 'Researchers', icon: 'Search' },
  { value: 'others', label: 'Others', icon: 'Users' },
];

export const TOPICS: { value: TopicType; label: string; icon: string }[] = [
  { value: 'lifestyle', label: 'Lifestyle', icon: 'Home' },
  { value: 'educational', label: 'Educational', icon: 'BookMarked' },
  { value: 'medical', label: 'Medical', icon: 'Stethoscope' },
  { value: 'physics', label: 'Physics', icon: 'Atom' },
  { value: 'cosmology', label: 'Cosmology', icon: 'Telescope' },
  { value: 'chemistry', label: 'Chemistry', icon: 'TestTube' },
  { value: 'biology', label: 'Biology', icon: 'Dna' },
  { value: 'technology', label: 'Technology', icon: 'Smartphone' },
  { value: 'electrical', label: 'Electrical Devices', icon: 'Plug' },
  { value: 'ai_tools', label: 'AI Tools', icon: 'BrainCircuit' },
  { value: 'culture', label: 'Culture', icon: 'Globe' },
  { value: 'environment', label: 'Environment', icon: 'Leaf' },
  { value: 'art', label: 'Art', icon: 'Paintbrush' },
  { value: 'socialization', label: 'Socialization', icon: 'MessageCircle' },
  { value: 'philosophy', label: 'Philosophy', icon: 'Lightbulb' },
  { value: 'movies', label: 'Movies', icon: 'Film' },
  { value: 'tv_shows', label: 'TV Shows', icon: 'Tv' },
  { value: 'politics', label: 'Politics', icon: 'Vote' },
  { value: 'gaming', label: 'Gaming', icon: 'Gamepad2' },
  { value: 'others', label: 'Others', icon: 'MoreHorizontal' },
];

export const MOODS: { value: MoodType; label: string; icon: string; gradient: string }[] = [
  { value: 'happy', label: 'Happy', icon: 'Smile', gradient: 'from-cyber-400 to-neon-400' },
  { value: 'inspired', label: 'Inspired', icon: 'Sparkles', gradient: 'from-neon-500 to-cyber-500' },
  { value: 'thoughtful', label: 'Thoughtful', icon: 'Brain', gradient: 'from-cyber-600 to-cyber-400' },
  { value: 'energized', label: 'Energized', icon: 'Zap', gradient: 'from-neon-600 to-neon-400' },
  { value: 'loving', label: 'Loving', icon: 'Heart', gradient: 'from-neon-500 to-cyber-600' },
  { value: 'chill', label: 'Chill', icon: 'Wind', gradient: 'from-cyber-500 to-neon-600' },
];
