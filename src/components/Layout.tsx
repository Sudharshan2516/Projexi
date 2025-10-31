import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bell, MessageSquare, LogOut, User, Home, Briefcase, Users, TrendingUp, Calendar, Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getDashboardNavigation = () => {
    const baseNav = [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: MessageSquare, label: 'Messages', path: '/messages' },
      { icon: Users, label: 'Community', path: '/community' },
      { icon: Calendar, label: 'Events', path: '/events' },
      { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    if (profile?.role === 'entrepreneur') {
      baseNav.splice(1, 0, { icon: Briefcase, label: 'My Ideas', path: '/my-ideas' });
      baseNav.splice(2, 0, { icon: TrendingUp, label: 'Find Investors', path: '/find-investors' });
    } else if (profile?.role === 'investor') {
      baseNav.splice(1, 0, { icon: Briefcase, label: 'Opportunities', path: '/opportunities' });
      baseNav.splice(2, 0, { icon: TrendingUp, label: 'Portfolio', path: '/portfolio' });
    } else if (profile?.role === 'dealer') {
      baseNav.splice(1, 0, { icon: Briefcase, label: 'My Products', path: '/my-products' });
      baseNav.splice(2, 0, { icon: TrendingUp, label: 'Opportunities', path: '/opportunities' });
      baseNav.splice(3, 0, { icon: Users, label: 'Find Clients', path: '/find-clients' });
    } else if (profile?.role === 'admin') {
      baseNav.unshift({ icon: Shield, label: 'Admin Panel', path: '/admin' });
    }

    return baseNav;
  };

  if (!profile) return <>{children}</>;

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">Projexi</h1>
          <p className="text-sm text-gray-600 mt-1 capitalize">{profile.role} Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {getDashboardNavigation().map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={20} className="text-blue-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{profile.full_name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{profile.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome, {profile.full_name || 'User'}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <MessageSquare size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
