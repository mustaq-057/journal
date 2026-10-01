import { motion } from 'framer-motion';
import { MoonStar, RefreshCw } from 'lucide-react';
import { HelloKittyFace } from './hello-kitty-face';

interface InactivityOverlayProps {
  onDismiss: () => void;
}

export function InactivityOverlay({ onDismiss }: InactivityOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/90 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 }}
        className="bg-card p-10 rounded-[3rem] shadow-2xl border border-border flex flex-col items-center max-w-sm w-full mx-4 text-center"
      >
        {/* Sleeping Kitty */}
        <div className="relative mb-5">
          <HelloKittyFace className="w-24 h-24 opacity-80" />
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ y: [-2, 2, -2], rotate: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <MoonStar className="w-6 h-6 text-primary" />
          </motion.div>
        </div>

        <h2 className="font-heading text-2xl text-primary mb-2">Window Closed</h2>
        <p className="text-muted-foreground font-secondary text-sm mb-6 leading-relaxed">
          Due to inactivity, this window was closed. 🌙
          <br />
          Tap below to wake Kitty up again!
        </p>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onDismiss}
          className="flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
