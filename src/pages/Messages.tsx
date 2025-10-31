import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Send, User, Search } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface Conversation {
  userId: string;
  userName: string;
  userAvatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export function Messages() {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, [profile]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    if (!profile) return;

    try {
      const { data: messagesData } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, full_name, avatar_url),
          recipient:recipient_id(id, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
        .order('created_at', { ascending: false });

      if (messagesData) {
        const conversationMap = new Map<string, Conversation>();

        messagesData.forEach((msg: any) => {
          const otherUser = msg.sender_id === profile.id ? msg.recipient : msg.sender;
          const userId = otherUser.id;

          if (!conversationMap.has(userId)) {
            conversationMap.set(userId, {
              userId,
              userName: otherUser.full_name || 'User',
              userAvatar: otherUser.avatar_url,
              lastMessage: msg.content,
              lastMessageTime: msg.created_at,
              unreadCount: 0,
            });
          }

          if (msg.recipient_id === profile.id && !msg.read) {
            const conv = conversationMap.get(userId)!;
            conv.unreadCount += 1;
          }
        });

        setConversations(Array.from(conversationMap.values()));
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId: string) => {
    if (!profile) return;

    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${profile.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${profile.id})`)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data);

        await supabase
          .from('messages')
          .update({ read: true })
          .eq('recipient_id', profile.id)
          .eq('sender_id', userId);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile || !selectedConversation) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: profile.id,
          recipient_id: selectedConversation,
          content: newMessage,
        });

      if (error) throw error;

      setNewMessage('');
      await loadMessages(selectedConversation);
      await loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
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
    <div className="h-[calc(100vh-12rem)]">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 h-full flex overflow-hidden">
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <User className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-600">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.userId}
                  onClick={() => setSelectedConversation(conv.userId)}
                  className={`w-full p-4 flex items-start gap-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedConversation === conv.userId ? 'bg-blue-50' : ''
                  }`}
                >
                  {conv.userAvatar ? (
                    <img src={conv.userAvatar} alt="" className="w-12 h-12 rounded-full" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{conv.userName}</h3>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === profile?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-lg ${
                        msg.sender_id === profile?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender_id === profile?.id ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <User className="mx-auto text-gray-400 mb-3" size={64} />
                <p className="text-gray-600">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
