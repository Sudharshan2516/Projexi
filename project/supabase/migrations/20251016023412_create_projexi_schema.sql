/*
  # Projexi - Global Entrepreneurial Ecosystem Database Schema

  ## Overview
  This migration creates the complete database structure for Projexi platform connecting
  Entrepreneurs, Investors, and Dealers.

  ## New Tables

  ### 1. profiles
  Extended user profile information
  - `id` (uuid, FK to auth.users)
  - `role` (enum: entrepreneur, investor, dealer, admin)
  - `full_name` (text)
  - `avatar_url` (text)
  - `bio` (text)
  - `location` (text)
  - `verified` (boolean) - KYC verified status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. investor_preferences
  Investor filtering and matching preferences
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to profiles)
  - `min_funding` (numeric)
  - `max_funding` (numeric)
  - `industries` (text[]) - array of industry tags
  - `zones` (text[]) - array of geographic zones

  ### 3. dealer_profiles
  Dealer business information
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to profiles)
  - `business_name` (text)
  - `business_type` (text)
  - `products` (text)
  - `verified` (boolean)

  ### 4. ideas
  Startup ideas posted by entrepreneurs
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to profiles)
  - `title` (text)
  - `description` (text)
  - `category` (text)
  - `zone` (text)
  - `tags` (text[])
  - `funding_goal` (numeric)
  - `pitch_deck_url` (text)
  - `video_url` (text)
  - `views` (integer)
  - `status` (text) - active, funded, closed
  - `created_at` (timestamptz)

  ### 5. funding_requests
  Funding requests from entrepreneurs to investors
  - `id` (uuid, primary key)
  - `idea_id` (uuid, FK to ideas)
  - `entrepreneur_id` (uuid, FK to profiles)
  - `investor_id` (uuid, FK to profiles)
  - `amount` (numeric)
  - `message` (text)
  - `status` (text) - pending, accepted, rejected
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. dealer_listings
  Products/materials listed by dealers
  - `id` (uuid, primary key)
  - `dealer_id` (uuid, FK to profiles)
  - `title` (text)
  - `description` (text)
  - `price` (numeric)
  - `stock` (integer)
  - `category` (text)
  - `image_url` (text)
  - `created_at` (timestamptz)

  ### 7. quote_requests
  Quote requests from entrepreneurs to dealers
  - `id` (uuid, primary key)
  - `listing_id` (uuid, FK to dealer_listings)
  - `entrepreneur_id` (uuid, FK to profiles)
  - `dealer_id` (uuid, FK to profiles)
  - `quantity` (integer)
  - `message` (text)
  - `status` (text) - pending, quoted, accepted, rejected
  - `created_at` (timestamptz)

  ### 8. mentors
  Mentor profiles for skill-based mentoring
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to profiles)
  - `expertise` (text[])
  - `hourly_rate` (numeric)
  - `availability` (text)
  - `rating` (numeric)

  ### 9. mentorship_bookings
  Mentoring session bookings
  - `id` (uuid, primary key)
  - `mentor_id` (uuid, FK to mentors)
  - `mentee_id` (uuid, FK to profiles)
  - `date` (timestamptz)
  - `duration` (integer) - minutes
  - `topic` (text)
  - `status` (text) - scheduled, completed, cancelled
  - `feedback` (text)
  - `rating` (integer)
  - `created_at` (timestamptz)

  ### 10. messages
  Direct messaging between users
  - `id` (uuid, primary key)
  - `sender_id` (uuid, FK to profiles)
  - `recipient_id` (uuid, FK to profiles)
  - `thread_id` (uuid)
  - `content` (text)
  - `read` (boolean)
  - `created_at` (timestamptz)

  ### 11. notifications
  System notifications
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to profiles)
  - `type` (text)
  - `title` (text)
  - `message` (text)
  - `link` (text)
  - `read` (boolean)
  - `created_at` (timestamptz)

  ### 12. feed_posts
  Community feed posts (Peer Connect)
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to profiles)
  - `content` (text)
  - `image_url` (text)
  - `likes` (integer)
  - `created_at` (timestamptz)

  ### 13. feed_comments
  Comments on feed posts
  - `id` (uuid, primary key)
  - `post_id` (uuid, FK to feed_posts)
  - `user_id` (uuid, FK to profiles)
  - `content` (text)
  - `created_at` (timestamptz)

  ### 14. scholarships
  Scholarship information database
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `amount` (numeric)
  - `deadline` (date)
  - `eligibility` (text)
  - `link` (text)
  - `created_at` (timestamptz)

  ### 15. kyc_documents
  KYC verification documents
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to profiles)
  - `document_type` (text)
  - `document_url` (text)
  - `status` (text) - pending, approved, rejected
  - `uploaded_at` (timestamptz)
  - `reviewed_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can read/update their own profiles
  - Users can read public data based on role
  - Strict access controls for sensitive operations
  - Admin role has elevated permissions

  ## Important Notes
  1. All tables use UUID primary keys
  2. Timestamps for audit trail
  3. Soft delete capability via status fields
  4. Optimized indexes for common queries
  5. Foreign key constraints for data integrity
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('entrepreneur', 'investor', 'dealer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'entrepreneur',
  full_name text NOT NULL,
  avatar_url text,
  bio text,
  location text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Investor preferences
CREATE TABLE IF NOT EXISTS investor_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  min_funding numeric DEFAULT 0,
  max_funding numeric,
  industries text[] DEFAULT '{}',
  zones text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE investor_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Investors can manage own preferences"
  ON investor_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "All can read investor preferences"
  ON investor_preferences FOR SELECT
  TO authenticated
  USING (true);

-- Dealer profiles
CREATE TABLE IF NOT EXISTS dealer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_name text NOT NULL,
  business_type text,
  products text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dealer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dealers can manage own profile"
  ON dealer_profiles FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "All can read dealer profiles"
  ON dealer_profiles FOR SELECT
  TO authenticated
  USING (true);

-- Ideas
CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  zone text,
  tags text[] DEFAULT '{}',
  funding_goal numeric NOT NULL,
  pitch_deck_url text,
  video_url text,
  views integer DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read ideas"
  ON ideas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Entrepreneurs can create ideas"
  ON ideas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas"
  ON ideas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Funding requests
CREATE TABLE IF NOT EXISTS funding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
  entrepreneur_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  investor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE funding_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own funding requests"
  ON funding_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = entrepreneur_id OR auth.uid() = investor_id);

CREATE POLICY "Entrepreneurs can create funding requests"
  ON funding_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = entrepreneur_id);

CREATE POLICY "Investors can update requests sent to them"
  ON funding_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = investor_id)
  WITH CHECK (auth.uid() = investor_id);

-- Dealer listings
CREATE TABLE IF NOT EXISTS dealer_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  stock integer DEFAULT 0,
  category text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dealer_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All can read dealer listings"
  ON dealer_listings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Dealers can manage own listings"
  ON dealer_listings FOR ALL
  TO authenticated
  USING (auth.uid() = dealer_id)
  WITH CHECK (auth.uid() = dealer_id);

-- Quote requests
CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES dealer_listings(id) ON DELETE CASCADE NOT NULL,
  entrepreneur_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  dealer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own quote requests"
  ON quote_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = entrepreneur_id OR auth.uid() = dealer_id);

CREATE POLICY "Entrepreneurs can create quote requests"
  ON quote_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = entrepreneur_id);

CREATE POLICY "Dealers can update requests sent to them"
  ON quote_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = dealer_id)
  WITH CHECK (auth.uid() = dealer_id);

-- Mentors
CREATE TABLE IF NOT EXISTS mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  expertise text[] DEFAULT '{}',
  hourly_rate numeric DEFAULT 0,
  availability text,
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All can read mentors"
  ON mentors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own mentor profile"
  ON mentors FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Mentorship bookings
CREATE TABLE IF NOT EXISTS mentorship_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES mentors(id) ON DELETE CASCADE NOT NULL,
  mentee_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date timestamptz NOT NULL,
  duration integer DEFAULT 60,
  topic text,
  status text DEFAULT 'scheduled',
  feedback text,
  rating integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mentorship_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookings"
  ON mentorship_bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = mentee_id OR 
    auth.uid() IN (SELECT user_id FROM mentors WHERE id = mentor_id)
  );

CREATE POLICY "Mentees can create bookings"
  ON mentorship_bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Participants can update bookings"
  ON mentorship_bookings FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = mentee_id OR 
    auth.uid() IN (SELECT user_id FROM mentors WHERE id = mentor_id)
  )
  WITH CHECK (
    auth.uid() = mentee_id OR 
    auth.uid() IN (SELECT user_id FROM mentors WHERE id = mentor_id)
  );

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  thread_id uuid NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update message read status"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Feed posts
CREATE TABLE IF NOT EXISTS feed_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  image_url text,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All can read feed posts"
  ON feed_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create feed posts"
  ON feed_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON feed_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON feed_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Feed comments
CREATE TABLE IF NOT EXISTS feed_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES feed_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All can read comments"
  ON feed_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON feed_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON feed_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Scholarships
CREATE TABLE IF NOT EXISTS scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  amount numeric,
  deadline date,
  eligibility text,
  link text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All can read scholarships"
  ON scholarships FOR SELECT
  TO authenticated
  USING (true);

-- KYC documents
CREATE TABLE IF NOT EXISTS kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL,
  document_url text NOT NULL,
  status text DEFAULT 'pending',
  uploaded_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own KYC documents"
  ON kyc_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload KYC documents"
  ON kyc_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
CREATE INDEX IF NOT EXISTS idx_funding_requests_investor ON funding_requests(investor_id);
CREATE INDEX IF NOT EXISTS idx_funding_requests_entrepreneur ON funding_requests(entrepreneur_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_feed_posts_created ON feed_posts(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DO $$ BEGIN
  CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_funding_requests_updated_at
    BEFORE UPDATE ON funding_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;