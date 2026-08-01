import React from 'react';
import { Mood } from '@/hooks/use-journal';
import { cn } from '@/lib/utils';

export function MoodIcon({ mood, className }: { mood: Mood; className?: string }) {
  const props = {
    viewBox: "0 0 40 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: cn("w-8 h-8", className)
  };

  const circle = <circle cx="20" cy="20" r="18" fill="currentColor" opacity="0.2" />;

  switch (mood) {
    case 'happy':
      return (
        <svg {...props}>
          {circle}
          <path d="M12 16 Q14 12 16 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 16 Q26 12 28 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M14 24 Q20 28 26 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'sad':
      return (
        <svg {...props}>
          {circle}
          <path d="M12 16 Q14 14 16 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 16 Q26 14 28 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M16 26 Q20 22 24 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="14" cy="22" r="1.5" fill="#60A5FA" />
        </svg>
      );
    case 'excited':
      return (
        <svg {...props}>
          {circle}
          <path d="M12 14 L16 18 M12 18 L16 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 14 L28 18 M24 18 L28 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M14 24 Q20 32 26 24 Z" fill="currentColor" />
        </svg>
      );
    case 'calm':
      return (
        <svg {...props}>
          {circle}
          <line x1="12" y1="16" x2="16" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="24" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M16 25 Q20 26 24 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'tired':
      return (
        <svg {...props}>
          {circle}
          <path d="M11 16 Q13 18 15 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M25 16 Q27 18 29 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="20" cy="25" r="2" fill="currentColor" />
          <path d="M28 10 L32 10 L28 14 L32 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'loved':
      return (
        <svg {...props}>
          {circle}
          <path d="M12 16 C12 14 14 13 15 15 C16 13 18 14 18 16 L15 19 Z" fill="#FF4081" />
          <path d="M22 16 C22 14 24 13 25 15 C26 13 28 14 28 16 L25 19 Z" fill="#FF4081" />
          <path d="M16 25 Q20 28 24 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
  }
}
