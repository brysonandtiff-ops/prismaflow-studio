import React from 'react';
import { Download, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

interface DeferredInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const AppShell: React.FC<AppShellProps> = ({ children, className }) => {
  const [isOnline, setIsOnline] = React.useState(() => navigator.onLine);
  const [installPrompt, setInstallPrompt] = React.useState<DeferredInstallPrompt | null>(null);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as DeferredInstallPrompt);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <div className={cn('min-h-screen w-full bg-background prism-glow flex flex-col', className)}>
      <a
        href="#main-content"
        className="fixed left-3 top-3 z-[100] -translate-y-24 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <header className="min-h-16 border-b border-border/40 bg-card/70 backdrop-blur-2xl flex items-center justify-between gap-3 px-4 py-3 md:px-8 shrink-0 z-40 sticky top-0">
        <div className="flex min-w-0 items-center gap-3">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-[hsl(189,100%,64%)] to-[hsl(258,90%,65%)] flex items-center justify-center text-[#07080D] font-bold italic text-lg shadow-lg shadow-primary/20">
            P
          </div>
          <h1 className="truncate text-lg font-bold tracking-tight text-balance sm:text-xl">
            <span className="text-foreground">PRISMAFLOW</span>{' '}
            <span className="font-light text-muted-foreground">Studio</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex',
              isOnline ? 'bg-[#6EF3B5]/10 text-[#6EF3B5]' : 'bg-[#FFD166]/10 text-[#FFD166]',
            )}
            role="status"
            aria-live="polite"
          >
            {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {isOnline ? 'Online' : 'Offline ready'}
          </span>
          {installPrompt && (
            <Button size="sm" variant="outline" onClick={() => void installApp()} className="gap-2 rounded-xl">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Install app</span>
              <span className="sm:hidden">Install</span>
            </Button>
          )}
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col relative overflow-hidden outline-none">
        {children}
      </main>
    </div>
  );
};
