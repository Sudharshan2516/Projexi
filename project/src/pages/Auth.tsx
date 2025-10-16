import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, Package, Eye, EyeOff } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../lib/supabase';
import { HUD } from '../components/HUD';

const roles = [
  {
    id: 'entrepreneur' as UserRole,
    icon: TrendingUp,
    title: 'Entrepreneur',
    description: 'Post startup ideas and connect with investors',
  },
  {
    id: 'investor' as UserRole,
    icon: DollarSign,
    title: 'Investor',
    description: 'Discover opportunities and fund innovative ideas',
  },
  {
    id: 'dealer' as UserRole,
    icon: Package,
    title: 'Dealer',
    description: 'Supply materials and connect with businesses',
  },
];

export function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('entrepreneur');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 33, label: 'Weak' };
    if (password.length < 10) return { strength: 66, label: 'Medium' };
    return { strength: 100, label: 'Strong' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp && !fullName) {
      newErrors.fullName = 'Full name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    HUD.show(isSignUp ? 'Creating your account...' : 'Signing you in...');

    try {
      if (isSignUp) {
        await signUp(email, password, fullName, selectedRole);
      } else {
        await signIn(email, password);
      }
      HUD.hide();
      navigate('/dashboard');
    } catch (error: any) {
      HUD.hide();
      setErrors({ submit: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-cyan-900" />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-5xl" hover={false}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Welcome to Projexi
                </h1>
                <p className="text-white/70">
                  The Global Entrepreneurial Ecosystem
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-white/80 text-sm font-medium">
                  {isSignUp ? 'Select your role:' : 'Sign in to continue'}
                </p>

                {isSignUp && (
                  <div className="grid gap-3">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      const isSelected = selectedRole === role.id;

                      return (
                        <button
                          key={role.id}
                          onClick={() => setSelectedRole(role.id)}
                          className={`
                            p-4 rounded-xl text-left transition-all duration-300
                            border-2
                            ${
                              isSelected
                                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500'
                                : 'bg-white/5 border-white/10 hover:border-white/30'
                            }
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`
                              p-2 rounded-lg
                              ${isSelected ? 'bg-blue-500' : 'bg-white/10'}
                            `}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white mb-1">
                                {role.title}
                              </h3>
                              <p className="text-sm text-white/70">
                                {role.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-4 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Verified ecosystem of entrepreneurs and investors</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                  <span>Skill-based mentoring and peer networking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Direct dealer marketplace access</span>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </h2>
                  <p className="text-white/70 text-sm">
                    {isSignUp ? 'Join the ecosystem today' : 'Welcome back!'}
                  </p>
                </div>

                {isSignUp && (
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    error={errors.fullName}
                  />
                )}

                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[42px] text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {isSignUp && password && (
                  <div className="space-y-2">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.strength === 33
                            ? 'bg-red-500'
                            : passwordStrength.strength === 66
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                    {passwordStrength.label && (
                      <p className="text-xs text-white/70">
                        Password strength: {passwordStrength.label}
                      </p>
                    )}
                  </div>
                )}

                {errors.submit && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-sm text-red-300">{errors.submit}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={loading}
                >
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setErrors({});
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {isSignUp
                      ? 'Already have an account? Sign in'
                      : "Don't have an account? Sign up"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
