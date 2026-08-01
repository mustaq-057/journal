import React from 'react';

export function HeroHelloKitty({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Books Stack */}
      <g transform="translate(180, 110)">
        <rect x="0" y="30" width="60" height="15" rx="3" fill="#CFFFE5" stroke="#4A3540" strokeWidth="2.5" />
        <rect x="-10" y="15" width="80" height="15" rx="3" fill="#E6E6FA" stroke="#4A3540" strokeWidth="2.5" />
        <rect x="5" y="0" width="50" height="15" rx="3" fill="#FFDAB9" stroke="#4A3540" strokeWidth="2.5" />
        <path d="M25 -10 L35 0 L25 10 L15 0 Z" fill="#FF4F8B" /> {/* tiny heart */}
      </g>
      
      {/* Hello Kitty Sitting */}
      <g transform="translate(50, 20)">
        {/* Body */}
        <path d="M40 120 C 20 120 10 150 30 160 L 90 160 C 110 150 100 120 80 120 Z" fill="white" stroke="#4A3540" strokeWidth="3.5" />
        {/* Feet */}
        <ellipse cx="40" cy="160" rx="15" ry="10" fill="white" stroke="#4A3540" strokeWidth="3.5" />
        <ellipse cx="80" cy="160" rx="15" ry="10" fill="white" stroke="#4A3540" strokeWidth="3.5" />
        {/* Arms */}
        <path d="M30 120 L 15 140 C 10 145 20 155 25 145 L 40 130" fill="white" stroke="#4A3540" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M90 120 L 105 140 C 110 145 100 155 95 145 L 80 130" fill="white" stroke="#4A3540" strokeWidth="3.5" strokeLinecap="round" />
        
        {/* Head */}
        <path d="M15 50 L -2 5 L 45 25 Z" fill="white" stroke="#4A3540" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M105 50 L 122 5 L 75 25 Z" fill="white" stroke="#4A3540" strokeWidth="3.5" strokeLinejoin="round" />
        
        <ellipse cx="60" cy="65" rx="60" ry="45" fill="white" stroke="#4A3540" strokeWidth="3.5" />
        
        {/* Eyes */}
        <ellipse cx="35" cy="65" rx="4.5" ry="7.5" fill="#111" />
        <ellipse cx="85" cy="65" rx="4.5" ry="7.5" fill="#111" />
        
        {/* Nose */}
        <ellipse cx="60" cy="75" rx="6.5" ry="4.5" fill="#FFD700" stroke="#4A3540" strokeWidth="2" />
        
        {/* Whiskers */}
        <line x1="-8" y1="55" x2="15" y2="60" stroke="#4A3540" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="-12" y1="70" x2="13" y2="70" stroke="#4A3540" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="-8" y1="85" x2="15" y2="80" stroke="#4A3540" strokeWidth="2.5" strokeLinecap="round" />
        
        <line x1="128" y1="55" x2="105" y2="60" stroke="#4A3540" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="132" y1="70" x2="107" y2="70" stroke="#4A3540" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="128" y1="85" x2="105" y2="80" stroke="#4A3540" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Bow */}
        <g transform="translate(90, 25) rotate(20)">
          <path d="M0 0 L-20 -15 L-20 15 Z" fill="#FF4F8B" stroke="#4A3540" strokeWidth="3" strokeLinejoin="round" />
          <path d="M0 0 L20 -15 L20 15 Z" fill="#FF4F8B" stroke="#4A3540" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="0" cy="0" r="7" fill="#FF4F8B" stroke="#4A3540" strokeWidth="3" />
        </g>
      </g>
      
      {/* Decorative Stars */}
      <g fill="#FFD1DC">
        <path d="M10 50 L13 60 L23 63 L13 66 L10 76 L7 66 L-3 63 L7 60 Z" />
        <path d="M260 30 L262 38 L270 40 L262 42 L260 50 L258 42 L250 40 L258 38 Z" />
      </g>
    </svg>
  );
}

export function SadHelloKitty({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M40 70 L15 25 L70 45 Z" fill="white" stroke="#4A3540" strokeWidth="4" strokeLinejoin="round" />
      <path d="M160 70 L185 25 L130 45 Z" fill="white" stroke="#4A3540" strokeWidth="4" strokeLinejoin="round" />
      <ellipse cx="100" cy="85" rx="75" ry="55" fill="white" stroke="#4A3540" strokeWidth="4" />
      
      {/* Sad Eyes */}
      <path d="M55 85 Q65 75 75 85" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M125 85 Q135 75 145 85" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
      
      {/* Tear */}
      <path d="M70 100 C70 100 65 110 70 115 C75 110 70 100 70 100 Z" fill="#60A5FA" />
      
      <ellipse cx="100" cy="98" rx="8" ry="6" fill="#FFD700" stroke="#4A3540" strokeWidth="2" />
      
      {/* Drooping Whiskers */}
      <line x1="10" y1="85" x2="40" y2="90" stroke="#4A3540" strokeWidth="3" strokeLinecap="round" />
      <line x1="15" y1="100" x2="38" y2="100" stroke="#4A3540" strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="115" x2="40" y2="110" stroke="#4A3540" strokeWidth="3" strokeLinecap="round" />
      
      <line x1="190" y1="85" x2="160" y2="90" stroke="#4A3540" strokeWidth="3" strokeLinecap="round" />
      <line x1="185" y1="100" x2="162" y2="100" stroke="#4A3540" strokeWidth="3" strokeLinecap="round" />
      <line x1="180" y1="115" x2="160" y2="110" stroke="#4A3540" strokeWidth="3" strokeLinecap="round" />
      
      <g transform="translate(130, 40) rotate(25)">
        <path d="M0 0 L-20 -15 L-20 15 Z" fill="#FF4F8B" stroke="#4A3540" strokeWidth="3" strokeLinejoin="round" />
        <path d="M0 0 L20 -15 L20 15 Z" fill="#FF4F8B" stroke="#4A3540" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="0" cy="0" r="8" fill="#FF4F8B" stroke="#4A3540" strokeWidth="3" />
      </g>
    </svg>
  );
}

export function SaveHelloKitty({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M30 30 C 30 20 45 20 45 30 C 45 45 30 55 30 55 C 30 55 15 45 15 30 C 15 20 30 20 30 30 Z" fill="#FF4F8B" />
      <path d="M170 20 C 170 10 185 10 185 20 C 185 35 170 45 170 45 C 170 45 155 35 155 20 C 155 10 170 10 170 20 Z" fill="#FF4F8B" />
      
      <path d="M40 70 L20 20 L70 40 Z" fill="white" stroke="#4A3540" strokeWidth="4" strokeLinejoin="round" />
      <path d="M160 70 L180 20 L130 40 Z" fill="white" stroke="#4A3540" strokeWidth="4" strokeLinejoin="round" />
      <ellipse cx="100" cy="85" rx="75" ry="55" fill="white" stroke="#4A3540" strokeWidth="4" />
      
      <path d="M55 85 Q65 70 75 85" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M125 85 Q135 70 145 85" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
      
      <ellipse cx="50" cy="95" rx="10" ry="5" fill="#FFD1DC" />
      <ellipse cx="150" cy="95" rx="10" ry="5" fill="#FFD1DC" />
      
      <ellipse cx="100" cy="95" rx="8" ry="6" fill="#FFD700" stroke="#4A3540" strokeWidth="2" />
      
      <line x1="10" y1="75" x2="40" y2="80" stroke="#4A3540" strokeWidth="3" strokeLinecap="round" />
      <line x1="5" y1="90" x2="38" y2="90" stroke="#4A3540" strokeWidth="3" strokeLinecap="round" />
      <line x1="10" y1="105" x2="40" y2="100" stroke="#4A3540" strokeWidth="3" strokeLinecap="round" />
      
      <line x1="190" y1="75" x2="160" y2="80" stroke="#4A3540" strokeWidth="3" strokeLinecap="round" />
      <line x1="195" y1="90" x2="162" y2="90" stroke="#4A3540" strokeWidth="3" strokeLinecap="round" />
      <line x1="190" y1="105" x2="160" y2="100" stroke="#4A3540" strokeWidth="3" strokeLinecap="round" />
      
      <g transform="translate(135, 35) rotate(15)">
        <path d="M0 0 L-22 -18 L-22 18 Z" fill="#FF4F8B" stroke="#4A3540" strokeWidth="3" strokeLinejoin="round" />
        <path d="M0 0 L22 -18 L22 18 Z" fill="#FF4F8B" stroke="#4A3540" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="0" cy="0" r="9" fill="#FF4F8B" stroke="#4A3540" strokeWidth="3" />
      </g>
    </svg>
  );
}

export function SidebarHelloKitty({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20 35 L10 10 L35 20 Z" fill="white" stroke="#4A3540" strokeWidth="2" strokeLinejoin="round" />
      <path d="M80 35 L90 10 L65 20 Z" fill="white" stroke="#4A3540" strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="50" cy="45" rx="35" ry="25" fill="white" stroke="#4A3540" strokeWidth="2" />
      
      <ellipse cx="35" cy="45" rx="2.5" ry="4" fill="#111" />
      <ellipse cx="65" cy="45" rx="2.5" ry="4" fill="#111" />
      <ellipse cx="50" cy="50" rx="3.5" ry="2.5" fill="#FFD700" stroke="#4A3540" strokeWidth="1" />
      
      <line x1="8" y1="40" x2="20" y2="42" stroke="#4A3540" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="48" x2="18" y2="48" stroke="#4A3540" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="56" x2="20" y2="54" stroke="#4A3540" strokeWidth="1.5" strokeLinecap="round" />
      
      <line x1="92" y1="40" x2="80" y2="42" stroke="#4A3540" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="95" y1="48" x2="82" y2="48" stroke="#4A3540" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="92" y1="56" x2="80" y2="54" stroke="#4A3540" strokeWidth="1.5" strokeLinecap="round" />
      
      <g transform="translate(68, 24) rotate(15) scale(0.5)">
        <path d="M0 0 L-25 -20 L-25 20 Z" fill="#FF4F8B" stroke="#4A3540" strokeWidth="3" strokeLinejoin="round" />
        <path d="M0 0 L25 -20 L25 20 Z" fill="#FF4F8B" stroke="#4A3540" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="0" cy="0" r="10" fill="#FF4F8B" stroke="#4A3540" strokeWidth="3" />
      </g>
      
      <path d="M10 65 L12 70 L17 72 L12 74 L10 79 L8 74 L3 72 L8 70 Z" fill="#FFD700" />
      <path d="M85 70 L87 75 L92 77 L87 79 L85 84 L83 79 L78 77 L83 75 Z" fill="#FFD1DC" />
    </svg>
  );
}

export function StickerIcon({ name, className }: { name: string, className?: string }) {
  const props = { viewBox: "0 0 24 24", fill: "currentColor", className };
  switch(name) {
    case 'heart': return <svg {...props}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
    case 'star': return <svg {...props}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>;
    case 'bow': return <svg {...props}><path d="M12 12c-2-2-6-4-8-4v8c2 0 6-2 8-4zm0 0c2-2 6-4 8-4v8c-2 0-6-2-8-4zm0 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/></svg>;
    case 'cake': return <svg {...props}><path d="M12 6a2 2 0 002-2c0-1.1-.9-2-2-2s-2 .9-2 2a2 2 0 002 2zm7 5h-4.18c-.41-1.16-1.51-2-2.82-2s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v2h18v-2c0-1.1-.9-2-2-2zM3 17v2c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2H3z"/></svg>;
    case 'flower': return <svg {...props}><path d="M12 2c-1.1 0-2 .9-2 2 0 .34.1.66.24.93C9.17 4.35 8 5.53 8 7c0 .54.17 1.04.46 1.46C7.04 8.17 5.54 8 5 8c-1.1 0-2 .9-2 2s.9 2 2 2c.54 0 2.04-.17 3.46-.46-.29.42-.46.92-.46 1.46 0 1.47 1.17 2.65 2.24 2.07-.14.27-.24.59-.24.93 0 1.1-.9 2 2 2s2-.9 2-2c0-.34-.1-.66-.24-.93C14.83 19.65 16 18.47 16 17c0-.54-.17-1.04-.46-1.46C16.96 15.83 18.46 16 19 16c1.1 0 2-.9 2-2s-.9-2-2-2c-.54 0-2.04.17-3.46.46.29-.42.46-.92.46-1.46 0-1.47-1.17-2.65-2.24-2.07.14-.27.24-.59.24-.93 0-1.1-.9-2-2-2zM12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>;
    case 'paw': return <svg {...props}><path d="M8.5 7.5C9.33 7.5 10 6.83 10 6s-.67-1.5-1.5-1.5S7 5.17 7 6s.67 1.5 1.5 1.5zm7 0c.83 0 1.5-.67 1.5-1.5S16.33 4.5 15.5 4.5 14 5.17 14 6s.67 1.5 1.5 1.5zm-3.5 2c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5zM6 9.5C5.17 9.5 4.5 10.17 4.5 11s.67 1.5 1.5 1.5S7.5 11.83 7.5 11 6.83 9.5 6 9.5zm12 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/></svg>;
    case 'cloud': return <svg {...props}><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>;
    case 'rainbow': return <svg {...props}><path d="M12 4C7.58 4 4 7.58 4 12H2c0-5.52 4.48-10 10-10s10 4.48 10 10h-2c0-4.42-3.58-8-8-8zm0 4c-2.21 0-4 1.79-4 4H6c0-3.31 2.69-6 6-6s6 2.69 6 6h-2c0-2.21-1.79-4-4-4z"/></svg>;
    default: return <span className={className}>★</span>;
  }
}
