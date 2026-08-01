import React, { useState } from 'react';
import { useJournal, ThemeColor, Entry, getWordCount, getReadingTime } from '@/hooks/use-journal';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodIcon } from '@/components/mood-icon';
import { format } from 'date-fns';
import { HeroHelloKitty, SadHelloKitty, StickerIcon } from '@/components/hello-kitty-svgs';
import { RichText } from '@/components/rich-text';
import { Search } from 'lucide-react';

const colorMap: Record<string, string> = {
  blush: 'bg-[#FFD1DC] text-[#4A3540] border-[#FFB7D1]',
  lavender: 'bg-[#E6E6FA] text-[#4A3540] border-[#D8BFD8]',
  mint: 'bg-[#CFFFE5] text-[#4A3540] border-[#98FB98]',
  peach: 'bg-[#FFDAB9] text-[#4A3540] border-[#FFCBA4]',
  sky: 'bg-[#D4F0FF] text-[#4A3540] border-[#B0E0E6]',
};

function getColorStyle(color: string) {
  return colorMap[color] || 'bg-[#FFD1DC] text-[#4A3540] border-[#FFB7D1]';
}

function calculateStreak(entries: Entry[]) {
  if (entries.length === 0) return 0;
  let streak = 0;
  const currentDay = new Date().setHours(0,0,0,0);
  
  const days = Array.from(new Set(entries.map(e => new Date(e.createdAt).setHours(0,0,0,0)))).sort((a,b) => b - a);
  
  if (days[0] < currentDay - 86400000) return 0;
  
  for (let i = 0; i < days.length; i++) {
    if (i === 0 || days[i-1] - days[i] === 86400000) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function calculateMostUsedMood(entries: Entry[]) {
  if (entries.length === 0) return null;
  const counts: Record<string, number> = {};
  entries.forEach(e => counts[e.mood] = (counts[e.mood] || 0) + 1);
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] as Entry['mood'];
}

export function Home() {
  const { entries, isLoaded } = useJournal();
  const [search, setSearch] = useState('');

  if (!isLoaded) return (
    <div className="space-y-12 pb-20">
      {/* Search skeleton */}
      <div className="flex flex-col gap-8">
        <div className="w-full max-w-md mx-auto h-14 bg-white rounded-full border-2 border-primary/10 animate-pulse" />

        {/* Hero skeleton */}
        <div className="relative bg-gradient-to-r from-primary/10 to-secondary/20 rounded-[3rem] p-8 overflow-hidden border border-white shadow-sm flex items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            <div className="h-10 bg-primary/20 rounded-full w-3/4 animate-pulse" />
            <div className="h-5 bg-primary/10 rounded-full w-1/2 animate-pulse" />
          </div>
          <div className="w-[200px] h-[140px] bg-primary/10 rounded-3xl animate-pulse shrink-0" />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-4">
          {[0,1,2].map(i => (
            <div key={i} className="bg-white rounded-3xl p-4 text-center border-2 border-border shadow-sm flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-pink-100 animate-pulse" />
              <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-3 w-12 bg-gray-100 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Entry card skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[0,1,2,3].map(i => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-3 bg-pink-200 animate-pulse" />
            <div className="flex items-center gap-3 mb-4 pl-2">
              <div className="w-10 h-10 rounded-2xl bg-pink-100 animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 w-16 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-3 w-10 bg-gray-100 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="pl-2 space-y-3">
              <div className="h-7 bg-gray-100 rounded-full w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded-full w-full animate-pulse" />
              <div className="h-4 bg-gray-100 rounded-full w-5/6 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded-full w-4/6 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );


  const filtered = entries.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) || 
    e.body.toLowerCase().includes(search.toLowerCase()) ||
    e.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const streak = calculateStreak(entries);
  const mostUsedMood = calculateMostUsedMood(entries);

  return (
    <div className="space-y-12 pb-20">
      
      {/* Search & Hero Banner */}
      <div className="flex flex-col gap-8">
        
        {/* Search Bar */}
        <div className="relative w-full max-w-md mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search my memories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white rounded-full border-2 border-primary/20 focus:border-primary outline-none shadow-sm focus:shadow-[0_4px_15px_rgba(255,79,139,0.15)] transition-all font-secondary text-lg"
          />
        </div>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary/10 to-secondary/20 rounded-[3rem] p-8 md:p-12 overflow-hidden border border-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="relative z-10 text-center md:text-left flex-1">
            <h2 className="font-heading text-4xl md:text-5xl text-primary drop-shadow-sm mb-4 leading-tight">
              Welcome back, darling!
            </h2>
            <p className="text-muted-foreground font-secondary text-xl font-medium max-w-md">
              Your journal is a safe place to dream, reflect, and smile.
            </p>
          </div>

          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-full md:w-[300px] h-[200px] shrink-0 relative z-10"
          >
            <HeroHelloKitty className="w-full h-full drop-shadow-xl" />
          </motion.div>
          
          {/* Decorative background sparkles */}
          <StickerIcon name="star" className="absolute top-8 left-8 w-6 h-6 text-yellow-400 opacity-60" />
          <StickerIcon name="heart" className="absolute bottom-8 right-1/2 w-8 h-8 text-primary opacity-30" />
          <StickerIcon name="cloud" className="absolute top-1/2 left-1/3 w-12 h-12 text-white opacity-60" />
        </div>

        {/* Stats Row */}
        {entries.length > 0 && (
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white rounded-3xl p-4 md:p-6 text-center border-2 border-border shadow-sm flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mb-1">
                <StickerIcon name="cloud" className="w-5 h-5" />
              </div>
              <span className="font-heading text-2xl text-foreground">{entries.length}</span>
              <span className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider">Entries</span>
            </div>
            
            <div className="bg-white rounded-3xl p-4 md:p-6 text-center border-2 border-border shadow-sm flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-1">
                <StickerIcon name="star" className="w-5 h-5" />
              </div>
              <span className="font-heading text-2xl text-foreground">{streak} Days</span>
              <span className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider">Streak</span>
            </div>

            <div className="bg-white rounded-3xl p-4 md:p-6 text-center border-2 border-border shadow-sm flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-pink-100 text-primary flex items-center justify-center mb-1">
                {mostUsedMood && <MoodIcon mood={mostUsedMood} className="w-6 h-6" />}
              </div>
              <span className="font-heading text-2xl text-foreground capitalize">{mostUsedMood || '-'}</span>
              <span className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider">Top Mood</span>
            </div>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[3rem] border-4 border-dashed border-secondary shadow-sm"
        >
          <SadHelloKitty className="w-48 h-auto mb-6 opacity-80 drop-shadow-md" />
          <h3 className="font-heading text-3xl mb-3 text-foreground">
            {search ? "No entries found!" : "Your journal is empty"}
          </h3>
          <p className="text-muted-foreground font-secondary text-lg mb-8 max-w-sm">
            {search ? "Try searching for something else." : "Let's fill these pages with beautiful memories."}
          </p>
          {!search && (
            <Link href="/entry/new" className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-[0_8px_20px_rgba(255,79,139,0.3)] hover:scale-105 transition-all text-lg font-secondary">
              Write my first entry
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <AnimatePresence>
            {filtered.map((entry, i) => {
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 100 }}
                >
                  <Link href={`/entry/${entry.id}`} className="block h-full">
                    <span className="flex flex-col h-full group relative bg-white p-6 md:p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-[0_12px_30px_rgba(255,79,139,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden z-10">
                      
                      {/* Pastel Color Stripe */}
                      <div className={`absolute top-0 left-0 bottom-0 w-3 ${getColorStyle(entry.color)} opacity-90`} />
                      
                      {/* Cute Corner Ribbon */}
                      <div className={`absolute -top-12 -right-12 w-24 h-24 rotate-45 ${getColorStyle(entry.color)} opacity-50 z-0`} />
                      
                      <div className="flex justify-between items-start mb-4 relative z-10 pl-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-2xl ${getColorStyle(entry.color).split(' ')[0]} shadow-inner`}>
                            <MoodIcon mood={entry.mood} className="text-[#4A3540] w-6 h-6" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-heading text-lg text-primary leading-tight">
                              {format(entry.createdAt, 'MMM dd')}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {format(entry.createdAt, 'yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pl-2 relative z-10 flex-1 flex flex-col">
                        <h3 className="font-heading text-2xl md:text-3xl mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                          {entry.title || 'Dear Diary...'}
                        </h3>
                        
                        <p className="font-secondary text-foreground/80 line-clamp-3 leading-relaxed mb-6 text-lg">
                          <RichText content={entry.body} />
                        </p>

                        <div className="mt-auto flex flex-col gap-4">
                          {/* Tags */}
                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {entry.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-secondary/30 text-primary font-bold text-xs rounded-full border border-primary/20">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Character count */}
                          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider opacity-60">
                            <StickerIcon name="star" className="w-3 h-3" />
                            <span>{entry.body.replace(/<[^>]*>/g, '').trim().length} characters</span>
                          </div>
                        </div>
                      </div>

                      {/* Hover sparkle */}
                      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-10 scale-50 group-hover:scale-100 duration-300 text-primary">
                        <StickerIcon name="bow" className="w-8 h-8" />
                      </div>
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
