import { useState, useEffect, useCallback } from 'react';

export type Mood = 'happy' | 'sad' | 'excited' | 'calm' | 'tired' | 'loved';
export type ThemeColor = 'blush' | 'lavender' | 'mint' | 'peach' | 'sky';

export interface Entry {
  id: string;
  title: string;
  body: string;
  mood: Mood;
  color: ThemeColor;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'hk-journal-entries';

const defaultEntries: Entry[] = [
  {
    id: 'entry-1',
    title: 'A lovely day at the cafe!',
    body: 'Today I went to my favorite corner cafe and ordered a strawberry parfait. It was so delicious! I spent the whole afternoon reading and enjoying the sweet scent of baked goods. I feel so refreshed and happy.',
    mood: 'happy',
    color: 'blush',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'entry-2',
    title: 'Rainy afternoon thoughts',
    body: 'The rain is tapping against the window. It is so calming. I wrapped myself in my fluffiest blanket and made hot cocoa. Sometimes a quiet day indoors is exactly what the heart needs.',
    mood: 'calm',
    color: 'lavender',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5,
  }
];

export function useJournal() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        setEntries(defaultEntries);
      }
    } else {
      setEntries(defaultEntries);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEntries));
    }
    setIsLoaded(true);
  }, []);

  const saveEntries = useCallback((newEntries: Entry[]) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  }, []);

  const addEntry = useCallback((entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: Entry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveEntries([newEntry, ...entries]);
    return newEntry;
  }, [entries, saveEntries]);

  const updateEntry = useCallback((id: string, updates: Partial<Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const updated = entries.map(e => e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e);
    saveEntries(updated);
  }, [entries, saveEntries]);

  const deleteEntry = useCallback((id: string) => {
    saveEntries(entries.filter(e => e.id !== id));
  }, [entries, saveEntries]);

  const getEntry = useCallback((id: string) => {
    return entries.find(e => e.id === id);
  }, [entries]);

  return {
    entries: [...entries].sort((a, b) => b.createdAt - a.createdAt),
    isLoaded,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntry,
  };
}
