import React from 'react';
import { cn } from '@/lib/utils';

export function HelloKittyFace({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 150" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-32 h-auto drop-shadow-md", className)}
    >
      {/* Ears */}
      <path d="M40 70 L20 20 L70 40 Z" fill="white" stroke="#333" strokeWidth="4" strokeLinejoin="round" />
      <path d="M160 70 L180 20 L130 40 Z" fill="white" stroke="#333" strokeWidth="4" strokeLinejoin="round" />
      
      {/* Face */}
      <ellipse cx="100" cy="85" rx="75" ry="55" fill="white" stroke="#333" strokeWidth="4" />
      
      {/* Eyes */}
      <ellipse cx="65" cy="85" rx="6" ry="9" fill="#111" />
      <ellipse cx="135" cy="85" rx="6" ry="9" fill="#111" />
      
      {/* Nose */}
      <ellipse cx="100" cy="98" rx="8" ry="6" fill="#FFD700" stroke="#333" strokeWidth="2" />
      
      {/* Whiskers Left */}
      <line x1="10" y1="75" x2="40" y2="80" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      <line x1="5" y1="90" x2="38" y2="90" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      <line x1="10" y1="105" x2="40" y2="100" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      
      {/* Whiskers Right */}
      <line x1="190" y1="75" x2="160" y2="80" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      <line x1="195" y1="90" x2="162" y2="90" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      <line x1="190" y1="105" x2="160" y2="100" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      
      {/* Bow */}
      <g transform="translate(130, 35) rotate(15)">
        <path d="M0 0 L-25 -20 L-25 20 Z" fill="#FF4081" stroke="#333" strokeWidth="3" strokeLinejoin="round" />
        <path d="M0 0 L25 -20 L25 20 Z" fill="#FF4081" stroke="#333" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="0" cy="0" r="10" fill="#FF4081" stroke="#333" strokeWidth="3" />
      </g>
    </svg>
  );
}
