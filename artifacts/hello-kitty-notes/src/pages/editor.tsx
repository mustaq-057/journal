import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'wouter';
import { useJournal, Mood, ThemeColor, getWordCount, getReadingTime } from '@/hooks/use-journal';
import { MoodIcon } from '@/components/mood-icon';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Save, Trash2, Tag, Camera, X, Share2, Mic, Square, Play } from 'lucide-react';
import { format } from 'date-fns';
import { SaveHelloKitty, StickerIcon } from '@/components/hello-kitty-svgs';
import { RichText } from '@/components/rich-text';

const MOODS: Mood[] = ['happy', 'sad', 'excited', 'calm', 'tired', 'loved'];
const COLORS: { id: ThemeColor; value: string; label: string }[] = [
  { id: 'blush', value: '#FFD1DC', label: 'Blush' },
  { id: 'lavender', value: '#E6E6FA', label: 'Lavender' },
  { id: 'mint', value: '#CFFFE5', label: 'Mint' },
  { id: 'peach', value: '#FFDAB9', label: 'Peach' },
  { id: 'sky', value: '#D4F0FF', label: 'Sky' },
];

const TAG_OPTIONS = ["happy day", "self care", "friendship", "adventure", "dream", "love", "cozy"];
const STICKERS = ["heart", "star", "bow", "cake", "flower", "paw", "cloud", "rainbow"];

export function Editor() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { entries, addEntry, updateEntry, deleteEntry, uploadImage, uploadAudio, isLoaded } = useJournal();
  const isNew = !params.id || params.id === 'new';

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState<Mood>('happy');
  const [color, setColor] = useState<ThemeColor>('blush');
  const [tags, setTags] = useState<string[]>([]);
  const [showSaveAnim, setShowSaveAnim] = useState(false);
  const [isTagPickerOpen, setIsTagPickerOpen] = useState(false);
  const [kittyModal, setKittyModal] = useState<{ open: boolean; message: string; onConfirm?: () => void }>({ open: false, message: '' });
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [localAudio, setLocalAudio] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoaded && !isNew) {
      const entry = entries.find(e => e.id === params.id);
      if (entry) {
        setTitle(entry.title);
        setBody(entry.body);
        setMood(entry.mood);
        setColor(entry.color);
        setTags(entry.tags || []);
        if (entry.imageUrl) setLocalImage(entry.imageUrl);
        if (entry.audioUrl) setLocalAudio(entry.audioUrl);
      } else {
        setLocation('/');
      }
    }
  }, [isLoaded, isNew, params.id, entries, setLocation]);

  const handleSave = async () => {
    if (!title.trim() && !body.trim() && !localImage && !localAudio) return;

    setShowSaveAnim(true);

    try {
      let entryId = params.id as string;
      if (isNew) {
        const entry = await addEntry({ title, body, mood, color, tags });
        entryId = entry.id;
      } else {
        await updateEntry(entryId, { title, body, mood, color, tags });
      }

      // Upload newly added media
      if (imageInputRef.current?.files?.[0]) {
        await uploadImage(entryId, imageInputRef.current.files[0]);
      }
      if (audioBlob) {
        await uploadAudio(entryId, audioBlob);
      }

      setTimeout(() => {
        setShowSaveAnim(false);
        if (isNew) setLocation(`/entry/${entryId}`);
      }, 800);
    } catch (err) {
      setShowSaveAnim(false);
      setKittyModal({ open: true, message: "Oops! I couldn't save your memory. 😿" });
    }
  };

  const handleDelete = () => {
    setKittyModal({
      open: true,
      message: 'Are you sure you want to throw away this beautiful memory? 🌸',
      onConfirm: () => {
        deleteEntry(params.id as string);
        setLocation('/');
      },
    });
  };

  const handleShare = async () => {
    if (isNew || !params.id) {
      setKittyModal({ open: true, message: "Please save your memory first before sharing! 🎀" });
      return;
    }

    const shareUrl = `${window.location.origin}/shared/${params.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: title || 'My Journal Entry',
          text: 'Read my journal memory on Hello Kitty Notes! 🌸',
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setKittyModal({ open: true, message: "Share link copied to clipboard! 💖 You can send it to your friend now." });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setLocalImage(localUrl);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setLocalAudio(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 299) { // 5 minutes max (300 seconds)
            stopRecording();
            return 300;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      setKittyModal({ open: true, message: "I couldn't access your microphone! Please check permissions. 🌸" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };



  const toggleTag = (t: string) => {
    if (tags.includes(t)) {
      setTags(tags.filter(x => x !== t));
    } else {
      setTags([...tags, t]);
    }
  };

  const insertSticker = (stickerName: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const textToInsert = `[${stickerName}]`;
    const newBody = body.substring(0, start) + textToInsert + body.substring(end);

    setBody(newBody);

    // reset cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  };

  const toMoroccoTime = (dateVal: number | Date) => {
    const str = new Date(dateVal).toLocaleString('en-US', { timeZone: 'Africa/Casablanca' });
    return new Date(str);
  };

  const dateStr = isNew
    ? format(toMoroccoTime(Date.now()), 'MMMM do, yyyy')
    : entries.find(e => e.id === params.id)?.createdAt
      ? format(toMoroccoTime(entries.find(e => e.id === params.id)!.createdAt), 'MMMM do, yyyy')
      : format(toMoroccoTime(Date.now()), 'MMMM do, yyyy');



  if (!isLoaded) return null;

  return (
    <div className="max-w-4xl mx-auto pb-20 relative">

      <AnimatePresence>
        {/* Custom Hello Kitty Modal (replaces system alert) */}
        {kittyModal.open && (
          <motion.div
            key="kitty-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            style={{ background: 'rgba(255,182,193,0.25)', backdropFilter: 'blur(8px)' }}
            onClick={() => setKittyModal({ open: false, message: '' })}
          >
            <motion.div
              initial={{ scale: 0.7, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 14, stiffness: 200 }}
              className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-primary/20 max-w-sm w-full p-8 flex flex-col items-center gap-5 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Hello Kitty bow header */}
              <div className="text-5xl">🎀</div>
              <p className="font-heading text-xl text-primary text-center">Hello Kitty says~</p>
              <p className="font-secondary text-base text-foreground text-center leading-relaxed">
                "{kittyModal.message}"
              </p>
              <div className="flex gap-3 mt-2">
                {kittyModal.onConfirm && (
                  <button
                    onClick={() => {
                      kittyModal.onConfirm?.();
                      setKittyModal({ open: false, message: '' });
                    }}
                    className="px-6 py-3 rounded-full bg-red-400 text-white font-bold text-sm hover:bg-red-500 transition-all active:scale-95"
                  >
                    Yes, delete 🗑️
                  </button>
                )}
                <button
                  onClick={() => setKittyModal({ open: false, message: '' })}
                  className="px-8 py-3 rounded-full bg-primary text-white font-bold text-base shadow-[0_6px_16px_rgba(255,79,139,0.35)] hover:shadow-[0_10px_20px_rgba(255,79,139,0.45)] hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  {kittyModal.onConfirm ? 'Keep it! 💖' : 'So sweet! 💖'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSaveAnim && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 12 }}
              className="relative flex flex-col items-center"
            >
              <SaveHelloKitty className="w-64 h-auto drop-shadow-2xl" />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-heading text-4xl text-primary drop-shadow-sm mt-4 bg-white px-8 py-3 rounded-full border-2 border-primary/20 shadow-lg"
              >
                Saved! ~
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <button
          onClick={() => setLocation('/')}
          className="flex items-center gap-2 p-3 rounded-full bg-white shadow-sm hover:shadow-md text-muted-foreground hover:text-primary transition-all self-start md:self-auto"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="font-bold hidden md:inline pr-2">Back</span>
        </button>

        <div className="flex gap-3 w-full md:w-auto justify-end">
          {!isNew && (
            <>
              <button
                onClick={handleShare}
                className="p-3 rounded-2xl bg-white border-2 border-primary/20 text-primary hover:bg-primary/10 shadow-sm transition-all"
                title="Share Memory"
              >
                <Share2 className="w-6 h-6" />
              </button>
              <button
                onClick={handleDelete}
                className="p-3 rounded-2xl bg-white border-2 border-red-100 text-red-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 shadow-sm transition-all"
                title="Delete Note"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </>
          )}
          <button
            onClick={handleSave}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-[1.5rem] bg-primary text-primary-foreground font-bold shadow-[0_8px_20px_rgba(255,79,139,0.3)] hover:shadow-[0_12px_25px_rgba(255,79,139,0.4)] hover:-translate-y-1 transition-all active:scale-95 text-lg"
          >
            <Save className="w-6 h-6" />
            <span>Save Memory</span>
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[3rem] shadow-sm border border-border p-6 md:p-12 overflow-hidden relative flex flex-col min-h-[600px]">

        {/* Soft color wash background based on theme */}
        <div
          className="absolute inset-0 opacity-10 transition-colors duration-500 pointer-events-none"
          style={{ backgroundColor: COLORS.find(c => c.id === color)?.value }}
        />

        <div className="mb-10 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1">
            <p className="font-heading text-xl md:text-2xl text-primary mb-3 pl-2">Dear Diary, it's {dateStr}</p>
            <input
              type="text"
              placeholder="Give your memory a beautiful title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl md:text-5xl font-heading text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/40 focus:ring-0 leading-tight"
            />
          </div>
        </div>

        {/* Editor Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8 relative z-10 p-6 bg-card/80 backdrop-blur-sm rounded-[2rem] border border-border shadow-sm">

          <div className="flex-1">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest">My Mood</label>
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  const fullText = `${title}\n${body}`.trim();
                  if (!fullText) {
                    setKittyModal({ open: true, message: "Please write something in your title or journal body first! 🌸" });
                    return;
                  }

                  const btn = e.currentTarget;
                  btn.innerText = "✨ Thinking...";
                  btn.disabled = true;

                  try {
                    const apiBase = import.meta.env.VITE_API_URL || '';
                    const res = await fetch(`${apiBase}/api/ai/suggest-mood`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ text: fullText }),
                    });
                    const data = await res.json();
                    if (data.mood && MOODS.includes(data.mood)) setMood(data.mood);
                    if (data.color && COLORS.some(c => c.id === data.color)) setColor(data.color);
                    if (data.suggestedTags && Array.isArray(data.suggestedTags)) {
                      setTags(data.suggestedTags.map((t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean).slice(0, 3));
                    }
                    if (data.kittyAdvice) {
                      setKittyModal({ open: true, message: data.kittyAdvice });
                    }
                  } catch (err) {
                    console.error('AI Auto-Detect failed:', err);
                    setKittyModal({ open: true, message: "Kitty AI is resting right now, please try again in a moment! 🌸" });
                  } finally {
                    btn.innerText = "✨ AI Auto-Detect";
                    btn.disabled = false;
                  }
                }}
                className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 disabled:opacity-50 px-3 py-1 rounded-full transition-all flex items-center gap-1 border border-primary/20 cursor-pointer"
              >
                ✨ AI Auto-Detect
              </button>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              {MOODS.map(m => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={cn(
                    "p-3 rounded-2xl transition-all duration-300 cursor-pointer",
                    mood === m
                      ? "bg-primary text-white shadow-[0_4px_12px_rgba(255,79,139,0.4)] scale-110"
                      : "bg-white text-muted-foreground hover:bg-secondary/50 hover:text-foreground hover:scale-105 border border-border/50"
                  )}
                  title={m}
                >
                  <MoodIcon mood={m} className="w-7 h-7" />
                </button>
              ))}
            </div>
          </div>

          <div className="w-px bg-border/50 hidden lg:block mx-2" />

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Theme Color</label>
            <div className="flex gap-3 items-center flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={cn(
                    "w-12 h-12 rounded-full transition-all duration-300 border-4 cursor-pointer",
                    color === c.id ? "border-primary scale-110 shadow-md" : "border-white hover:scale-105 shadow-sm"
                  )}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="mb-6 relative z-10">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <button
              type="button"
              onClick={() => setIsTagPickerOpen(!isTagPickerOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary/20 hover:bg-secondary/40 text-primary font-bold rounded-full transition-colors border border-primary/10 text-sm cursor-pointer"
            >
              <Tag className="w-4 h-4" />
              <span>Select Tags ({tags.length})</span>
            </button>

            {/* Custom Tag Input + Button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem('customTag') as HTMLInputElement;
                const val = input.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
                if (val && !tags.includes(val)) {
                  setTags([...tags, val]);
                  input.value = '';
                }
              }}
              className="flex items-center gap-1 bg-white border border-border rounded-full px-3 py-1 text-sm shadow-sm focus-within:border-primary"
            >
              <span className="text-muted-foreground font-bold">#</span>
              <input
                name="customTag"
                type="text"
                placeholder="Add custom tag..."
                className="bg-transparent outline-none text-xs font-bold w-28 text-foreground"
              />
              <button
                type="submit"
                className="w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                title="Add Tag"
              >
                +
              </button>
            </form>

            <div className="flex gap-2 flex-wrap">
              {tags.map(t => (
                <span
                  key={t}
                  className="px-3 py-1 bg-primary text-white font-bold text-sm rounded-full shadow-sm flex items-center gap-1 group cursor-pointer"
                  onClick={() => setTags(tags.filter(x => x !== t))}
                  title="Click to remove tag"
                >
                  #{t}
                  <span className="text-xs opacity-70 group-hover:opacity-100">×</span>
                </span>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {isTagPickerOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 p-4 bg-card rounded-2xl border border-border mb-2">
                  {TAG_OPTIONS.map(t => {
                    const isSelected = tags.includes(t);
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => toggleTag(t)}
                        className={cn(
                          "px-4 py-2 rounded-full font-bold text-sm transition-all cursor-pointer",
                          isSelected
                            ? "bg-primary text-white shadow-md"
                            : "bg-white text-muted-foreground border border-border hover:bg-secondary/50"
                        )}
                      >
                        #{t} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        {/* Compact Media Section (Photo & Voice) */}
        <div className="mb-6 relative z-10 flex flex-wrap gap-4 items-center bg-secondary/10 p-4 rounded-[2rem] border border-primary/10">
          <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
          
          {/* Photo Block */}
          {localImage ? (
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border shadow-sm group shrink-0">
              <img src={localImage} alt="Memory" className="w-full h-full object-cover" />
              <button onClick={() => { setLocalImage(null); if (imageInputRef.current) imageInputRef.current.value = ''; }} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button onClick={() => imageInputRef.current?.click()} className="h-12 px-4 rounded-2xl border-2 border-dashed border-primary/30 text-primary font-bold hover:bg-white/50 transition-all flex items-center gap-2 text-sm shrink-0">
              <Camera className="w-4 h-4" /> Photo
            </button>
          )}

          {/* Audio Block */}
          {localAudio ? (
            <div className="relative h-12 flex-1 min-w-[200px] max-w-[300px] rounded-2xl border border-primary/20 bg-white flex items-center px-3 shadow-sm group">
              <audio src={localAudio} controls className="w-full h-8" />
              <button onClick={() => { setLocalAudio(null); setAudioBlob(null); }} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-400 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow hover:bg-red-500">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button 
              onClick={isRecording ? stopRecording : startRecording} 
              className={cn(
                "h-12 px-4 rounded-2xl font-bold transition-all flex items-center gap-2 text-sm shrink-0",
                isRecording 
                  ? "bg-red-500 text-white shadow-lg animate-pulse border-2 border-red-600" 
                  : "border-2 border-dashed border-primary/30 text-primary hover:bg-white/50"
              )}
            >
              {isRecording ? (
                <><Square className="w-4 h-4" /> {formatTime(recordingTime)}</>
              ) : (
                <><Mic className="w-4 h-4" /> Voice Note</>
              )}
            </button>
          )}
        </div>


        {/* Main Textarea */}
        <div
          className="relative z-10 flex-1 min-h-[400px] cursor-text"
          onClick={() => textareaRef.current?.focus()}
          onTouchStart={() => textareaRef.current?.focus()}
        >
          <textarea
            ref={textareaRef}
            placeholder="What happened today? Write your heart out..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onTouchStart={(e) => e.currentTarget.focus()}
            onClick={(e) => e.currentTarget.focus()}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            tabIndex={0}
            className="w-full min-h-[400px] text-xl font-secondary leading-[1.8] text-foreground bg-transparent border-none outline-none resize-none focus:ring-0 p-4 cursor-text"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mt-4">
        <StickerIcon name="star" className="w-3 h-3 text-primary" />
        <span>{body.length} characters</span>
      </div>
    </div>
  );
}