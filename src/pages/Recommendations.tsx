import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { DollarSign } from 'lucide-react';

interface Idea {
  id: string;
  title: string;
  description: string | null;
  industry: string;
  funding_goal: number;
  funding_received: number;
  status: string;
}

export function Recommendations() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!profile) return;
      setLoading(true);
      try {
        // Simple heuristic "AI" recommendation placeholder:
        // show active ideas ordered by least funded ratio and most recent
        const { data } = await supabase
          .from('ideas')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (data) {
          const withScore = data.map((i: any) => ({
            ...i,
            score: (1 - (Number(i.funding_received) || 0) / Math.max(1, Number(i.funding_goal) || 1))
          }));
          withScore.sort((a: any, b: any) => b.score - a.score);
          setIdeas(withScore);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Recommendations</h1>
        <p className="text-gray-600">Personalized opportunities based on funding gap and recency</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 text-center border border-gray-200">
            <p className="text-gray-700">No recommendations available right now.</p>
          </div>
        ) : (
          ideas.map((idea: any) => {
            const pct = Math.min(100, (Number(idea.funding_received) / Math.max(1, Number(idea.funding_goal))) * 100);
            return (
              <div key={idea.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{idea.title}</h3>
                <p className="text-gray-600 text-sm mb-3">Industry: {idea.industry}</p>
                <p className="text-gray-700 text-sm line-clamp-3 mb-3">{idea.description}</p>
                <div className="text-sm text-gray-600 flex items-center gap-3 mb-2">
                  <span className="flex items-center gap-1">
                    <DollarSign size={16} />
                    {Number(idea.funding_received).toLocaleString()} / {Number(idea.funding_goal).toLocaleString()}
                  </span>
                  <span className="text-gray-500">{pct.toFixed(0)}% funded</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mb-4">
                  <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <button
                  onClick={() => navigate(`/ideas/${idea.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  View & Fund
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
