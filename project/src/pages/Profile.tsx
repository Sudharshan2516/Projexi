import { useState, useEffect } from 'react';
import { Camera, Shield, Upload } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { HUD } from '../components/HUD';

export function Profile() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name,
        bio: profile.bio || '',
        location: profile.location || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    HUD.show('Updating profile...');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          location: formData.location,
        })
        .eq('id', profile?.id);

      if (error) throw error;

      await refreshProfile();
      HUD.hide();
    } catch (error: any) {
      HUD.hide();
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-white/70">Manage your account and verification status</p>
      </div>

      <GlassCard hover={false}>
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
              {profile?.full_name.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{profile?.full_name}</h2>
            <p className="text-white/70 capitalize mb-2">{profile?.role}</p>
            {profile?.verified && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Verified</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Bio</label>
            <textarea
              className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              rows={4}
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <Input
            label="Location"
            placeholder="City, Country"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <Button type="submit" variant="primary" loading={loading} className="w-full">
            Save Changes
          </Button>
        </form>
      </GlassCard>

      {!profile?.verified && (
        <GlassCard className="border-yellow-500/50 bg-yellow-500/10" hover={false}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <Shield className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Get Verified</h3>
              <p className="text-white/70 mb-4">
                Upload your KYC documents to get verified and unlock premium features.
              </p>
              <Button variant="primary">
                <Upload className="w-5 h-5 mr-2" />
                Upload Documents
              </Button>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
