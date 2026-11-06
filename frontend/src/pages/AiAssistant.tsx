import React, { useState } from 'react';
import { chatAssistant } from '../services/api';
import { ProvenanceBadge } from '../components/ProvenanceBadge';
import { Bot, Send, Sparkles, Globe2, CheckCircle2 } from 'lucide-react';

export const AiAssistant: React.FC = () => {
  const [language, setLanguage] = useState<string>('en');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<Array<{
    sender: 'user' | 'assistant';
    text: string;
    sources?: string[];
    confidence?: string;
    status?: string;
  }>>([
    {
      sender: 'assistant',
      text: "Welcome to the Fuji Kyuko Smart Tourism Assistant! I provide verified information regarding Mount Fuji tourism, the Fuji Excursion express trains, Fuji-Q Highland, and JMA live weather. What would you like to know?",
      sources: ["Official Fuji Kyuko Operations Guide"],
      confidence: "Verified Reference",
      status: "Verified Reference"
    }
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await chatAssistant(userText, language);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: res.data.reply,
          sources: res.data.sources_cited,
          confidence: res.data.confidence,
          status: res.data.data_status
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: "I am unable to retrieve verified information from the server right now. Please try again.",
          sources: ["System Error"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    { label: "Fuji Excursion Train Schedule", query: "Tell me about the Fuji Excursion train from Shinjuku to Kawaguchiko" },
    { label: "JMA Live Weather & Visibility", query: "What is the current weather and visibility of Mount Fuji?" },
    { label: "Fuji-Q Highland Passes", query: "What are the attractions and passes for Fuji-Q Highland?" },
    { label: "Chureito Pagoda Access", query: "How do I get to Chureito Pagoda from Shimoyoshida?" }
  ];

  return (
    <div className="space-y-6">
      <div className="classic-card classic-card-gold-top p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a7317] bg-[#fefce8] border border-[#fef08a] px-2 py-0.5 rounded">
              Grounded AI Intelligence
            </span>
            <ProvenanceBadge category="Live data" source="JMA Live API & Fuji Kyuko Timetables" compact />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5 font-serif">
            Multilingual Mount Fuji Tourism AI Assistant
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ground-truth retrieval architecture (English, 日本語, हिन्दी) with traceable citations.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md border border-slate-200">
          <Globe2 className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
          {[
            { id: 'en', label: 'English' },
            { id: 'ja', label: '日本語' },
            { id: 'hi', label: 'हिन्दी' }
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                language === lang.id
                  ? 'bg-[#0c1b33] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-2xl p-4 rounded-xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                    <span className="font-semibold text-slate-600">Traceable Sources: </span>
                    {m.sources.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Bot className="w-4 h-4 animate-bounce text-blue-600" />
              Retrieving verified information...
            </div>
          )}
        </div>

        {/* Preset prompts */}
        <div className="px-4 py-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px] bg-slate-50/50">
          <span className="text-slate-400 shrink-0 font-medium">Quick Queries:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputMessage(q.query);
              }}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-slate-700 hover:border-blue-400 hover:text-blue-600 shrink-0 transition-colors"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about trains, bus routes, tickets, Mount Fuji trails, or weather..."
            className="flex-1 px-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
