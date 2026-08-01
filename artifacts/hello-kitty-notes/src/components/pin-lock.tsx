import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';
import { HelloKittyFace } from './hello-kitty-face';

interface PinLockProps {
  onUnlock: () => void;
}

export function PinLock({ onUnlock }: PinLockProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        const actualPin = localStorage.getItem('kitty_pin') || '1101';
        if (newPin === actualPin) {
          setTimeout(onUnlock, 300);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(p => p.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card p-8 rounded-[3rem] shadow-2xl border border-border flex flex-col items-center max-w-sm w-full mx-4"
      >
        <HelloKittyFace className="w-20 h-20 mb-6 drop-shadow-md" />
        <h2 className="font-heading text-3xl text-primary mb-2">Secret Diary</h2>
        <p className="text-muted-foreground font-secondary mb-8 text-center text-sm">Enter PIN to unlock your memories.</p>
        
        <div className="flex gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`w-4 h-4 rounded-full ${i < pin.length ? 'bg-primary' : 'bg-secondary'}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePress(num.toString())}
              className="w-16 h-16 mx-auto rounded-full bg-secondary/30 hover:bg-primary/20 text-foreground font-bold text-2xl transition-colors flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handlePress('0')}
            className="w-16 h-16 mx-auto rounded-full bg-secondary/30 hover:bg-primary/20 text-foreground font-bold text-2xl transition-colors flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 mx-auto rounded-full text-muted-foreground hover:text-primary transition-colors flex items-center justify-center"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
