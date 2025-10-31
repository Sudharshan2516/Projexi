import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Users, Briefcase, Package, TrendingUp, MessageSquare, Calendar, Shield, AlertCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export function Admin() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    entrepreneurs: 0,
    investors: 0,
    dealers: 0,
    totalIdeas: 0,
    totalProducts: 0,
    totalInvestments: 0,
    totalMessages: 0,
    totalEvents: 0,
    communityPosts: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [
        { count: totalUsers },
        { count: entrepreneurs },
        { count: investors },
        { count: dealers },
        { count: totalIdeas },
        { count: totalProducts },
        { count: totalInvestments },
        { count: totalMessages },
        { count: totalEvents },
        { count: communityPosts },
        { data: users }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'entrepreneur'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'investor'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'dealer'),
        supabase.from('ideas').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('investments').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('community_posts').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(10),
      ]);

      setStats({
        totalUsers: totalUsers || 0,
        entrepreneurs: entrepreneurs || 0,
        investors: investors || 0,
        dealers: dealers || 0,
        totalIdeas: totalIdeas || 0,
        totalProducts: totalProducts || 0,
        totalInvestments: totalInvestments || 0,
        totalMessages: totalMessages || 0,
        totalEvents: totalEvents || 0,
        communityPosts: communityPosts || 0,
      });

      if (users) {
        setRecentUsers(users);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (profile?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { label: 'Entrepreneurs', value: stats.entrepreneurs, icon: Briefcase, color: 'bg-green-500' },
    { label: 'Investors', value: stats.investors, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Dealers', value: stats.dealers, icon: Package, color: 'bg-orange-500' },
    { label: 'Total Ideas', value: stats.totalIdeas, icon: Briefcase, color: 'bg-blue-400' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-green-400' },
    { label: 'Investments', value: stats.totalInvestments, icon: TrendingUp, color: 'bg-purple-400' },
    { label: 'Messages', value: stats.totalMessages, icon: MessageSquare, color: 'bg-orange-400' },
    { label: 'Events', value: stats.totalEvents, icon: Calendar, color: 'bg-red-400' },
    { label: 'Community Posts', value: stats.communityPosts, icon: MessageSquare, color: 'bg-pink-400' },
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
      <div className="flex items-center gap-3">
        <Shield className="text-blue-600" size={40} />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform management and analytics</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
        <div>
          <h3 className="font-semibold text-yellow-900 mb-1">Admin Access</h3>
          <p className="text-sm text-yellow-700">
            You have full access to platform data and management tools. Use responsibly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className={`${stat.color} p-3 rounded-lg inline-block mb-3`}>
              <stat.icon className="text-white" size={24} />
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users size={20} className="text-blue-600" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{user.full_name || 'User'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.verified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
          <Users size={32} className="mb-4" />
          <h3 className="text-2xl font-bold mb-2">User Management</h3>
          <p className="text-blue-100 mb-6">
            View, verify, and manage all users on the platform
          </p>
          <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
            Manage Users
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-8 text-white shadow-lg">
          <TrendingUp size={32} className="mb-4" />
          <h3 className="text-2xl font-bold mb-2">Analytics</h3>
          <p className="text-purple-100 mb-6">
            View detailed analytics and platform performance metrics
          </p>
          <button className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
