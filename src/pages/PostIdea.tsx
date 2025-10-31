import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function PostIdea() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    industry: '',
    funding_goal: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!profile) return;
    if (!form.title || !form.industry || !form.funding_goal) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.from('ideas').insert({
        title: form.title,
        industry: form.industry,
        funding_goal: Number(form.funding_goal),
        funding_received: 0,
        description: form.description,
        status: 'active',
        entrepreneur_id: profile.id,
      }).select('id').single();

      if (error) throw error;
      if (data?.id) navigate(`/ideas/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to post idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Post New Idea</h1>
      <p className="text-gray-600 mb-6">Create a funding request to pitch your idea.</p>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl p-6 border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Smart Farming Platform"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
          <input
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., AgriTech"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Funding Goal (USD)</label>
          <input
            type="number"
            min={0}
            value={form.funding_goal}
            onChange={(e) => setForm({ ...form, funding_goal: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="50000"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={6}
            placeholder="Briefly describe your idea, market and plan"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Idea'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg">Cancel</button>
        </div>
      </form>
    </div>
  );
}
