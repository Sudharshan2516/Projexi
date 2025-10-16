import { useEffect, useState } from 'react';
import { Plus, Search, TrendingUp, Eye, DollarSign, Tag } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Idea } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export function Ideas() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'technology', 'healthcare', 'finance', 'education', 'retail', 'other'];

  useEffect(() => {
    loadIdeas();
  }, [profile, selectedCategory]);

  const loadIdeas = async () => {
    try {
      let query = supabase
        .from('ideas')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (profile?.role === 'entrepreneur') {
        query = query.eq('user_id', profile.id);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error('Error loading ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleIdeaClick = (ideaId: string) => {
    navigate(`/ideas/${ideaId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {profile?.role === 'entrepreneur' ? 'My Ideas' : 'Browse Ideas'}
          </h1>
          <p className="text-white/70">
            {profile?.role === 'entrepreneur'
              ? 'Manage your startup ideas and funding requests'
              : 'Discover innovative startup opportunities'}
          </p>
        </div>

        {profile?.role === 'entrepreneur' && (
          <Button onClick={() => navigate('/ideas/new')} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Post New Idea
          </Button>
        )}
      </div>

      <GlassCard hover={false}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <Input
              placeholder="Search ideas, tags, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all duration-300
                  ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }
                `}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="h-64 animate-pulse" hover={false}>
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-6 bg-white/20 rounded w-3/4" />
                  <div className="h-4 bg-white/20 rounded w-full" />
                  <div className="h-4 bg-white/20 rounded w-2/3" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : filteredIdeas.length === 0 ? (
        <GlassCard hover={false}>
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No ideas found</h3>
            <p className="text-white/70 mb-6">
              {profile?.role === 'entrepreneur'
                ? 'Start by posting your first startup idea'
                : 'Check back later for new opportunities'}
            </p>
            {profile?.role === 'entrepreneur' && (
              <Button onClick={() => navigate('/ideas/new')}>
                <Plus className="w-5 h-5 mr-2" />
                Post Your First Idea
              </Button>
            )}
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map((idea, index) => (
            <GlassCard
              key={idea.id}
              className="cursor-pointer animate-slideUp"
              style={{ animationDelay: `${index * 50}ms` } as any}
              onClick={() => handleIdeaClick(idea.id)}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                      {idea.category}
                    </span>
                    {idea.zone && (
                      <span className="text-xs text-white/60">{idea.zone}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{idea.title}</h3>
                  <p className="text-white/70 text-sm line-clamp-3">{idea.description}</p>
                </div>

                <div className="mt-auto space-y-3">
                  {idea.tags && idea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {idea.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-white/70 text-xs"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {idea.tags.length > 3 && (
                        <span className="px-2 py-1 rounded bg-white/10 text-white/70 text-xs">
                          +{idea.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {idea.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${idea.funding_goal.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
