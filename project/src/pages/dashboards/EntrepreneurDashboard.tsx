import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Idea {
  id: string;
  title: string;
  industry: string;
  funding_goal: number;
  funding_received: number;
  status: string;
  views: number;
  created_at: string;
}

export function EntrepreneurDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [stats, setStats] = useState({
    totalIdeas: 0,
    totalViews: 0,
    totalFunding: 0,
    activeConnections: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [profile]);

  const loadDashboardData = async () => {
    if (!profile) return;

    try {
      const { data: ideasData } = await supabase
        .from('ideas')
        .select('*')
        .eq('entrepreneur_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (ideasData) {
        setIdeas(ideasData);
        setStats({
          totalIdeas: ideasData.length,
          totalViews: ideasData.reduce((sum, idea) => sum + (idea.views || 0), 0),
          totalFunding: ideasData.reduce((sum, idea) => sum + (Number(idea.funding_received) || 0), 0),
          activeConnections: 0,
        });
      }

      const { count } = await supabase
        .from('connections')
        .select('*', { count: 'exact', head: true })
        .eq('requester_id', profile.id)
        .eq('status', 'accepted');

      if (count) {
        setStats(prev => ({ ...prev, activeConnections: count }));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Ideas', value: stats.totalIdeas, icon: 'https://cdn.lordicon.com/kthelypq.json', color: 'bg-blue-500' },
    { label: 'Total Views', value: stats.totalViews, icon: 'https://cdn.lordicon.com/vduvxizq.json', color: 'bg-green-500' },
    { label: 'Funding Raised', value: `$${stats.totalFunding.toLocaleString()}`, icon: 'https://cdn.lordicon.com/fgxwhgdl.json', color: 'bg-purple-500' },
    { label: 'Connections', value: stats.activeConnections, icon: 'https://cdn.lordicon.com/mfslghfy.json', color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Entrepreneur Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your ideas and track your progress</p>
        </div>
        <button
          onClick={() => navigate('/post-idea')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          Post New Idea
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg flex items-center justify-center`}>
                <lottie-player
                  src={index === 0 ? 'https://assets4.lottiefiles.com/packages/lf20_5ngs2ksb.json' : index === 1 ? 'https://assets10.lottiefiles.com/packages/lf20_tl52xzvn.json' : index === 2 ? 'https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json' : 'https://assets9.lottiefiles.com/packages/lf20_bhw1ul4g.json'}
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                  style={{ width: 28, height: 28 }}
                />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Ideas</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {ideas.length === 0 ? (
            <div className="p-12 text-center">
              <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json" background="transparent" speed="1" loop autoplay style={{ width: 48, height: 48 }} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Ideas Yet</h3>
              <p className="text-gray-600 mb-6">Start by posting your first idea to attract investors</p>
              <button
                onClick={() => navigate('/post-idea')}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Post Your First Idea
              </button>
            </div>
          ) : (
            ideas.map((idea) => (
              <div key={idea.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/ideas/${idea.id}`)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        idea.status === 'active' ? 'bg-green-100 text-green-700' :
                        idea.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {idea.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{idea.industry}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye size={16} />
                        {idea.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json" background="transparent" speed="1" loop autoplay style={{ width: 16, height: 16 }} />
                        ${Number(idea.funding_received).toLocaleString()} / ${Number(idea.funding_goal).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {((Number(idea.funding_received) / Number(idea.funding_goal)) * 100).toFixed(0)}%
                    </div>
                    <p className="text-xs text-gray-500">funded</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
          <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_siulqk7l.json" background="transparent" speed="1" loop autoplay style={{ width: 40, height: 40 }} />
          <h3 className="text-2xl font-bold mb-2">Find Investors</h3>
          <p className="text-blue-100 mb-6">
            Connect with investors who are interested in your industry and funding range
          </p>
          <button
            onClick={() => navigate('/find-investors')}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Browse Investors
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 text-white shadow-lg">
          <lottie-player src="https://assets3.lottiefiles.com/packages/lf20_8v9i2i.json" background="transparent" speed="1" loop autoplay style={{ width: 40, height: 40 }} />
          <h3 className="text-2xl font-bold mb-2">Join Community</h3>
          <p className="text-green-100 mb-6">
            Share updates, learn from others, and network with fellow entrepreneurs
          </p>
          <button
            onClick={() => navigate('/community')}
            className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
          >
            Explore Community
          </button>
        </div>
      </div>
    </div>
  );
}
