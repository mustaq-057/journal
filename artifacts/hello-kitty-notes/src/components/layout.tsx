import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, BookHeart, PenLine, MessageCircleHeart, Settings } from 'lucide-react';
import { HelloKittyFace } from './hello-kitty-face';
import { SidebarHelloKitty, StickerIcon } from './hello-kitty-svgs';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: '/', icon: Home, label: 'Feed' },
    { href: '/archive', icon: BookHeart, label: 'Archive' },
    { href: '/kitty', icon: MessageCircleHeart, label: 'Kitty AI' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-transparent overflow-hidden">
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-5 py-3 bg-card/90 backdrop-blur-xl border-b border-border z-20 shrink-0 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10 pointer-events-none">
          <StickerIcon name="bow" className="w-32 h-32 text-primary" />
        </div>
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <HelloKittyFace className="w-10 h-10 drop-shadow-sm" />
          <h1 className="font-heading text-xl text-primary font-bold drop-shadow-sm">My Dear Journal</h1>
        </Link>
      </header>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-72 bg-card/90 backdrop-blur-xl border-r border-border p-8 flex-col shrink-0 relative overflow-hidden z-20 shadow-[4px_0_24px_rgba(255,79,139,0.05)]">
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><circle cx='20' cy='20' r='1.5' fill='%23FF4F8B'/></svg>\")" }}></div>
        <div className="absolute top-0 right-0 -mr-12 -mt-12 opacity-10 pointer-events-none">
          <StickerIcon name="bow" className="w-48 h-48 text-primary" />
        </div>

        <div className="flex flex-col items-stretch justify-start gap-8 h-full relative z-10">
          
          {/* Logo Area */}
          <Link href="/" className="flex flex-col items-center gap-3 group cursor-pointer">
            <HelloKittyFace className="w-28 h-28 transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-500 drop-shadow-lg" />
            <div className="text-center">
              <h1 className="font-heading text-3xl text-primary font-bold drop-shadow-sm tracking-wide leading-tight">My Dear<br/>Journal</h1>
              <p className="text-[10px] text-primary/70 font-bold uppercase tracking-[0.2em] mt-3 bg-primary/10 py-1 px-3 rounded-full">
                ✦ write ✦ dream ✦ smile ✦
              </p>
            </div>
          </Link>

          {/* Links */}
          <div className="flex flex-col gap-2 w-full mt-4">
            {navItems.map((item, index) => {
              const active = location === item.href;
              return (
                <React.Fragment key={item.href}>
                  <Link href={item.href} className="w-full">
                    <span className={cn(
                      "flex items-center justify-start gap-3 px-5 py-4 rounded-[1.5rem] font-bold transition-all duration-300 group cursor-pointer",
                      active 
                        ? "bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(255,79,139,0.3)] scale-[1.02]" 
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}>
                      <item.icon className={cn("w-5 h-5", active ? "text-primary-foreground" : "text-primary/70 group-hover:text-primary group-hover:scale-110 transition-all")} />
                      <span className="inline font-secondary text-lg">{item.label}</span>
                    </span>
                  </Link>
                  {index < navItems.length - 1 && (
                    <div className="flex justify-center my-1 opacity-20 text-primary pointer-events-none">
                      <StickerIcon name="heart" className="w-4 h-4" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="mt-auto flex flex-col items-center w-full gap-8">
            <SidebarHelloKitty className="w-24 opacity-80" />
            
            <Link href="/entry/new" className="block w-full">
              <motion.span 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: ["0px 0px 0px rgba(255, 79, 139, 0)", "0px 0px 20px rgba(255, 79, 139, 0.4)", "0px 0px 0px rgba(255, 79, 139, 0)"] 
                }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-[1.5rem] bg-accent text-accent-foreground font-bold shadow-lg shadow-accent/30 cursor-pointer text-lg font-secondary"
              >
                <PenLine className="w-6 h-6" />
                <span>New Entry</span>
              </motion.span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-5xl mx-auto relative z-10 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-50 flex items-center justify-around p-2 px-4 shadow-[0_-4px_24px_rgba(255,79,139,0.05)]">
        {navItems.map((item) => {
          const active = location === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex-1 flex justify-center">
              <div className={cn(
                "flex flex-col items-center justify-center w-full py-2 gap-1 rounded-2xl transition-all cursor-pointer",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}>
                <item.icon className={cn("w-6 h-6", active && "drop-shadow-sm scale-110 transition-transform")} />
                <span className={cn("text-[11px] font-bold font-secondary transition-all", active ? "opacity-100" : "opacity-80")}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Mobile FAB */}
      <Link href="/entry/new" className="md:hidden fixed bottom-24 right-5 z-50">
        <motion.span 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          animate={{ boxShadow: ["0px 0px 0px rgba(255, 79, 139, 0)", "0px 0px 15px rgba(255, 79, 139, 0.5)", "0px 0px 0px rgba(255, 79, 139, 0)"] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg cursor-pointer"
        >
          <PenLine className="w-6 h-6" />
        </motion.span>
      </Link>
    </div>
  );
}
