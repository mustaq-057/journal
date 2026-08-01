import React from 'react';
import { StickerIcon } from './hello-kitty-svgs';

export function RichText({ content, className }: { content: string, className?: string }) {
  if (!content) return null;
  const regex = /(\[(?:heart|star|bow|cake|flower|paw|cloud|rainbow)\])/g;
  const parts = content.split(regex);
  
  return (
    <span className={className}>
      {parts.map((part, i) => {
        const match = part.match(/\[(heart|star|bow|cake|flower|paw|cloud|rainbow)\]/);
        if (match) {
          return (
            <StickerIcon 
              key={i} 
              name={match[1]} 
              className="inline-block w-[1.2em] h-[1.2em] mx-1 align-text-bottom text-primary drop-shadow-sm" 
            />
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
