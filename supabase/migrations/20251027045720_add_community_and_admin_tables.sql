/*
  # Add Community Posts and Additional Tables

  ## New Tables

  ### 1. community_posts
  Global community feed for sharing updates
  - `id` (uuid, primary key)
  - `author_id` (uuid, foreign key) - Post author
  - `content` (text) - Post content
  - `media_urls` (text[]) - Attached media
  - `likes_count` (integer) - Number of likes
  - `comments_count` (integer) - Number of comments
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. post_comments
  Comments on community posts
  - `id` (uuid, primary key)
  - `post_id` (uuid, foreign key) - Links to community_posts
  - `author_id` (uuid, foreign key) - Comment author
  - `content` (text) - Comment text
  - `created_at` (timestamptz)

  ### 3. post_likes
  Likes tracking for posts
  - `id` (uuid, primary key)
  - `post_id` (uuid, foreign key) - Links to community_posts
  - `user_id` (uuid, foreign key) - User who liked
  - `created_at` (timestamptz)

  ### 4. event_registrations
  Event attendance tracking
  - `id` (uuid, primary key)
  - `event_id` (uuid, foreign key) - Links to events
  - `user_id` (uuid, foreign key) - Registered user
  - `registered_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Appropriate policies for viewing and creating content
*/

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  media_urls text[] DEFAULT ARRAY[]::text[],
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community posts viewable by authenticated users"
  ON community_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create community posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete own posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create post_comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments viewable by authenticated users"
  ON post_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete own comments"
  ON post_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes viewable by authenticated users"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create likes"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Registrations viewable by authenticated users"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can register for events"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel own registrations"
  ON event_registrations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_community_posts_author ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON event_registrations(user_id);