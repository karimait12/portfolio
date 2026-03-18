import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Message as MessageType } from '../../lib/supabase/types';
import { Mail, Trash2, Check } from 'lucide-react';

export function MessagesManager() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }
    setMessages(data || []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from('messages').update({ status: 'read' }).eq('id', id);
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this message?')) {
      await supabase.from('messages').delete().eq('id', id);
      fetchMessages();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-accent">Messages</h2>
        <span className="text-gray-400 font-mono">
          {messages.filter(m => m.status === 'new').length} unread
        </span>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="tech-border bg-background/50 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <Mail size={18} className={msg.status === 'new' ? 'text-accent neon-glow' : 'text-gray-500'} />
                <div>
                  <h3 className={`font-bold ${msg.status === 'new' ? 'text-accent' : 'text-gray-400'}`}>
                    {msg.name}
                  </h3>
                  <p className="text-gray-500 font-mono text-sm">{msg.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono px-2 py-1 border ${
                  msg.status === 'new'
                    ? 'text-accent border-accent'
                    : 'text-gray-500 border-gray-500'
                }`}>
                  {msg.status}
                </span>
                <button
                  onClick={() => markAsRead(msg.id)}
                  className="p-2 text-accent hover:bg-accent/10"
                  title="Mark as read"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="p-2 text-red-400 hover:bg-red-900/20"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <p className="text-gray-400 font-mono text-sm bg-background/80 p-3 border border-accent-dim">
              {msg.message}
            </p>
            <p className="text-gray-500 font-mono text-xs mt-2">
              {new Date(msg.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
