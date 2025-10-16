import { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, Eye, Plus, ArrowUp } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface Stats {
  ideas: number;
  views: number;
  funding: number;
  connections: number;
}

export function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ ideas: 0, views: 0, funding: 0, connections: 0 });
  const [loading, setLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState<Stats>({ ideas: 0, views: 0, funding: 0, connections: 0 });

  useEffect(() => {
    loadStats();
  }, [profile]);

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        ideas: Math.floor(stats.ideas * progress),
        views: Math.floor(stats.views * progress),
        funding: Math.floor(stats.funding * progress),
        connections: Math.floor(stats.connections * progress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedStats(stats);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [stats]);

  const loadStats = async () => {
    if (!profile) return;

    try {
      if (profile.role === 'entrepreneur') {
        const { data: ideas } = await supabase
          .from('ideas')
          .select('views')
          .eq('user_id', profile.id);

        const { data: fundingRequests } = await supabase
          .from('funding_requests')
          .select('amount')
          .eq('entrepreneur_id', profile.id)
          .eq('status', 'accepted');

        const totalViews = ideas?.reduce((sum, idea) => sum + (idea.views || 0), 0) || 0;
        const totalFunding = fundingRequests?.reduce((sum, req) => sum + (req.amount || 0), 0) || 0;

        setStats({
          ideas: ideas?.length || 0,
          views: totalViews,
          funding: totalFunding,
          connections: 0,
        });
      } else if (profile.role === 'investor') {
        const { data: investments } = await supabase
          .from('funding_requests')
          .select('amount')
          .eq('investor_id', profile.id)
          .eq('status', 'accepted');

        const totalInvested = investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;

        setStats({
          ideas: investments?.length || 0,
          views: 0,
          funding: totalInvested,
          connections: 0,
        });
      } else if (profile.role === 'dealer') {
        const { data: listings } = await supabase
          .from('dealer_listings')
          .select('*')
          .eq('dealer_id', profile.id);

        const { data: quotes } = await supabase
          .from('quote_requests')
          .select('*')
          .eq('dealer_id', profile.id);

        setStats({
          ideas: listings?.length || 0,
          views: quotes?.length || 0,
          funding: 0,
          connections: 0,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatsConfig = () => {
    switch (profile?.role) {
      case 'entrepreneur':
        return [
          { icon: TrendingUp, label: 'Active Ideas', value: animatedStats.ideas, color: 'blue' },
          { icon: Eye, label: 'Total Views', value: animatedStats.views, color: 'cyan' },
          { icon: DollarSign, label: 'Funding Raised', value: `$${animatedStats.funding.toLocaleString()}`, color: 'green' },
          { icon: Users, label: 'Connections', value: animatedStats.connections, color: 'purple' },
        ];
      case 'investor':
        return [
          { icon: TrendingUp, label: 'Investments', value: animatedStats.ideas, color: 'blue' },
          { icon: DollarSign, label: 'Total Invested', value: `$${animatedStats.funding.toLocaleString()}`, color: 'green' },
          { icon: Users, label: 'Portfolio', value: animatedStats.connections, color: 'cyan' },
          { icon: Eye, label: 'Opportunities', value: animatedStats.views, color: 'purple' },
        ];
      case 'dealer':
        return [
          { icon: TrendingUp, label: 'Active Listings', value: animatedStats.ideas, color: 'blue' },
          { icon: Eye, label: 'Quote Requests', value: animatedStats.views, color: 'cyan' },
          { icon: DollarSign, label: 'Revenue', value: `$${animatedStats.funding.toLocaleString()}`, color: 'green' },
          { icon: Users, label: 'Customers', value: animatedStats.connections, color: 'purple' },
        ];
      default:
        return [];
    }
  };

  const getQuickActions = () => {
    switch (profile?.role) {
      case 'entrepreneur':
        return [
          { label: 'Post New Idea', icon: Plus, action: () => navigate('/ideas/new'), color: 'blue' },
          { label: 'Browse Investors', icon: Users, action: () => navigate('/ideas'), color: 'cyan' },
          { label: 'Find Mentors', icon: TrendingUp, action: () => navigate('/mentoring'), color: 'green' },
        ];
      case 'investor':
        return [
          { label: 'Browse Ideas', icon: TrendingUp, action: () => navigate('/ideas'), color: 'blue' },
          { label: 'My Investments', icon: DollarSign, action: () => navigate('/investments'), color: 'cyan' },
          { label: 'Update Preferences', icon: Users, action: () => navigate('/profile'), color: 'green' },
        ];
      case 'dealer':
        return [
          { label: 'Add Listing', icon: Plus, action: () => navigate('/listings/new'), color: 'blue' },
          { label: 'View Leads', icon: Users, action: () => navigate('/leads'), color: 'cyan' },
          { label: 'Manage Inventory', icon: TrendingUp, action: () => navigate('/listings'), color: 'green' },
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const statsConfig = getStatsConfig();
  const quickActions = getQuickActions();

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {profile?.full_name}
        </h1>
        <p className="text-white/70">
          Here's what's happening in your ecosystem today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard
              key={index}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` } as any}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-500/20`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <ArrowUp className="w-4 h-4" />
                  <span>12%</span>
                </div>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard>
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.action}
                variant="secondary"
                className="h-24 flex-col hover:scale-105"
              >
                <Icon className="w-8 h-8 mb-2" />
                <span>{action.label}</span>
              </Button>
            );
          })}
        </div>
      </GlassCard>

      {!profile?.verified && (
        <GlassCard className="border-yellow-500/50 bg-yellow-500/10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                Complete Your Verification
              </h3>
              <p className="text-white/70 mb-4">
                Get verified to unlock premium features and build trust in the ecosystem.
              </p>
              <Button onClick={() => navigate('/profile')} variant="primary">
                Start Verification
              </Button>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
