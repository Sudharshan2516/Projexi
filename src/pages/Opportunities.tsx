import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Eye } from 'lucide-react';

interface Idea {
  id: string;
  title: string;
  industry: string;
  funding_goal: number;
  funding_received: number;
  status: string;
  views: number;
}

export function Opportunities() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('ideas')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });
        if (data) setIdeas(data as any);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
        <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
        <p className="text-gray-600">Browse active ideas and fund the ones you believe in.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 text-center border border-gray-200">
            <p className="text-gray-700">No active ideas at the moment.</p>
          </div>
        ) : (
          ideas.map((idea) => {
            const progress = Math.min(100, (Number(idea.funding_received) / Number(idea.funding_goal)) * 100);
            return (
              <div key={idea.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{idea.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">Industry: {idea.industry}</p>
                    <div className="text-sm text-gray-600 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <DollarSign size={16} />
                        {Number(idea.funding_received).toLocaleString()} / {Number(idea.funding_goal).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={16} /> {idea.views || 0} views
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mt-2">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="min-w-[140px] text-right">
                    <button
                      onClick={() => navigate(`/ideas/${idea.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                    >
                      View & Fund
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
