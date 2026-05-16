import React from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen w-full bg-background prism-glow flex flex-col", className)}>
      <header className="h-16 border-b border-border/40 bg-card/70 backdrop-blur-2xl flex items-center px-4 md:px-8 shrink-0 z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(189,100%,64%)] to-[hsl(258,90%,65%)] flex items-center justify-center text-[#07080D] font-bold italic text-lg shadow-lg shadow-primary/20">
            P
          </div>
          <h1 className="text-xl font-bold tracking-tight text-balance">
            <span className="text-foreground">PRISMAFLOW</span>{' '}
            <span className="font-light text-muted-foreground">Studio</span>
          </h1>
        </div>
      </header>
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};
