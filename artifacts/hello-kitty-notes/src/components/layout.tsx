import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, BookHeart, PenLine } from 'lucide-react';
import { HelloKittyFace } from './hello-kitty-face';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: '/', icon: Home, label: 'Feed' },
    { href: '/archive', icon: BookHeart, label: 'Archive' },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDE4MywgMjA5LCAwLjIpIi8+PC9zdmc+')]">
      
      {/* Sidebar / Topnav */}
      <nav className="w-full md:w-64 bg-card/80 backdrop-blur-md border-b md:border-b-0 md:border-r border-border p-6 flex flex-col shrink-0 relative overflow-hidden z-10">
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-20 pointer-events-none">
          <svg width="100" height="100" viewBox="0 0 100 100"><path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" fill="#FF6B9D"/></svg>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-8 h-full">
          
          {/* Logo Area */}
          <Link href="/" className="flex flex-col md:flex-row items-center gap-3 group">
            <HelloKittyFace className="w-16 h-16 md:w-24 md:h-24 transition-transform group-hover:scale-105 group-hover:-rotate-3 duration-300" />
            <div className="hidden md:block">
              <h1 className="font-heading text-2xl text-primary font-bold drop-shadow-sm tracking-wide leading-tight">My Dear<br/>Journal</h1>
            </div>
          </Link>

          {/* Links */}
          <div className="flex flex-row md:flex-col gap-2 w-full md:w-full">
            {navItems.map((item) => {
              const active = location === item.href;
              return (
                <Link key={item.href} href={item.href} className="w-full">
                  <span className={cn(
                    "flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-300 group cursor-pointer",
                    active 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}>
                    <item.icon className={cn("w-5 h-5", active ? "text-primary-foreground" : "text-primary group-hover:scale-110 transition-transform")} />
                    <span className="hidden md:inline">{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="md:mt-auto hidden md:block w-full">
            <Link href="/entry/new" className="block w-full">
              <motion.span 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-accent text-accent-foreground font-bold shadow-lg shadow-accent/30 cursor-pointer"
              >
                <PenLine className="w-5 h-5" />
                <span>New Entry</span>
              </motion.span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-4xl mx-auto">
        {children}
      </main>

      {/* Mobile FAB */}
      <Link href="/entry/new" className="md:hidden fixed bottom-6 right-6 z-50">
        <motion.span 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/40"
        >
          <PenLine className="w-6 h-6" />
        </motion.span>
      </Link>
    </div>
  );
}
