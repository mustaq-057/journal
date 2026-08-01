import { useState, useEffect, useCallback } from 'react';

export type Mood = 'happy' | 'sad' | 'excited' | 'calm' | 'tired' | 'loved' | (string & {});
export type ThemeColor = 'blush' | 'lavender' | 'mint' | 'peach' | 'sky' | (string & {});

export interface Entry {
  id: string;
  title: string;
  body: string;
  mood: string;
  color: string;
  tags: string[];
  imageUrl?: string | null;
  audioUrl?: string | null;
  createdAt: number;
  updatedAt: number;
}

export function getWordCount(text: string) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

export function getReadingTime(words: number) {
  return Math.max(1, Math.ceil(words / 200));
}

const baseUrl = import.meta.env.VITE_API_URL || '';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

export function useJournal() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadEntries = useCallback(async () => {
    try {
      const data = await apiFetch<Entry[]>('/entries');
      setEntries(data);
    } catch (err) {
      console.error('Failed to load entries from API', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const addEntry = useCallback(async (entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const tempId = `temp-${Date.now()}`;
    const tempEntry: Entry = { ...entry, id: tempId, createdAt: Date.now(), updatedAt: Date.now() };
    setEntries(prev => [tempEntry, ...prev]);
    try {
      const newEntry = await apiFetch<Entry>('/entries', {
        method: 'POST',
        body: JSON.stringify(entry),
      });
      setEntries(prev => prev.map(e => e.id === tempId ? newEntry : e));
      return newEntry;
    } catch (err) {
      setEntries(prev => prev.filter(e => e.id !== tempId));
      throw err;
    }
  }, []);

  const updateEntry = useCallback(async (id: string, updates: Partial<Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e));
    try {
      const updated = await apiFetch<Entry>(`/entries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      setEntries(prev => prev.map(e => e.id === id ? updated : e));
    } catch (err) {
      loadEntries();
      throw err;
    }
  }, [loadEntries]);

  const deleteEntry = useCallback(async (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    try {
      await apiFetch(`/entries/${id}`, { method: 'DELETE' });
    } catch (err) {
      loadEntries();
      throw err;
    }
  }, [loadEntries]);

  const getEntry = useCallback((id: string) => {
    return entries.find(e => e.id === id);
  }, [entries]);

  const uploadImage = useCallback(async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${baseUrl}/api/entries/${id}/image`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Image upload failed');
    const updated: Entry = await res.json();
    setEntries(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  }, []);

  const uploadAudio = useCallback(async (id: string, file: Blob) => {
    const formData = new FormData();
    formData.append('audio', file, 'voice-memo.webm');
    const res = await fetch(`${baseUrl}/api/entries/${id}/audio`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Audio upload failed');
    const updated: Entry = await res.json();
    setEntries(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  }, []);

  return {
    entries: [...entries].sort((a, b) => b.createdAt - a.createdAt),
    isLoaded,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    uploadImage,
    uploadAudio,
    refresh: loadEntries,
  };
}

