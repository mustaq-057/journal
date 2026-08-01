import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useJournal, Mood, ThemeColor } from '@/hooks/use-journal';
import { MoodIcon } from '@/components/mood-icon';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Save, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const MOODS: Mood[] = ['happy', 'sad', 'excited', 'calm', 'tired', 'loved'];
const COLORS: { id: ThemeColor; value: string; label: string }[] = [
  { id: 'blush', value: '#FFD1DC', label: 'Blush' },
  { id: 'lavender', value: '#E6E6FA', label: 'Lavender' },
  { id: 'mint', value: '#CFFFE5', label: 'Mint' },
  { id: 'peach', value: '#FFDAB9', label: 'Peach' },
  { id: 'sky', value: '#D4F0FF', label: 'Sky' },
];

export function Editor() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { entries, addEntry, updateEntry, deleteEntry, isLoaded } = useJournal();
  const isNew = !params.id || params.id === 'new';

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState<Mood>('happy');
  const [color, setColor] = useState<ThemeColor>('blush');
  const [showSparkle, setShowSparkle] = useState(false);

  useEffect(() => {
    if (isLoaded && !isNew) {
      const entry = entries.find(e => e.id === params.id);
      if (entry) {
        setTitle(entry.title);
        setBody(entry.body);
        setMood(entry.mood);
        setColor(entry.color);
      } else {
        setLocation('/');
      }
    }
  }, [isLoaded, isNew, params.id, entries, setLocation]);

  const handleSave = () => {
    if (!title.trim() && !body.trim()) return;

    setShowSparkle(true);
    
    if (isNew) {
      const entry = addEntry({ title, body, mood, color });
      setTimeout(() => {
        setShowSparkle(false);
        setLocation(`/entry/${entry.id}`);
      }, 1000);
    } else {
      updateEntry(params.id as string, { title, body, mood, color });
      setTimeout(() => setShowSparkle(false), 1000);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to throw away this note?')) {
      deleteEntry(params.id as string);
      setLocation('/');
    }
  };

  const dateStr = isNew 
    ? format(Date.now(), 'MMMM do, yyyy')
    : entries.find(e => e.id === params.id)?.createdAt 
      ? format(entries.find(e => e.id === params.id)!.createdAt, 'MMMM do, yyyy')
      : format(Date.now(), 'MMMM do, yyyy');

  if (!isLoaded) return null;

  return (
    <div className="max-w-3xl mx-auto pb-20 relative">
      
      <AnimatePresence>
        {showSparkle && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-white/20 backdrop-blur-[2px]">
            <div className="relative">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1, rotate: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 0], 
                    x: Math.cos(i * 30 * Math.PI / 180) * 150,
                    y: Math.sin(i * 30 * Math.PI / 180) * 150,
                    opacity: [1, 1, 0],
                    rotate: 180
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute w-6 h-6 text-accent"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
                  </svg>
                </motion.div>
              ))}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="font-heading text-4xl text-accent drop-shadow-md"
              >
                Saved! ~
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <header className="flex items-center justify-between mb-8">
        <button 
          onClick={() => setLocation('/')}
          className="p-2 rounded-full hover:bg-secondary/50 text-muted-foreground transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <div className="flex gap-3">
          {!isNew && (
            <button 
              onClick={handleDelete}
              className="p-3 rounded-2xl bg-white border border-border text-red-400 hover:bg-red-50 hover:text-red-500 shadow-sm transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow-md hover:shadow-lg hover:bg-accent transition-all active:scale-95"
          >
            <Save className="w-5 h-5" />
            <span>Save Note</span>
          </button>
        </div>
      </header>

      <div className="bg-card rounded-[2.5rem] shadow-sm border border-border/50 p-6 md:p-12 overflow-hidden relative">
        {/* Decorative corner */}
        <div 
          className="absolute top-0 right-0 w-48 h-48 -mr-24 -mt-24 rounded-full opacity-30 transition-colors duration-500"
          style={{ backgroundColor: COLORS.find(c => c.id === color)?.value }}
        />

        <div className="mb-8 relative z-10">
          <p className="font-heading text-xl md:text-2xl text-primary/80 mb-2">Dear Diary, it's {dateStr}</p>
          <input
            type="text"
            placeholder="Title of my day..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl md:text-4xl font-heading text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/50 focus:ring-0"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-8 relative z-10 p-6 bg-background/50 rounded-3xl border border-border/30">
          <div className="flex-1">
            <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">How are you feeling?</label>
            <div className="flex gap-2 flex-wrap">
              {MOODS.map(m => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={cn(
                    "p-3 rounded-2xl transition-all duration-300",
                    mood === m 
                      ? "bg-primary text-white shadow-md scale-110" 
                      : "bg-white text-muted-foreground hover:bg-secondary/50 hover:text-foreground hover:scale-105"
                  )}
                >
                  <MoodIcon mood={m} className="w-7 h-7" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Theme Color</label>
            <div className="flex gap-3">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={cn(
                    "w-12 h-12 rounded-full transition-all duration-300 border-4",
                    color === c.id ? "border-primary scale-110 shadow-md" : "border-white hover:scale-105 shadow-sm"
                  )}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </div>

        <textarea
          placeholder="What happened today?..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full min-h-[400px] text-lg leading-relaxed text-foreground bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50 focus:ring-0 relative z-10"
        />
      </div>
    </div>
  );
}
