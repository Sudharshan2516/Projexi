import { useState, useEffect } from 'react';
import { Search, ExternalLink, Calendar, DollarSign } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Input } from '../components/Input';
import { supabase, Scholarship } from '../lib/supabase';

export function Scholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .order('deadline', { ascending: true });

    if (!error && data) {
      setScholarships(data);
    }
  };

  const filteredScholarships = scholarships.filter(
    (scholarship) =>
      scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Scholarship Database</h1>
        <p className="text-white/70">Discover funding opportunities for your education and growth</p>
      </div>

      <GlassCard hover={false}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <Input
            placeholder="Search scholarships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredScholarships.length === 0 ? (
          <GlassCard hover={false} className="md:col-span-2">
            <div className="text-center py-12">
              <p className="text-white/70">No scholarships found</p>
            </div>
          </GlassCard>
        ) : (
          filteredScholarships.map((scholarship) => (
            <GlassCard key={scholarship.id}>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{scholarship.title}</h3>
                  <p className="text-white/70 text-sm line-clamp-3">{scholarship.description}</p>
                </div>

                <div className="space-y-2 text-sm">
                  {scholarship.amount && (
                    <div className="flex items-center gap-2 text-white/80">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span>${scholarship.amount.toLocaleString()}</span>
                    </div>
                  )}

                  {scholarship.deadline && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {scholarship.eligibility && (
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs text-white/60 mb-1">Eligibility:</p>
                    <p className="text-sm text-white/80">{scholarship.eligibility}</p>
                  </div>
                )}

                {scholarship.link && (
                  <a
                    href={scholarship.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Apply Now
                  </a>
                )}
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
