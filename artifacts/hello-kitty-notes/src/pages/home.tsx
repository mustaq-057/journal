import React from 'react';
import { useJournal, ThemeColor } from '@/hooks/use-journal';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodIcon } from '@/components/mood-icon';
import { format } from 'date-fns';

const colorMap: Record<ThemeColor, string> = {
  blush: 'bg-[#FFD1DC] text-[#4A3540]',
  lavender: 'bg-[#E6E6FA] text-[#4A3540]',
  mint: 'bg-[#CFFFE5] text-[#4A3540]',
  peach: 'bg-[#FFDAB9] text-[#4A3540]',
  sky: 'bg-[#D4F0FF] text-[#4A3540]',
};

export function Home() {
  const { entries, isLoaded } = useJournal();

  if (!isLoaded) return null;

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h2 className="font-heading text-4xl text-primary drop-shadow-sm mb-2">Hello, Friend!</h2>
          <p className="text-muted-foreground font-medium">Ready to write down some memories?</p>
        </div>
      </header>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-3xl border-2 border-dashed border-secondary">
          <div className="w-24 h-24 mb-4 opacity-50 bg-secondary rounded-full flex items-center justify-center">
            <span className="font-heading text-4xl text-primary">?</span>
          </div>
          <h3 className="font-heading text-2xl mb-2 text-foreground">No entries yet!</h3>
          <p className="text-muted-foreground mb-6">Let's create something beautiful together.</p>
          <Link href="/entry/new" className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-md hover:bg-accent transition-colors">
            Write my first entry
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/entry/${entry.id}`} className="block h-full">
                  <span className="block h-full group relative bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
                    
                    {/* Color Accent Ribbon */}
                    <div className={`absolute top-0 right-0 w-24 h-24 -mt-12 -mr-12 rotate-45 ${colorMap[entry.color]} opacity-80`} />
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-center gap-2">
                        <MoodIcon mood={entry.mood} className="text-primary" />
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                          {format(entry.createdAt, 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-heading text-2xl mb-3 line-clamp-1 group-hover:text-primary transition-colors relative z-10">
                      {entry.title || 'Dear Diary...'}
                    </h3>
                    
                    <p className="text-foreground/80 line-clamp-3 leading-relaxed relative z-10">
                      {entry.body || 'No content...'}
                    </p>

                    {/* Cute decorative stars on hover */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="#FFB7D1" />
                      </svg>
                    </div>
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
