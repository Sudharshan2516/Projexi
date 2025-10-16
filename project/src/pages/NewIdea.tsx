import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { HUD } from '../components/HUD';
import { ArrowLeft, Plus, X } from 'lucide-react';

export function NewIdea() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technology',
    zone: '',
    funding_goal: '',
    pitch_deck_url: '',
    video_url: '',
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = ['technology', 'healthcare', 'finance', 'education', 'retail', 'other'];

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.funding_goal) newErrors.funding_goal = 'Funding goal is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    HUD.show('Creating your idea...');

    try {
      const { error } = await supabase.from('ideas').insert({
        user_id: profile?.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        zone: formData.zone || null,
        tags,
        funding_goal: parseFloat(formData.funding_goal),
        pitch_deck_url: formData.pitch_deck_url || null,
        video_url: formData.video_url || null,
      });

      if (error) throw error;

      HUD.hide();
      navigate('/ideas');
    } catch (error: any) {
      HUD.hide();
      setErrors({ submit: error.message || 'Failed to create idea' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/ideas')}
          className="p-2 rounded-lg text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Post New Idea</h1>
          <p className="text-white/70">Share your startup vision with investors</p>
        </div>
      </div>

      <GlassCard hover={false}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Idea Title"
            placeholder="Enter a compelling title for your startup"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
          />

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              rows={6}
              placeholder="Describe your idea, problem it solves, and target market..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Category
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Zone/Location"
              placeholder="e.g., North America, Europe"
              value={formData.zone}
              onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
            />
          </div>

          <Input
            label="Funding Goal ($)"
            type="number"
            placeholder="50000"
            value={formData.funding_goal}
            onChange={(e) => setFormData({ ...formData, funding_goal: e.target.value })}
            error={errors.funding_goal}
          />

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="secondary">
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/50"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Input
            label="Pitch Deck URL (Optional)"
            placeholder="https://example.com/pitch-deck.pdf"
            value={formData.pitch_deck_url}
            onChange={(e) => setFormData({ ...formData, pitch_deck_url: e.target.value })}
          />

          <Input
            label="Video URL (Optional)"
            placeholder="https://youtube.com/watch?v=..."
            value={formData.video_url}
            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
          />

          {errors.submit && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-300">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" variant="primary" loading={loading} className="flex-1">
              Post Idea
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/ideas')}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
