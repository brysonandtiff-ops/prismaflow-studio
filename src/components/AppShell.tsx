import React from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen w-full bg-background prism-glow flex flex-col", className)}>
      <header className="h-16 border-b border-border/40 bg-background/60 backdrop-blur-md flex items-center px-4 md:px-8 shrink-0 z-40 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold italic">
            P
          </div>
          <h1 className="text-xl font-bold tracking-tight text-balance">
            PRISMAFLOW <span className="font-light text-muted-foreground">Studio</span>
          </h1>
        </div>
      </header>
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};
