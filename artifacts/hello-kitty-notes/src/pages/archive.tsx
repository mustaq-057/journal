import React, { useMemo } from 'react';
import { useJournal, Entry } from '@/hooks/use-journal';
import { format } from 'date-fns';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

export function Archive() {
  const { entries, isLoaded } = useJournal();

  const grouped = useMemo(() => {
    const groups: Record<string, Entry[]> = {};
    entries.forEach(entry => {
      const month = format(entry.createdAt, 'MMMM yyyy');
      if (!groups[month]) groups[month] = [];
      groups[month].push(entry);
    });
    return groups;
  }, [entries]);

  if (!isLoaded) return null;

  return (
    <div className="space-y-12 pb-20">
      <header>
        <h2 className="font-heading text-4xl text-primary drop-shadow-sm mb-2">Memory Archive</h2>
        <p className="text-muted-foreground font-medium">Flipping through past pages.</p>
      </header>

      {Object.entries(grouped).length === 0 ? (
        <div className="text-center p-12 bg-card rounded-3xl border-2 border-dashed border-secondary">
          <p className="text-muted-foreground">Your archive is empty right now.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([month, monthEntries], i) => (
          <motion.div 
            key={month}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <h3 className="font-heading text-2xl text-foreground">{month}</h3>
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-sm font-bold text-muted-foreground px-3 py-1 bg-secondary/30 rounded-full">
                {monthEntries.length} entries
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {monthEntries.map((entry) => (
                <Link key={entry.id} href={`/entry/${entry.id}`}>
                  <span className="block aspect-square p-5 bg-card rounded-3xl border border-border/50 shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-pointer relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-50 group-hover:opacity-100 transition-opacity">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getThemeHex(entry.color) }} />
                    </div>
                    <div className="h-full flex flex-col">
                      <span className="text-2xl font-heading text-primary mb-2 drop-shadow-sm">
                        {format(entry.createdAt, 'dd')}
                      </span>
                      <h4 className="font-bold text-sm line-clamp-2 leading-snug mb-auto group-hover:text-primary transition-colors text-foreground">
                        {entry.title || 'Untitled'}
                      </h4>
                      <p className="text-xs text-muted-foreground/80 line-clamp-3">
                        {entry.body || '...'}
                      </p>
                    </div>
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

function getThemeHex(color: string) {
  const map: Record<string, string> = {
    blush: '#FFD1DC',
    lavender: '#E6E6FA',
    mint: '#CFFFE5',
    peach: '#FFDAB9',
    sky: '#D4F0FF',
  };
  return map[color] || map.blush;
}
