import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, Clock } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  event_date: string;
  duration_minutes: number;
  max_participants: number;
  registration_url: string;
  organizer: {
    full_name: string;
    avatar_url: string;
  };
}

export function Events() {
  const { profile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | 'webinar' | 'networking' | 'conference'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [filter]);

  const loadEvents = async () => {
    try {
      let query = supabase
        .from('events')
        .select(`
          *,
          organizer:organizer_id(full_name, avatar_url)
        `)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (filter !== 'all') {
        query = query.eq('event_type', filter);
      }

      const { data } = await query;

      if (data) {
        setEvents(data as any);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: profile.id,
        });

      if (error) {
        if (error.code === '23505') {
          alert('You are already registered for this event');
        } else {
          throw error;
        }
      } else {
        alert('Successfully registered for the event!');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register for event');
    }
  };

  const filterButtons = [
    { value: 'all', label: 'All Events' },
    { value: 'webinar', label: 'Webinars' },
    { value: 'networking', label: 'Networking' },
    { value: 'conference', label: 'Conferences' },
  ];

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
        <h1 className="text-3xl font-bold text-gray-900">Events & Webinars</h1>
        <p className="text-gray-600 mt-1">Discover and join upcoming events</p>
      </div>

      <div className="flex gap-3">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value as any)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === btn.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 text-center shadow-md">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600">Check back later for upcoming events and webinars</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                    {event.event_type}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(event.event_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>
                      {new Date(event.event_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>
                      {new Date(event.event_date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      ({event.duration_minutes} minutes)
                    </span>
                  </div>
                  {event.max_participants && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} />
                      <span>Max {event.max_participants} participants</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleRegister(event.id)}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
