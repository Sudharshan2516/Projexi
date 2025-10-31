import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Heart, MessageCircle, Send, User } from 'lucide-react';

interface Post {
  id: string;
  author_id: string;
  content: string;
  media_urls: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  author: {
    full_name: string;
    avatar_url: string;
    role: string;
  };
}

export function Community() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data } = await supabase
        .from('community_posts')
        .select(`
          *,
          author:author_id(full_name, avatar_url, role)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        setPosts(data as any);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !profile) return;

    setPosting(true);
    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          author_id: profile.id,
          content: newPost,
        });

      if (error) throw error;

      setNewPost('');
      await loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setPosting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!profile) return;

    try {
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', profile.id)
        .maybeSingle();

      if (existingLike) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('id', existingLike.id);
      } else {
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: profile.id,
          });
      }

      await loadPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Community Feed</h1>
        <p className="text-gray-600 mt-1">Share updates and connect with the community</p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <form onSubmit={handleCreatePost}>
          <div className="flex gap-4">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-12 h-12 rounded-full" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-blue-600" />
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share an update, idea, or ask a question..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                rows={3}
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={!newPost.trim() || posting}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                  {posting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-start gap-4 mb-4">
              {post.author?.avatar_url ? (
                <img src={post.author.avatar_url} alt="" className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-blue-600" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{post.author?.full_name || 'User'}</h3>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded capitalize">
                    {post.author?.role}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

            <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleLikePost(post.id)}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Heart size={20} />
                <span className="text-sm font-medium">{post.likes_count}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <MessageCircle size={20} />
                <span className="text-sm font-medium">{post.comments_count}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
