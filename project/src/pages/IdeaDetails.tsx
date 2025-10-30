import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { DollarSign, Users, Eye } from 'lucide-react';

interface Idea {
  id: string;
  title: string;
  description: string | null;
  industry: string;
  funding_goal: number;
  funding_received: number;
  status: string;
  views: number;
  entrepreneur_id: string;
}

export function IdeaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [investing, setInvesting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadIdea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadIdea = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await supabase.from('ideas').select('*').eq('id', id).maybeSingle();
      if (data) setIdea(data as any);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const canInvest = profile && (profile.role === 'investor' || profile.role === 'dealer');
  const isOwner = profile && idea && profile.id === idea.entrepreneur_id;

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!profile || !idea) return;
    const value = Number(amount);
    if (!value || value <= 0) {
      setError('Enter a valid amount');
      return;
    }
    setInvesting(true);
    try {
      const { error } = await supabase.from('investments').insert({
        idea_id: idea.id,
        investor_id: profile.id,
        amount: value,
      });
      if (error) throw error;
      await supabase.from('ideas')
        .update({ funding_received: (Number(idea.funding_received) || 0) + value })
        .eq('id', idea.id);
      await loadIdea();
      setAmount('');
      alert('Funding committed successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to invest');
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="p-8 bg-white rounded-xl border border-gray-200">
        <p className="text-gray-700">Idea not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-gray-100 rounded">Go back</button>
      </div>
    );
  }

  const progress = Math.min(100, (Number(idea.funding_received) / Number(idea.funding_goal)) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{idea.title}</h1>
            <p className="text-gray-600 mt-2">Industry: {idea.industry}</p>
            {idea.description && <p className="text-gray-700 mt-4 whitespace-pre-wrap">{idea.description}</p>}
          </div>
          <div className="text-right min-w-[220px]">
            <div className="text-2xl font-bold text-blue-600 flex items-center justify-end gap-1">
              <DollarSign size={20} /> {Number(idea.funding_received).toLocaleString()} / {Number(idea.funding_goal).toLocaleString()}
            </div>
            <div className="h-2 bg-gray-200 rounded-full mt-2">
              <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-sm text-gray-500 mt-1">{progress.toFixed(0)}% funded</div>
            <div className="flex items-center gap-3 justify-end text-gray-500 mt-2 text-sm">
              <span className="flex items-center gap-1"><Eye size={16} /> {idea.views || 0}</span>
              <span className="flex items-center gap-1"><Users size={16} /> supporters</span>
            </div>
          </div>
        </div>
      </div>

      {canInvest && !isOwner && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Fund this Idea</h2>
          <form onSubmit={handleInvest} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1000"
                required
              />
            </div>
            <button
              type="submit"
              disabled={investing}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {investing ? 'Processing...' : 'Fund Idea'}
            </button>
          </form>
          {error && <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">{error}</div>}
        </div>
      )}

      {isOwner && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg">
          You are viewing your own idea. Investors and dealers can fund from this page.
        </div>
      )}
    </div>
  );
}
