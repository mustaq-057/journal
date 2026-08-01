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
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

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
    if (!title.trim() && !body.trim()) return;

    setShowSaveAnim(true);

    if (isNew) {
      const entry = await addEntry({ title, body, mood, color, tags });
      setTimeout(() => {
        setShowSaveAnim(false);
        setLocation(`/entry/${entry.id}`);
      }, 1500);
    } else {
      await updateEntry(params.id as string, { title, body, mood, color, tags });
      setTimeout(() => setShowSaveAnim(false), 1500);
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
    // Show local preview instantly
    const localUrl = URL.createObjectURL(file);
    setLocalImage(localUrl);
    // If entry already saved, upload to Cloudinary
    if (!isNew && params.id) {
      try {
        setUploadingImage(true);
        const updated = await uploadImage(params.id as string, file);
        setLocalImage(updated.imageUrl || localUrl);
      } catch {
        // keep local preview, will upload on save
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Pick the best supported mime type
      const mimeType = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
      ].find(t => MediaRecorder.isTypeSupported(t)) || '';

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Collect data every 250ms so we don't lose chunks
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        const finalMime = mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: finalMime });
        const localUrl = URL.createObjectURL(audioBlob);
        setLocalAudio(localUrl);

        // Always upload – if entry is new, save it first
        setUploadingAudio(true);
        try {
          let entryId = params.id;
          if (isNew || !entryId || entryId === 'new') {
            // Create the entry first so we have an ID
            const saved = await addEntry({ title, body, mood, color, tags });
            entryId = saved.id;
            // Navigate to the real URL without triggering save animation
            window.history.replaceState(null, '', `/entry/${entryId}`);
          }
          const updated = await uploadAudio(entryId as string, audioBlob);
          setLocalAudio(prev => {
            // Only update if the user hasn't deleted it (by clicking X) during the upload
            if (prev === localUrl) return updated.audioUrl || localUrl;
            return prev;
          });
        } catch (err) {
          console.error("Audio upload failed", err);
          setKittyModal({ open: true, message: "Voice memo saved locally but couldn't upload. Try saving the entry again." });
        } finally {
          setUploadingAudio(false);
        }
      };

      mediaRecorder.start(250); // timeslice: collect every 250ms
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      setKittyModal({ open: true, message: "Couldn't access your microphone. Make sure the browser has permission!" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = null; // Prevent upload
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };


  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
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

  const dateStr = isNew
    ? format(Date.now(), 'MMMM do, yyyy')
    : entries.find(e => e.id === params.id)?.createdAt
      ? format(entries.find(e => e.id === params.id)!.createdAt, 'MMMM do, yyyy')
      : format(Date.now(), 'MMMM do, yyyy');

  const words = getWordCount(body);
  const readTime = getReadingTime(words);

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
                    const res = await fetch('/api/ai/suggest-mood', {
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
              ))}
            </div>
          </div>

          <div className="w-px bg-border/50 hidden lg:block mx-2" />

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Theme Color</label>
            <div className="flex gap-3 items-center flex-wrap">
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

        {/* Sticker Bar */}
        <div className="mb-4 relative z-10 p-3 bg-card rounded-2xl border border-border flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-2 pr-4 whitespace-nowrap">Stickers:</span>
          {STICKERS.map(s => (
            <button
              key={s}
              onClick={() => insertSticker(s)}
              className="p-2 rounded-xl hover:bg-secondary/50 text-primary transition-all hover:scale-110 active:scale-95 shrink-0"
              title={`Insert ${s}`}
            >
              <StickerIcon name={s} className="w-6 h-6" />
            </button>
          ))}
        </div>

        {/* Photo Upload Section */}
        <div className="mb-4 relative z-10">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoSelect}
          />
          {localImage ? (
            <div className="relative rounded-[2rem] overflow-hidden border border-border shadow-sm">
              <img src={localImage} alt="Memory photo" className="w-full max-h-80 object-cover" />
              {uploadingImage && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="font-heading text-primary text-lg animate-pulse">Uploading to cloud ☁️</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setLocalImage(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-red-400 flex items-center justify-center shadow-md hover:bg-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-[2rem] border-2 border-dashed border-primary/30 bg-secondary/10 text-primary font-bold hover:bg-secondary/20 hover:border-primary/50 transition-all cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>Add a photo memory 📸</span>
            </button>
          )}
        </div>

        {/* Voice Memo Section */}
        <div className="mb-8 relative z-10">
          {localAudio ? (
            <div className="relative p-4 rounded-[2rem] bg-white border border-border shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full">
                <button
                  type="button"
                  className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform"
                  onClick={() => {
                    const audio = new Audio(localAudio);
                    audio.play();
                  }}
                >
                  <Play className="w-6 h-6 ml-1" />
                </button>
                <div className="flex-1">
                  <div className="h-2 w-full bg-secondary/30 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,183,209,0.5)_10px,rgba(255,183,209,0.5)_20px)] animate-[pulse_2s_linear_infinite]" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground mt-2 tracking-widest uppercase">
                    {uploadingAudio ? "Uploading... ☁️" : "Voice Memory 🎀"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLocalAudio(null)}
                className="w-10 h-10 rounded-full bg-secondary/10 text-red-400 flex items-center justify-center hover:bg-red-50 transition-all shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : isRecording ? (
            <div className="w-full flex items-center justify-between gap-4 p-4 rounded-[2rem] border-2 border-primary bg-primary/5 shadow-[0_4px_15px_rgba(255,79,139,0.15)] animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-bounce" />
                <span className="font-heading text-primary text-xl tracking-wider">Recording...</span>
                <span className="font-secondary font-bold text-muted-foreground bg-white px-2 py-1 rounded-md border border-border">{formatTime(recordingTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cancelRecording}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary/20 text-red-400 hover:bg-red-50 hover:scale-105 active:scale-95 transition-all shadow-sm"
                  title="Cancel Recording"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white hover:scale-105 active:scale-95 transition-all shadow-md"
                  title="Stop & Save"
                >
                  <Square className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-[2rem] border-2 border-dashed border-primary/30 bg-secondary/10 text-primary font-bold hover:bg-secondary/20 hover:border-primary/50 transition-all cursor-pointer"
            >
              <Mic className="w-5 h-5" />
              <span>Record Voice Memo 🎤</span>
            </button>
          )}
        </div>

        {/* Main Textarea with Live Sticker Preview */}
        <div 
          className="relative z-10 group flex-1 cursor-text min-h-[400px]"
          onClick={() => textareaRef.current?.focus()}
        >
          {/* Hidden textarea for input */}
          <textarea
            ref={textareaRef}
            placeholder="What happened today? Write your heart out..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full h-full min-h-[400px] text-xl font-secondary leading-[1.8] bg-transparent border-none outline-none resize-none focus:ring-0 p-4 text-transparent caret-foreground selection:bg-primary/20"
            style={{ caretColor: 'var(--foreground)' }}
          />
          {/* Live render overlay — shows icons instead of [name] tokens */}
          <div
            aria-hidden
            className="absolute top-0 left-0 w-full h-full p-4 text-xl font-secondary leading-[1.8] text-foreground pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
          >
            {body
              ? <RichText content={body} />
              : <span className="text-muted-foreground/40">What happened today? Write your heart out...</span>
            }
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mt-4">
        <StickerIcon name="star" className="w-3 h-3 text-primary" />
        <span>~{readTime} min read · {words} words</span>
      </div>
    </div>
  );
}