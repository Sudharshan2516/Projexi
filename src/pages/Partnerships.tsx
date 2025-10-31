import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Users } from 'lucide-react';

interface Connection {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export function Partnerships() {
  const { profile } = useAuth();
  const [items, setItems] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const load = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from('connections')
        .select('*')
        .or(`requester_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
        .order('created_at', { ascending: false });
      if (data) setItems(data as any);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'accepted' | 'rejected') => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      await load();
    } catch (e) {
      console.error(e);
      alert('Failed to update partnership');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Partnerships</h1>
        <p className="text-gray-600">View and manage your partnership requests and connections</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <Users size={18} />
            <span className="font-medium">All Partnerships</span>
          </div>
        </div>
        {items.length === 0 ? (
          <div className="p-10 text-center text-gray-600">No partnerships found.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {items.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {c.status === 'pending' ? 'Pending' : c.status === 'accepted' ? 'Accepted' : 'Rejected'} partnership
                  </p>
                  <p className="text-sm text-gray-500">Created {new Date(c.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  {c.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(c.id, 'accepted')}
                        disabled={updatingId === c.id}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(c.id, 'rejected')}
                        disabled={updatingId === c.id}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {c.status !== 'pending' && (
                    <span className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg capitalize">{c.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
