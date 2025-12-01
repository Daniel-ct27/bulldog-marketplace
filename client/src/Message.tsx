import React, { useState } from 'react';
import { useUser } from './UserContext';
import { Send, Search, MoreVertical, ArrowLeft, Paperclip, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: number;
  sender: 'user' | 'other';
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

const MessagingPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState<boolean>(false);
  const [convError, setConvError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  const handleSendMessage = async (): Promise<void> => {
    const content = messageInput.trim();
    if (!content) return;

    if (!user || !user.id) {
      setConvError('You must be logged in to send messages');
      return;
    }

    try {
      // ensure a conversation exists
      let convId = activeConversationId;
      if (!convId) {
        const createRes = await fetch(`${API_BASE}/conversations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ other_user_id: selectedConversation, user_id: user.id }),
        });
        if (!createRes.ok) throw new Error('failed to create conversation');
        const createJson = await createRes.json();
        convId = createJson.conversation_id;
        setActiveConversationId(convId);
      }

      // send message
      const sendRes = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ conversation_id: convId, sender_id: user.id, content }),
      });

      if (!sendRes.ok) {
        const body = await sendRes.text();
        console.error('send message failed', sendRes.status, body);
        setConvError('Failed to send message');
        return;
      }

      const created = await sendRes.json();
      const newMessage: Message = {
        id: created.id,
        sender: created.sender_id === user.id ? 'user' : 'other',
        text: created.content,
        time: new Date(created.sent_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');
    } catch (e) {
      console.error('Failed to send message', e);
      setConvError('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const { user } = useUser();

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  // default to /api so dev proxy and server endpoints (namespaced under /api) are used
  const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? '/api';

  React.useEffect(() => {
    const load = async () => {
      setLoadingConversations(true);
      setConvError(null);
      try {
        const res = await fetch(`${API_BASE}/get_users`, { credentials: 'include' });
        if (!res.ok) throw new Error(`status:${res.status}`);
        const data = await res.json();
        const serverUsers: any[] = Array.isArray(data) ? data : [];
        const loggedId = (user && user.id) || null;
        const listToMap = loggedId ? serverUsers.filter(u => u.id !== loggedId) : serverUsers;

        const convs: Conversation[] = listToMap.map((u: any, idx: number) => ({
          id: u.id ?? idx + 1,
          name: u.name || u.username || `User ${u.id}`,
          lastMessage: '',
          time: '',
          unread: 0,
          avatar: (u.name || u.username || '').trim().split(/\s+/).slice(0,2).map((p:any)=>p[0]).join('').toUpperCase(),
        }));

        setConversations(convs);
        setConvError(null);
      } catch (e) {
        console.error('Failed to load conversations', e);
        setConvError('Failed to load users — ensure backend is running and dev proxy is configured');
      } finally {
        setLoadingConversations(false);
      }
    };

    load();
  }, [user]);

  const handleSelectContact = async (contactId: number) => {
    setSelectedConversation(contactId);
    setMessages([]);
    setActiveConversationId(null);

    if (!user || !user.id) {
      setConvError('Please log in to start a conversation');
      return;
    }

    try {
      const createRes = await fetch(`${API_BASE}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ other_user_id: contactId, user_id: user.id }),
      });

      if (!createRes.ok) {
        const rbody = await createRes.text();
        console.error('create conversation failed', createRes.status, rbody);
        setConvError('Failed to create or find conversation');
        return;
      }

      const { conversation_id } = await createRes.json();
      setActiveConversationId(conversation_id);

      setLoadingMessages(true);
      const msgRes = await fetch(`${API_BASE}/conversations/${conversation_id}/messages`, { credentials: 'include' });
      if (!msgRes.ok) {
        console.error('failed to load messages', msgRes.status, await msgRes.text());
        setConvError('Failed to load messages');
        return;
      }

      const msgs = await msgRes.json();
      const mapped: Message[] = (Array.isArray(msgs) ? msgs : []).sort((a:any,b:any)=> new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()).map((m:any)=>({
        id: m.id,
        sender: m.sender_id === user.id ? 'user' : 'other',
        text: m.content,
        time: new Date(m.sent_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      }));

      setMessages(mapped);
      setConvError(null);
    } catch (e) {
      console.error('failed to open conversation', e);
      setConvError('Failed to open conversation');
    } finally {
      setLoadingMessages(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/account")}
            className="flex items-center space-x-2 px-6 py-3 mb-6 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium tracking-wide">Back to Account</span>
          </button>
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent tracking-tight">
            MESSAGES
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-240px)]">
          {/* Conversations List */}
          <div className="col-span-4 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-700/50 flex flex-col">
            {/* Search */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {loadingConversations && (
                <div className="p-6 text-center text-slate-400">Loading users...</div>
              )}
              {convError && !loadingMessages && (
                <div className="p-6 text-center text-amber-400">{convError}</div>
              )}
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectContact(conv.id)}
                  className={`w-full p-5 flex items-center space-x-4 hover:bg-slate-700/30 transition-all duration-200 border-b border-slate-700/30 ${
                    selectedConversation === conv.id ? 'bg-slate-700/50' : ''
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">{conv.avatar}</span>
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-bold tracking-wide truncate">{conv.name}</h3>
                      <span className="text-slate-400 text-sm flex-shrink-0 ml-2">{conv.time}</span>
                    </div>
                    <p className="text-slate-400 text-sm truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{conv.unread}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-700/50 flex flex-col">
            {/* Chat Header */}
            {selectedConv && (
              <div className="p-6 border-b border-slate-700/50 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{selectedConv.avatar}</span>
                  </div>
                  <div>
                    <h2 className="text-white text-2xl font-bold tracking-wide">{selectedConv.name}</h2>
                    <p className="text-emerald-400 text-sm flex items-center">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                      Active now
                    </p>
                  </div>
                </div>
                <button className="p-3 hover:bg-slate-700/50 rounded-xl transition-colors">
                  <MoreVertical className="w-6 h-6 text-slate-400" />
                </button>
              </div>
            )}

            {/* Messages */}
            {!selectedConv && (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center px-6 py-8">
                  <h3 className="text-2xl font-bold mb-2">No conversation selected</h3>
                  <p className="text-sm">Select a contact from the left to view messages.</p>
                </div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingMessages && (
                <div className="text-center text-slate-400 w-full my-4">Loading messages…</div>
              )}
              {convError && selectedConv && (
                <div className="text-center text-amber-400 w-full my-4">{convError}</div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-lg">
                    <div
                      className={`px-6 py-4 rounded-3xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm'
                          : 'bg-slate-800/80 text-white rounded-bl-sm'
                      }`}
                    >
                      <p className="text-base leading-relaxed">{message.text}</p>
                    </div>
                    <p className={`text-slate-500 text-xs mt-2 px-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-slate-700/50 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <button className="p-3 hover:bg-slate-700/50 rounded-xl transition-colors flex-shrink-0">
                  <Paperclip className="w-6 h-6 text-slate-400" />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedConv ? 'Type your message...' : 'Select a contact to start a conversation'}
                  disabled={!selectedConv}
                  className="flex-1 px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-base"
                />
                <button className="p-3 hover:bg-slate-700/50 rounded-xl transition-colors flex-shrink-0">
                  <Smile className="w-6 h-6 text-slate-400" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!selectedConv}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl text-white font-bold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 flex items-center space-x-2 flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                  <span className="tracking-wide">SEND</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;