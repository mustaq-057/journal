import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Delete, Fingerprint } from 'lucide-react';
import { HelloKittyFace } from './hello-kitty-face';

interface PinLockProps {
  onUnlock: () => void;
}

// Attempt native biometric auth via Capacitor if available
async function attemptBiometric(): Promise<boolean> {
  try {
    // Dynamically import the plugin — it won't exist in a web browser, only in the Android shell
    const { BiometricAuth } = await import('@capacitor-community/biometric-auth');
    const { isAvailable, biometryType } = await BiometricAuth.checkBiometry();
    if (!isAvailable) return false;

    await BiometricAuth.authenticate({
      reason: "Unlock Sara's Diary 🌸",
      title: "Kitty AI Diary",
      subtitle: "Use your fingerprint to unlock",
      cancelTitle: "Use PIN instead",
      allowDeviceCredential: false,
    });
    return true;
  } catch (e: any) {
    // User cancelled or biometric failed — fall back to PIN
    console.log('Biometric cancelled or failed:', e?.message);
    return false;
  }
}

export function PinLock({ onUnlock }: PinLockProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    // Check if biometric is available on this device
    (async () => {
      try {
        const { BiometricAuth } = await import('@capacitor-community/biometric-auth');
        const { isAvailable } = await BiometricAuth.checkBiometry();
        setBiometricAvailable(isAvailable);
      } catch {
        setBiometricAvailable(false);
      }
    })();
  }, []);

  const handleFingerprint = async () => {
    const success = await attemptBiometric();
    if (success) {
      onUnlock();
    }
  };

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
        <h2 className="font-heading text-3xl text-primary mb-1">Secret Diary</h2>
        <p className="text-muted-foreground font-secondary mb-6 text-center text-sm">
          {biometricAvailable ? 'Use your fingerprint or enter your PIN' : 'Enter PIN to unlock your memories.'}
        </p>
        
        <div className="flex gap-4 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`w-4 h-4 rounded-full ${i < pin.length ? 'bg-primary' : 'bg-secondary'}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePress(num.toString())}
              className="w-16 h-16 mx-auto rounded-full bg-secondary/30 hover:bg-primary/20 text-foreground font-bold text-2xl transition-colors flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          
          {/* Bottom row: fingerprint | 0 | delete */}
          {biometricAvailable ? (
            <button
              onClick={handleFingerprint}
              className="w-16 h-16 mx-auto rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all flex items-center justify-center active:scale-95"
              title="Use fingerprint"
            >
              <Fingerprint className="w-7 h-7" />
            </button>
          ) : (
            <div />
          )}
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

        {biometricAvailable && (
          <p className="text-xs text-primary/50 font-bold tracking-wider uppercase mt-2">
            Tap 🫆 for fingerprint unlock
          </p>
        )}
      </motion.div>
    </div>
  );
}
