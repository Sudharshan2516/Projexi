import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase, FeedPost } from '../lib/supabase';

interface FeedPostWithProfile extends FeedPost {
  profiles?: { full_name: string; role: string };
}

export function Community() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<FeedPostWithProfile[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('feed_posts')
      .select('*, profiles(full_name, role)')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setPosts(data);
    }
  };

  const handleSubmitPost = async () => {
    if (!newPost.trim()) return;

    setLoading(true);
    const { error } = await supabase.from('feed_posts').insert({
      user_id: profile?.id,
      content: newPost,
    });

    if (!error) {
      setNewPost('');
      loadPosts();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Peer Connect</h1>
        <p className="text-white/70">Share ideas and connect with the community</p>
      </div>

      <GlassCard hover={false}>
        <div className="space-y-4">
          <textarea
            className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            rows={4}
            placeholder="Share your thoughts with the community..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitPost} loading={loading}>
              <Send className="w-4 h-4 mr-2" />
              Post
            </Button>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-4">
        {posts.map((post) => (
          <GlassCard key={post.id}>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {post.profiles?.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{post.profiles?.full_name}</span>
                    <span className="text-xs text-white/50 capitalize">{post.profiles?.role}</span>
                  </div>
                  <p className="text-xs text-white/60">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="text-white/90">{post.content}</p>

              <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                <button className="flex items-center gap-2 text-white/70 hover:text-red-400 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-white/70 hover:text-blue-400 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>Comment</span>
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
