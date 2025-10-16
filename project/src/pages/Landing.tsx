import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, Package, Users, Zap, Shield, Globe } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';

export function Landing() {
  const navigate = useNavigate();
  const [visibleStats, setVisibleStats] = useState([false, false, false, false]);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          visibleStats.forEach((_, i) => {
            setTimeout(() => {
              setVisibleStats((prev) => {
                const newState = [...prev];
                newState[i] = true;
                return newState;
              });
            }, i * 200);
          });
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: 5000, label: 'Entrepreneurs', suffix: '+' },
    { value: 2000, label: 'Investors', suffix: '+' },
    { value: 10, label: 'Million Funded', prefix: '$', suffix: 'M+' },
    { value: 500, label: 'Verified Dealers', suffix: '+' },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'For Entrepreneurs',
      description: 'Post your startup ideas, connect with investors, and access mentoring resources.',
    },
    {
      icon: DollarSign,
      title: 'For Investors',
      description: 'Discover innovative opportunities, fund promising ventures, and build your portfolio.',
    },
    {
      icon: Package,
      title: 'For Dealers',
      description: 'List your products, connect with businesses, and grow your customer base.',
    },
    {
      icon: Users,
      title: 'Peer Networking',
      description: 'Join a vibrant community of entrepreneurs, investors, and industry experts.',
    },
    {
      icon: Shield,
      title: 'KYC Verified',
      description: 'Trusted ecosystem with verified users and secure transactions.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with opportunities and partners from around the world.',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-cyan-900" />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        <nav className="backdrop-blur-xl bg-white/5 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <Zap className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">Projexi</span>
              </div>
              <div className="flex gap-4">
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button variant="primary" onClick={() => navigate('/auth')}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slideRight">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/50">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">
                  The Global Entrepreneurial Ecosystem
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Connect. Fund.{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Grow.
                </span>
              </h1>

              <p className="text-xl text-white/80 leading-relaxed">
                Join the ecosystem that brings entrepreneurs, investors, and dealers together.
                Turn your ideas into reality with verified connections and smart matchmaking.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  onClick={() => navigate('/auth')}
                  className="text-lg px-8 py-4"
                >
                  Join Now
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/auth')}
                  className="text-lg px-8 py-4"
                >
                  Learn More
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 border-2 border-slate-900"
                    />
                  ))}
                </div>
                <div className="text-white/80">
                  <p className="font-semibold">7,500+ Active Members</p>
                  <p className="text-sm text-white/60">Growing every day</p>
                </div>
              </div>
            </div>

            <div className="relative animate-slideLeft">
              <GlassCard className="transform hover:scale-105 transition-transform duration-500">
                <div className="space-y-6 p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">AI-Powered Matching</h3>
                      <p className="text-white/70 text-sm">Find perfect investor matches</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Verified Users</h3>
                      <p className="text-white/70 text-sm">KYC verified ecosystem</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Global Network</h3>
                      <p className="text-white/70 text-sm">Connect worldwide</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        <section ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <GlassCard key={index} hover={false} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.prefix}
                  {visibleStats[index] ? (
                    <span className="counter">{stat.value.toLocaleString()}</span>
                  ) : (
                    '0'
                  )}
                  {stat.suffix}
                </div>
                <div className="text-white/70">{stat.label}</div>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-white/70">
              Comprehensive tools for entrepreneurs, investors, and dealers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard
                  key={index}
                  className="animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` } as any}
                >
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 w-fit mb-4">
                    <Icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <GlassCard className="text-center" hover={false}>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Ideas?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of entrepreneurs, investors, and dealers in the Projexi ecosystem
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/auth')}
              className="text-lg px-12 py-4"
            >
              Get Started Today
            </Button>
          </GlassCard>
        </section>

        <footer className="backdrop-blur-xl bg-white/5 border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Zap className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold text-white">Projexi</span>
              </div>
              <p className="text-white/60 text-sm">
                © 2025 Projexi. The Global Entrepreneurial Ecosystem.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
