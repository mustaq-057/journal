import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { Entry, getWordCount, getReadingTime } from '@/hooks/use-journal';
import { MoodIcon } from '@/components/mood-icon';
import { format } from 'date-fns';
import { StickerIcon } from '@/components/hello-kitty-svgs';
import { RichText } from '@/components/rich-text';

const COLORS: Record<string, string> = {
  blush: '#FFD1DC',
  lavender: '#E6E6FA',
  mint: '#CFFFE5',
  peach: '#FFDAB9',
  sky: '#D4F0FF',
};

export function SharedEntry() {
  const params = useParams();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/entries/${params.id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setEntry(data);
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <StickerIcon name="cloud" className="w-16 h-16 text-primary animate-pulse" />
        <p className="text-muted-foreground font-bold">Loading shared memory...</p>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <StickerIcon name="bow" className="w-16 h-16 text-red-300" />
        <h2 className="text-2xl font-heading text-red-400">Oops!</h2>
        <p className="text-muted-foreground">This shared memory couldn't be found or was deleted.</p>
      </div>
    );
  }


  const bgColor = COLORS[entry.color] || entry.color;

  return (
    <div className="max-w-3xl mx-auto pb-20 relative">
      <header className="mb-8 text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border border-border shadow-sm mb-4">
          <StickerIcon name="star" className="w-5 h-5 text-primary" />
          <span className="font-heading text-primary text-xl tracking-wider">Shared Journal Memory</span>
        </div>
      </header>

      <div className="bg-white rounded-[3rem] shadow-sm border border-border p-6 md:p-12 overflow-hidden relative">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundColor: bgColor }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-heading text-primary drop-shadow-sm leading-tight mb-2">
              {entry.title || "Untitled Memory"}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm uppercase tracking-widest">
              <span>{format(entry.createdAt, 'MMMM do, yyyy')}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MoodIcon mood={entry.mood} className="w-4 h-4" />
                {entry.mood}
              </span>
            </div>
          </div>
        </div>

        {entry.imageUrl && (
          <div className="relative z-10 rounded-[2rem] overflow-hidden border border-border shadow-sm mb-8">
            <img src={entry.imageUrl} alt="Memory photo" className="w-full max-h-[500px] object-cover" />
          </div>
        )}

        <div className="relative z-10">
          <div className="w-full min-h-[300px] text-xl font-secondary leading-[1.8] text-foreground whitespace-pre-wrap break-words">
            <RichText content={entry.body} />
          </div>
        </div>

        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-6">
          <div className="flex flex-wrap gap-2">
            {entry.tags?.map(t => (
              <span key={t} className="px-3 py-1 bg-secondary/30 text-primary font-bold text-xs uppercase tracking-wider rounded-md border border-primary/10">
                #{t}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest bg-white/80 px-4 py-2 rounded-full border border-border">
            <span>{(entry.body || '').length} characters</span>
          </div>
        </div>
      </div>
    </div>
  );
}
