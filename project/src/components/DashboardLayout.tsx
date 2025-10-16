import { ReactNode, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Package,
  Bell,
  MessageCircle,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Lightbulb,
  Users,
  BookOpen,
  GraduationCap,
  Shield,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard } from './GlassCard';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount] = useState(3);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const roleIcons = {
    entrepreneur: TrendingUp,
    investor: DollarSign,
    dealer: Package,
    admin: Shield,
  };

  const RoleIcon = profile ? roleIcons[profile.role] : User;

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    ...(profile?.role === 'entrepreneur'
      ? [
          { icon: Lightbulb, label: 'My Ideas', path: '/ideas' },
          { icon: DollarSign, label: 'Funding', path: '/funding' },
          { icon: Package, label: 'Marketplace', path: '/marketplace' },
        ]
      : []),
    ...(profile?.role === 'investor'
      ? [
          { icon: Lightbulb, label: 'Browse Ideas', path: '/ideas' },
          { icon: TrendingUp, label: 'My Investments', path: '/investments' },
        ]
      : []),
    ...(profile?.role === 'dealer'
      ? [
          { icon: Package, label: 'My Listings', path: '/listings' },
          { icon: TrendingUp, label: 'Leads', path: '/leads' },
        ]
      : []),
    { icon: Users, label: 'Peer Connect', path: '/community' },
    { icon: GraduationCap, label: 'Mentoring', path: '/mentoring' },
    { icon: BookOpen, label: 'Scholarships', path: '/scholarships' },
    ...(profile?.role === 'admin'
      ? [{ icon: Shield, label: 'Admin Panel', path: '/admin' }]
      : []),
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 transform transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="h-full backdrop-blur-xl bg-white/5 border-r border-white/10 p-4 flex flex-col">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">Projexi</h1>
              <p className="text-xs text-white/60">Global Ecosystem</p>
            </div>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-all duration-300
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-500/50'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
              <Link
                to="/messages"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Messages</span>
              </Link>

              <Link
                to="/profile"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <header className="backdrop-blur-xl bg-white/5 border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex items-center gap-2 lg:ml-0 ml-auto">
                {profile?.verified && (
                  <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-medium text-green-400">Verified</span>
                  </div>
                )}

                <button
                  onClick={() => navigate('/notifications')}
                  className="relative p-2 rounded-lg text-white hover:bg-white/10 transition-all"
                >
                  <Bell className="w-6 h-6" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                      {notificationCount}
                    </span>
                  )}
                </button>

                <GlassCard className="!p-2 flex items-center gap-2" hover={false}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <RoleIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-white">{profile?.full_name}</p>
                    <p className="text-xs text-white/60 capitalize">{profile?.role}</p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
