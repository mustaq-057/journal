import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export function Settings() {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [message, setMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const actualPin = localStorage.getItem('kitty_pin') || '1101';
    
    if (currentPin !== actualPin) {
      setMessage('Current PIN is incorrect 🌸');
      return;
    }
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      setMessage('New PIN must be exactly 4 digits 🌸');
      return;
    }
    if (newPin !== confirmPin) {
      setMessage('New PINs do not match 🌸');
      return;
    }

    localStorage.setItem('kitty_pin', newPin);
    setMessage('PIN updated successfully! 🎀');
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="bg-white p-8 rounded-[3rem] border border-border shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <SettingsIcon className="w-10 h-10 text-primary" />
          <div>
            <h2 className="font-heading text-4xl text-primary drop-shadow-sm mb-1">Settings</h2>
            <p className="text-muted-foreground font-secondary text-xl font-medium">configure your journal</p>
          </div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="max-w-xl mx-auto bg-white p-8 rounded-[3rem] border border-border shadow-sm"
      >
        <h3 className="font-heading text-2xl text-foreground mb-6">Change Lock PIN</h3>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1 ml-4">Current PIN</label>
            <input 
              type="password" 
              maxLength={4}
              value={currentPin}
              onChange={e => setCurrentPin(e.target.value)}
              className="w-full bg-secondary/20 border-none rounded-full px-6 py-3 font-secondary text-lg text-foreground focus:ring-2 focus:ring-primary/30"
              placeholder="Enter current 4-digit PIN"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1 ml-4">New PIN</label>
            <input 
              type="password" 
              maxLength={4}
              value={newPin}
              onChange={e => setNewPin(e.target.value)}
              className="w-full bg-secondary/20 border-none rounded-full px-6 py-3 font-secondary text-lg text-foreground focus:ring-2 focus:ring-primary/30"
              placeholder="Enter new 4-digit PIN"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1 ml-4">Confirm New PIN</label>
            <input 
              type="password" 
              maxLength={4}
              value={confirmPin}
              onChange={e => setConfirmPin(e.target.value)}
              className="w-full bg-secondary/20 border-none rounded-full px-6 py-3 font-secondary text-lg text-foreground focus:ring-2 focus:ring-primary/30"
              placeholder="Confirm new 4-digit PIN"
            />
          </div>

          {message && (
            <p className={`text-center font-bold text-sm ${message.includes('successfully') ? 'text-green-500' : 'text-primary'}`}>
              {message}
            </p>
          )}

          <button 
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-primary to-[#e85d95] text-white rounded-full py-4 font-bold font-secondary text-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </form>
      </motion.div>
    </div>
  );
}
