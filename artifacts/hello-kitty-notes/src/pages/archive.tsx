import React, { useMemo } from 'react';
import { useJournal, Entry } from '@/hooks/use-journal';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { StickerIcon } from '@/components/hello-kitty-svgs';
import { MoodIcon } from '@/components/mood-icon';

function MonthCalendar({ monthStr, entries }: { monthStr: string, entries: Entry[] }) {
  const monthStart = startOfMonth(entries[0].createdAt);
  const monthEnd = endOfMonth(monthStart);
  
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);
  const endPadding = 6 - getDay(monthEnd);

  const paddingStartArray = Array.from({ length: startPadding });
  const paddingEndArray = Array.from({ length: endPadding });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-border shadow-sm mb-6">
      <div className="grid grid-cols-7 gap-2 text-center mb-4">
        {weekDays.map(d => (
          <div key={d} className="text-[10px] font-bold text-muted-foreground uppercase">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {paddingStartArray.map((_, i) => <div key={`start-${i}`} className="aspect-square" />)}
        {days.map(day => {
          const dayEntries = entries.filter(e => isSameDay(e.createdAt, day));
          const entry = dayEntries[0]; 
          return (
            <div key={day.toISOString()} className="aspect-square flex flex-col items-center justify-center p-1">
              <span className="text-xs font-bold text-muted-foreground mb-1">{format(day, 'd')}</span>
              {entry ? (
                <Link href={`/entry/${entry.id}`}>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-md" 
                    style={{ backgroundColor: getThemeHex(entry.color) }}
                  >
                    <MoodIcon mood={entry.mood} className="w-6 h-6 text-white" />
                  </div>
                </Link>
              ) : (
                <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/20" />
              )}
            </div>
          );
        })}
        {paddingEndArray.map((_, i) => <div key={`end-${i}`} className="aspect-square" />)}
      </div>
    </div>
  );
}

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
      <header className="bg-white p-8 rounded-[3rem] border border-border shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-heading text-4xl text-primary drop-shadow-sm mb-3">Memory Archive</h2>
          <p className="text-muted-foreground font-secondary text-xl font-medium">Tracking my moods and days.</p>
        </div>
        <StickerIcon name="bow" className="absolute -right-8 -top-8 w-40 h-40 text-secondary opacity-30 rotate-12" />
      </header>

      {Object.entries(grouped).length === 0 ? (
        <div className="text-center p-16 bg-white rounded-[3rem] border-4 border-dashed border-secondary shadow-sm">
          <StickerIcon name="cloud" className="w-24 h-24 mx-auto text-muted mb-6" />
          <p className="text-muted-foreground font-secondary text-xl">Your archive is empty right now.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([month, monthEntries], i) => (
          <motion.div 
            key={month}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            className="space-y-8"
          >
            <div className="flex items-center gap-6">
              <h3 className="font-heading text-3xl text-foreground bg-white px-6 py-2 rounded-full border border-border shadow-sm inline-block">
                {month}
              </h3>
              <div className="flex-1 h-[2px] bg-secondary/50 rounded-full"></div>
            </div>
            
            <MonthCalendar monthStr={month} entries={monthEntries} />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {monthEntries.map((entry) => (
                <Link key={entry.id} href={`/entry/${entry.id}`}>
                  <span className="block aspect-square p-6 bg-white rounded-[2rem] border border-border shadow-sm hover:shadow-[0_8px_25px_rgba(255,79,139,0.2)] hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-70 group-hover:opacity-100 transition-opacity">
                      <div className="w-5 h-5 rounded-full shadow-inner border-2 border-white/50" style={{ backgroundColor: getThemeHex(entry.color) }} />
                    </div>
                    
                    <div className={`absolute bottom-0 left-0 w-full h-1`} style={{ backgroundColor: getThemeHex(entry.color) }} />
                    
                    <div className="h-full flex flex-col relative z-10">
                      <span className="text-4xl font-heading text-primary mb-3 drop-shadow-sm group-hover:scale-110 transition-transform origin-left">
                        {format(entry.createdAt, 'dd')}
                      </span>
                      <h4 className="font-bold text-lg font-secondary line-clamp-2 leading-tight mb-auto group-hover:text-primary transition-colors text-foreground">
                        {entry.title || 'Untitled Memory'}
                      </h4>
                      {entry.tags?.[0] && (
                        <div className="mt-4">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary/30 px-2 py-1 rounded-md">
                            #{entry.tags[0]}
                          </span>
                        </div>
                      )}
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
    blush: '#FFB7D1', // slightly deeper than bg for accents
    lavender: '#D8BFD8',
    mint: '#98FB98',
    peach: '#FFCBA4',
    sky: '#B0E0E6',
  };
  return map[color] || map.blush;
}
