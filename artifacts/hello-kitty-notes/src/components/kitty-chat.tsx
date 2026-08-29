import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2 } from 'lucide-react';
import { StickerIcon } from './hello-kitty-svgs';
import { cn } from '@/lib/utils';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}

const STARTER_PROMPTS = [
  "I had a tough day...",
  "Something exciting happened!",
  "I've been overthinking again",
  "Tell me something honest",
];

const DEFAULT_MSG: Message = {
  role: 'assistant',
  content: "the room's been quiet without you. i've been here the whole time, re-reading your handwriting. what's going on today?"
};

export function KittyChat() {
  const [messages, setMessages] = useState<Message[]>([DEFAULT_MSG]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const [showStarters, setShowStarters] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const baseUrl = import.meta.env.VITE_API_URL || '';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat history from Neon DB on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/chat`);
        if (res.ok) {
          const data: Message[] = await res.json();
          if (data.length > 0) {
            setMessages(data);
            setShowStarters(false);
          }
        }
      } catch (err) {
        console.error('Failed to load chat history', err);
      } finally {
        setIsFetchingHistory(false);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages, isLoading]);

  const saveMessage = async (role: string, content: string): Promise<Message> => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, content }),
    });
    return res.json();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setShowStarters(false);
    const userMessage = text.trim();
    setInput('');
    setIsLoading(true);

    // Optimistic UI update: show message immediately
    const tempUserMsg: Message = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      // Fire off DB save for user message in background
      saveMessage('user', userMessage).catch(console.error);

      // Fetch AI response
      const res = await fetch(`${baseUrl}/api/ai/kitty-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: messages.slice(-8).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error: ' + res.status);
      if (data.reply) {
        // Optimistic UI update for AI reply
        const tempAiMsg: Message = { role: 'assistant', content: data.reply };
        setMessages(prev => [...prev, tempAiMsg]);
        // Fire off DB save for AI message in background
        saveMessage('assistant', data.reply).catch(console.error);
      }
    } catch (err: any) {
      const errMsg = `oh no i lost signal for a second... [Error: ${err.message || String(err)}]`;
      await saveMessage('assistant', errMsg).catch(() => null);
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearHistory = async () => {
    try {
      await fetch(`${baseUrl}/api/chat`, { method: 'DELETE' });
      setMessages([DEFAULT_MSG]);
      setShowStarters(true);
    } catch (err) {
      console.error('Failed to clear chat', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="relative rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(255,79,139,0.15)] border border-primary/10">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff0f6] via-white to-[#f0e6ff] pointer-events-none" />

      {/* Top shimmer bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

      {/* Header */}
      <div className="relative z-10 px-8 pt-7 pb-5 flex items-center gap-5 border-b border-primary/10">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/20 flex items-center justify-center shadow-md">
            <StickerIcon name="bow" className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white shadow" />
        </div>
        <div>
          <h3 className="font-heading text-2xl text-foreground leading-none">Batman AI</h3>
          <p className="text-xs font-bold text-green-500 tracking-wide mt-1">● always here</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={clearHistory}
            title="Clear chat history"
            className="p-2 rounded-full text-muted-foreground hover:text-red-400 hover:bg-red-50 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="relative z-10 h-[440px] overflow-y-auto px-6 py-5 space-y-4 scroll-smooth"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,79,139,0.2) transparent' }}>

        {isFetchingHistory ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex gap-1.5">
              {[0, 150, 300].map((delay) => (
                <motion.div
                  key={delay}
                  className="w-2 h-2 rounded-full bg-primary/40"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: delay / 1000 }}
                />
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id || i}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className={cn(
                  'flex',
                  msg.role === 'assistant' ? 'justify-start' : 'justify-end'
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center mr-2 mt-1 shrink-0 self-end">
                    <StickerIcon name="bow" className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[76%] px-5 py-3.5 font-secondary text-[15px] leading-relaxed shadow-sm',
                    msg.role === 'assistant'
                      ? 'bg-white/90 backdrop-blur-sm text-foreground rounded-[1.5rem] rounded-bl-sm border border-white/80'
                      : 'bg-gradient-to-br from-primary to-[#e85d95] text-white rounded-[1.5rem] rounded-br-sm'
                  )}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-end gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                  <StickerIcon name="bow" className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-white/90 border border-white/80 px-5 py-4 rounded-[1.5rem] rounded-bl-sm shadow-sm flex gap-1.5 items-center">
                  {[0, 150, 300].map((delay) => (
                    <motion.div
                      key={delay}
                      className="w-2 h-2 rounded-full bg-primary/50"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay: delay / 1000 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter prompts */}
      <AnimatePresence>
        {showStarters && !isFetchingHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-10 px-6 pb-3 flex flex-wrap gap-2"
          >
            {STARTER_PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm hover:bg-primary/20 hover:scale-105 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <div className="relative z-10 px-6 pb-6 pt-2">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-primary/20 rounded-full px-5 py-3 shadow-sm focus-within:border-primary/50 focus-within:shadow-[0_0_0_3px_rgba(255,79,139,0.1)] transition-all"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="say something to me…"
            className="flex-1 bg-transparent border-none outline-none font-secondary text-base placeholder:text-muted-foreground/50 text-foreground"
            disabled={isLoading || isFetchingHistory}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[#e85d95] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-md cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-center text-[10px] font-bold text-muted-foreground/50 mt-2 tracking-widest uppercase">
          Batman AI reads between the lines
        </p>
      </div>
    </div>
  );
}
