import React from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
  onReturnHome: () => void;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends React.Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[PRISMAFLOW] Recovered application error', error, info);
  }

  private handleReturnHome = () => {
    this.setState({ error: null });
    this.props.onReturnHome();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center p-6" role="alert">
        <section className="w-full max-w-lg rounded-3xl border border-[#FFD166]/25 bg-card/90 p-7 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD166]/10 text-[#FFD166]">
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold">The studio hit a recoverable problem</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Your artwork is stored locally. Reload the studio or return to the gallery without deleting project data.
          </p>
          <details className="mt-4 rounded-xl border border-border/30 bg-background/40 p-3 text-left text-xs text-muted-foreground">
            <summary className="cursor-pointer font-medium text-foreground">Technical details</summary>
            <pre className="mt-2 whitespace-pre-wrap break-words">{this.state.error.message}</pre>
          </details>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button onClick={() => window.location.reload()} className="gap-2 rounded-xl">
              <RefreshCcw className="h-4 w-4" /> Reload studio
            </Button>
            <Button variant="outline" onClick={this.handleReturnHome} className="gap-2 rounded-xl">
              <Home className="h-4 w-4" /> Return to gallery
            </Button>
          </div>
        </section>
      </main>
    );
  }
}
