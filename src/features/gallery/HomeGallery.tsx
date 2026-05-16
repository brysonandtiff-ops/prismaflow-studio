import React from 'react';
import { STARTER_PAGES } from '@/data/starterPages';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { Settings, Play, Sparkles, Palette } from 'lucide-react';

const difficultyGlow: Record<string, string> = {
  calm: 'glow-cyan',
  medium: 'glow-violet',
  detailed: 'glow-rose',
};

const difficultyAccent: Record<string, string> = {
  calm: 'text-[#45E7FF]',
  medium: 'text-[#8B5CF6]',
  detailed: 'text-[#FF6EC7]',
};

interface HomeGalleryProps {
  onSelectPage: (id: string) => void;
  onOpenAccess: () => void;
  onOpenAbout: () => void;
}

export const HomeGallery: React.FC<HomeGalleryProps> = ({ onSelectPage, onOpenAccess, onOpenAbout }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero header */}
        <section className="space-y-2 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Sparkles className="w-6 h-6 text-[#45E7FF]" />
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
                  Studio Gallery
                </h2>
              </div>
              <p className="text-muted-foreground text-pretty max-w-lg">
                Choose a canvas to start your creative journey. Each piece is designed for immersive, accessible colouring.
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenAccess}
              aria-label="Accessibility Settings"
              className="shrink-0 self-center md:self-auto border-border/60 hover:border-[#45E7FF]/40 hover:bg-[#45E7FF]/5 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </section>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STARTER_PAGES.map((page) => (
            <GlassPanel
              key={page.id}
              className="group cursor-pointer flex flex-col h-full hover:border-border/70 transition-all duration-300 hover:-translate-y-1"
              as="article"
            >
              <div
                className="aspect-[4/3] bg-muted/20 flex items-center justify-center relative overflow-hidden rounded-t-2xl"
                onClick={() => onSelectPage(page.id)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${page.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectPage(page.id);
                  }
                }}
              >
                {page.image ? (
                  <img
                    src={page.image}
                    alt={page.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                    <Palette className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                  <div className="bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-sm scale-90 group-hover:scale-100 transition-transform duration-300 flex items-center gap-2 shadow-lg">
                    <Play className="w-4 h-4 fill-current" />
                    Start Colouring
                  </div>
                </div>
                {/* Edge glow on hover */}
                <div className={`absolute inset-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${difficultyGlow[page.difficulty] || ''}`} />
              </div>

              <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold tracking-tight">{page.title}</h3>
                  <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary/60 ${difficultyAccent[page.difficulty] || 'text-muted-foreground'}`}>
                    {page.difficulty}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 text-pretty flex-1">
                  {page.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectPage(page.id)}
                  className="w-full mt-1 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  Open Studio
                </Button>
              </div>
            </GlassPanel>
          ))}
        </div>

        {/* Inclusive CTA */}
        <GlassPanel strong className="p-8 border border-[#45E7FF]/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#45E7FF]/5 via-transparent to-[#8B5CF6]/5 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#6EF3B5] animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6EF3B5]">
                  Inclusive by Design
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Built for Everyone</h3>
              <p className="text-muted-foreground text-pretty max-w-prose leading-relaxed">
                PRISMAFLOW Studio features tailored profiles for ADHD Focus Flow, Autism Calm Mode, Dyslexia Assist, Low Vision, Motor Assist, and Blind Guide Mode.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={onOpenAccess}
                  className="bg-gradient-to-r from-[#45E7FF] to-[#8B5CF6] text-[#07080D] font-semibold hover:opacity-90 transition-opacity"
                >
                  Open Access Centre
                </Button>
                <Button variant="outline" onClick={onOpenAbout} className="border-border/60">
                  Privacy & Safety
                </Button>
              </div>
            </div>
            <div className="shrink-0 w-28 h-28 rounded-2xl bg-gradient-to-br from-[#45E7FF]/15 to-[#8B5CF6]/15 flex items-center justify-center glow-cyan">
              <Settings className="w-14 h-14 text-[#45E7FF]" />
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
