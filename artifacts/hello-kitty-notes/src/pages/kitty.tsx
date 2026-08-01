import React from 'react';
import { motion } from 'framer-motion';
import { KittyChat } from '@/components/kitty-chat';
import { StickerIcon } from '@/components/hello-kitty-svgs';

export function Kitty() {
  return (
    <div className="space-y-12 pb-20">
      <header className="bg-white p-8 rounded-[3rem] border border-border shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-heading text-4xl text-primary drop-shadow-sm mb-3">Talk to Kitty</h2>
          <p className="text-muted-foreground font-secondary text-xl font-medium">she actually gets you 🌸</p>
        </div>
        <StickerIcon name="bow" className="absolute -right-8 -top-8 w-40 h-40 text-secondary opacity-30 rotate-12" />
      </header>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="max-w-2xl mx-auto"
      >
        <KittyChat />
      </motion.div>
    </div>
  );
}
