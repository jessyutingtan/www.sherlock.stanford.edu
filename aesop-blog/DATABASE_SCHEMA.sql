-- Aesop Blog Database Schema
-- This schema supports all features including posts, thought bubbles, collaborative spaces, debates, and more

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Communities enum (20 options)
CREATE TYPE community_type AS ENUM (
  'students', 'scholars', 'professionals', 'coders', 'engineers',
  'geeks', 'service_providers', 'writers', 'artists', 'entrepreneurs',
  'government_workers', 'entertainment', 'healthcare', 'educators',
  'creatives', 'scientists', 'business', 'freelancers', 'researchers', 'others'
);

-- Topics enum (20 options)
CREATE TYPE topic_type AS ENUM (
  'lifestyle', 'educational', 'medical', 'physics', 'cosmology',
  'chemistry', 'biology', 'technology', 'electrical', 'ai_tools',
  'culture', 'environment', 'art', 'socialization', 'philosophy',
  'movies', 'tv_shows', 'politics', 'gaming', 'others'
);

-- Mood types for thought bubbles
CREATE TYPE mood_type AS ENUM (
  'happy', 'inspired', 'thoughtful', 'energized', 'loving', 'chill'
);

-- Debate status
CREATE TYPE debate_status AS ENUM (
  'active', 'voting', 'concluded'
);

-- User profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  communities community_type[] DEFAULT '{}',
  topics topic_type[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  communities community_type[] DEFAULT '{}',
  topics topic_type[] DEFAULT '{}',
  reading_time INTEGER, -- in minutes
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Thought bubbles (micro posts)
CREATE TABLE thought_bubbles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 280),
  mood mood_type NOT NULL,
  attached_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaborative writing spaces
CREATE TABLE collaborative_spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT DEFAULT '',
  is_public BOOLEAN DEFAULT true,
  max_collaborators INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaborative space members
CREATE TABLE space_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID REFERENCES collaborative_spaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'contributor', -- owner, contributor, viewer
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(space_id, user_id)
);

-- Post debates/duels
CREATE TABLE debates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  post_a_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  post_b_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status debate_status DEFAULT 'active',
  voting_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Debate votes
CREATE TABLE debate_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  debate_id UUID REFERENCES debates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  voted_for_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(debate_id, user_id)
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  thought_bubble_id UUID REFERENCES thought_bubbles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, thought_bubble_id),
  CHECK (
    (post_id IS NOT NULL AND thought_bubble_id IS NULL) OR
    (post_id IS NULL AND thought_bubble_id IS NOT NULL)
  )
);

-- Bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Follows
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- like, comment, follow, mention, etc.
  actor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_published ON posts(is_published, published_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_posts_communities ON posts USING GIN(communities);
CREATE INDEX idx_posts_topics ON posts USING GIN(topics);
CREATE INDEX idx_thought_bubbles_author ON thought_bubbles(author_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_likes_post ON likes(post_id);
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE thought_bubbles ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborative_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Anyone can view, users can update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts: Published posts are viewable by everyone, authors can manage their own
CREATE POLICY "Published posts are viewable by everyone" ON posts FOR SELECT USING (is_published = true OR author_id = auth.uid());
CREATE POLICY "Users can insert own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = author_id);

-- Thought bubbles: Viewable by everyone, authors can manage their own
CREATE POLICY "Thought bubbles are viewable by everyone" ON thought_bubbles FOR SELECT USING (true);
CREATE POLICY "Users can insert own thought bubbles" ON thought_bubbles FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can delete own thought bubbles" ON thought_bubbles FOR DELETE USING (auth.uid() = author_id);

-- Collaborative spaces
CREATE POLICY "Public spaces are viewable by everyone" ON collaborative_spaces FOR SELECT USING (is_public = true OR creator_id = auth.uid());
CREATE POLICY "Users can create spaces" ON collaborative_spaces FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update their spaces" ON collaborative_spaces FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete their spaces" ON collaborative_spaces FOR DELETE USING (auth.uid() = creator_id);

-- Space collaborators
CREATE POLICY "Collaborators are viewable by space members" ON space_collaborators FOR SELECT USING (true);
CREATE POLICY "Space creators can add collaborators" ON space_collaborators FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM collaborative_spaces WHERE id = space_id AND creator_id = auth.uid())
);

-- Debates
CREATE POLICY "Debates are viewable by everyone" ON debates FOR SELECT USING (true);
CREATE POLICY "Users can create debates" ON debates FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Debate votes
CREATE POLICY "Votes are viewable by everyone" ON debate_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote once" ON debate_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Comments: Viewable by everyone, authors can manage their own
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = author_id);

-- Likes: Viewable by everyone, users can manage their own
CREATE POLICY "Likes are viewable by everyone" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can like" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON likes FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks: Users can only see and manage their own
CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Follows: Viewable by everyone, users can manage their own
CREATE POLICY "Follows are viewable by everyone" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can follow" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- Notifications: Users can only see their own
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Functions for triggers

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collaborative_spaces_updated_at BEFORE UPDATE ON collaborative_spaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
