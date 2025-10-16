import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'entrepreneur' | 'investor' | 'dealer' | 'admin';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  zone: string | null;
  tags: string[];
  funding_goal: number;
  pitch_deck_url: string | null;
  video_url: string | null;
  views: number;
  status: string;
  created_at: string;
}

export interface FundingRequest {
  id: string;
  idea_id: string;
  entrepreneur_id: string;
  investor_id: string;
  amount: number;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DealerListing {
  id: string;
  dealer_id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  thread_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

export interface FeedPost {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  likes: number;
  created_at: string;
}

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  amount: number | null;
  deadline: string | null;
  eligibility: string | null;
  link: string | null;
  created_at: string;
}
