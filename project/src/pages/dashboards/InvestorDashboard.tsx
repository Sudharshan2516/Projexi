import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function InvestorDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeInvestments: 0,
    totalInvested: 0,
    opportunities: 0,
    portfolioValue: 0,
  });
  const [recentIdeas, setRecentIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [profile]);

  const loadDashboardData = async () => {
    if (!profile) return;

    try {
      const { data: investmentsData } = await supabase
        .from('investments')
        .select('*')
        .eq('investor_id', profile.id);

      const { data: ideasData } = await supabase
        .from('ideas')
        .select('*, entrepreneur:entrepreneur_id(full_name, avatar_url)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);

      if (investmentsData) {
        const totalInvested = investmentsData.reduce((sum, inv) => sum + Number(inv.amount), 0);
        setStats(prev => ({
          ...prev,
          activeInvestments: investmentsData.filter(i => i.status === 'completed').length,
          totalInvested,
        }));
      }

      if (ideasData) {
        setRecentIdeas(ideasData);
        setStats(prev => ({ ...prev, opportunities: ideasData.length }));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Active Investments', value: stats.activeInvestments, icon: 'https://cdn.lordicon.com/akcsnnhf.json', color: 'bg-blue-500' },
    { label: 'Total Invested', value: `$${stats.totalInvested.toLocaleString()}`, icon: 'https://cdn.lordicon.com/fgxwhgdl.json', color: 'bg-green-500' },
    { label: 'New Opportunities', value: stats.opportunities, icon: 'https://cdn.lordicon.com/odavpkmb.json', color: 'bg-purple-500' },
    { label: 'Portfolio Value', value: `$${stats.portfolioValue.toLocaleString()}`, icon: 'https://cdn.lordicon.com/mrjuyheh.json', color: 'bg-orange-500' },
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Investor Dashboard</h1>
        <p className="text-gray-600 mt-1">Discover opportunities and manage your portfolio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg flex items-center justify-center`}>
                <lottie-player
                  src={index === 0 ? 'https://assets2.lottiefiles.com/packages/lf20_sSF6EG.json' : index === 1 ? 'https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json' : index === 2 ? 'https://assets10.lottiefiles.com/packages/lf20_siulqk7l.json' : 'https://assets2.lottiefiles.com/packages/lf20_2ks3pjua.json'}
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
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Investment Opportunities</h2>
          <button
            onClick={() => navigate('/opportunities')}
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {recentIdeas.map((idea) => (
            <div
              key={idea.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/ideas/${idea.id}`)}
            >
              <div className="flex items-start gap-4 mb-4">
                {idea.entrepreneur?.avatar_url ? (
                  <img
                    src={idea.entrepreneur.avatar_url}
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Briefcase size={20} className="text-blue-600" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{idea.title}</h3>
                  <p className="text-sm text-gray-600">{idea.industry}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{idea.description}</p>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-500">Funding Goal</p>
                  <p className="font-semibold text-gray-900">${Number(idea.funding_goal).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Stage</p>
                  <p className="font-semibold text-gray-900 capitalize">{idea.stage || 'Idea'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
          <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_siulqk7l.json" background="transparent" speed="1" loop autoplay style={{ width: 40, height: 40 }} />
          <h3 className="text-2xl font-bold mb-2">AI Recommendations</h3>
          <p className="text-blue-100 mb-6">
            Get personalized startup recommendations based on your investment preferences
          </p>
          <button
            onClick={() => navigate('/recommendations')}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            View Recommendations
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-8 text-white shadow-lg">
          <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_2ks3pjua.json" background="transparent" speed="1" loop autoplay style={{ width: 40, height: 40 }} />
          <h3 className="text-2xl font-bold mb-2">Portfolio Analytics</h3>
          <p className="text-purple-100 mb-6">
            Track your investments, ROI, and portfolio performance over time
          </p>
          <button
            onClick={() => navigate('/portfolio')}
            className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
          >
            View Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
