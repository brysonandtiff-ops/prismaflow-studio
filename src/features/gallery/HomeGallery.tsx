import React, { useState, useEffect } from 'react';
import { STARTER_PAGES } from '@/data/starterPages';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { Settings, Play, Sparkles, Palette, Upload, Clock, Wand2, Image as ImageIcon } from 'lucide-react';
import { ImportHub, ImportedPage } from '@/features/import/ImportHub';
import { PaletteLibrary } from '@/features/palette/PaletteLibrary';

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

function loadImportedPages(): ImportedPage[] {
  try {
    const saved = localStorage.getItem('prismaflow-imported-pages');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function loadRecentPages(): string[] {
  try {
    const saved = localStorage.getItem('prismaflow-recent-pages');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function saveRecentPage(pageId: string) {
  const recent = loadRecentPages();
  const updated = [pageId, ...recent.filter(id => id !== pageId)].slice(0, 6);
  localStorage.setItem('prismaflow-recent-pages', JSON.stringify(updated));
}

interface HomeGalleryProps {
  onSelectPage: (id: string) => void;
  onOpenAccess: () => void;
  onOpenAbout: () => void;
}

export const HomeGallery: React.FC<HomeGalleryProps> = ({ onSelectPage, onOpenAccess, onOpenAbout }) => {
  const [showImportHub, setShowImportHub] = useState(false);
  const [showPaletteLibrary, setShowPaletteLibrary] = useState(false);
  const [importedPages, setImportedPages] = useState<ImportedPage[]>(loadImportedPages);
  const [recentPages] = useState<string[]>(loadRecentPages);
  const [selectedPaletteColor, setSelectedPaletteColor] = useState('#45E7FF');

  const handleSelectPage = (id: string) => {
    saveRecentPage(id);
    onSelectPage(id);
  };

  const handleOpenImported = (page: ImportedPage) => {
    handleSelectPage(page.id);
  };

  const recentStarter = STARTER_PAGES.filter(p => recentPages.includes(p.id));
  const hasRecent = recentStarter.length > 0;

  const PageCard: React.FC<{ page: typeof STARTER_PAGES[0] }> = ({ page }) => (
    <GlassPanel
      className="group cursor-pointer flex flex-col h-full hover:border-border/70 transition-all duration-300 hover:-translate-y-1"
      as="article"
    >
      <div
        className="aspect-[4/3] bg-muted/20 flex items-center justify-center relative overflow-hidden rounded-t-2xl"
        onClick={() => handleSelectPage(page.id)}
        role="button"
        tabIndex={0}
        aria-label={`Open ${page.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelectPage(page.id);
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
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
          <div className="bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-sm scale-90 group-hover:scale-100 transition-transform duration-300 flex items-center gap-2 shadow-lg">
            <Play className="w-4 h-4 fill-current" />
            Start Colouring
          </div>
        </div>
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
          onClick={() => handleSelectPage(page.id)}
          className="w-full mt-1 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          Open Studio
        </Button>
      </div>
    </GlassPanel>
  );

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
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowImportHub(true)}
                className="gap-2 border-border/60 hover:border-[#FFD166]/40 hover:bg-[#FFD166]/5 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Import
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onOpenAccess}
                aria-label="Accessibility Settings"
                className="shrink-0 border-border/60 hover:border-[#45E7FF]/40 hover:bg-[#45E7FF]/5 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Recently Opened */}
        {hasRecent && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8B5CF6]" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">Recently Opened</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentStarter.map(page => (
                <PageCard key={page.id} page={page} />
              ))}
            </div>
          </section>
        )}

        {/* Built-in Pages */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-[#45E7FF]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Built-in Pages</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STARTER_PAGES.map(page => (
              <PageCard key={page.id} page={page} />
            ))}
          </div>
        </section>

        {/* My Imported Pages */}
        {importedPages.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#FFD166]" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">My Imported Pages</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {importedPages.map(page => (
                <GlassPanel
                  key={page.id}
                  className="group cursor-pointer flex flex-col h-full hover:border-border/70 transition-all duration-300 hover:-translate-y-1"
                  as="article"
                >
                  <div
                    className="aspect-[4/3] bg-muted/20 flex items-center justify-center relative overflow-hidden rounded-t-2xl"
                    onClick={() => handleOpenImported(page)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${page.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenImported(page);
                      }
                    }}
                  >
                    {page.type === 'raster' ? (
                      <img
                        src={page.data}
                        alt={page.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                        <Palette className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                      <div className="bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-sm scale-90 group-hover:scale-100 transition-transform duration-300 flex items-center gap-2 shadow-lg">
                        <Play className="w-4 h-4 fill-current" />
                        Start Colouring
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold tracking-tight">{page.title}</h3>
                      <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary/60 text-muted-foreground">
                        {page.type === 'svg' ? 'SVG' : 'Image'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 text-pretty flex-1">
                      {page.type === 'svg' ? `${page.regions.length} colourable regions` : 'Brush colouring page'}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenImported(page)}
                      className="w-full mt-1 hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      Open Studio
                    </Button>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </section>
        )}

        {/* Custom Palettes Shortcut */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#8B5CF6]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Palette</h3>
          </div>
          <GlassPanel className="p-5">
            <div className="flex flex-wrap gap-2">
              {['#FF0054', '#00F5D4', '#FFD166', '#8B5CF6', '#FF6EC7', '#6EF3B5', '#45E7FF', '#FFFFFF'].map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedPaletteColor(color)}
                  className="w-10 h-10 rounded-lg border-2 border-transparent hover:border-white/30 transition-all hover:scale-110"
                  style={{ backgroundColor: color }}
                  aria-label={`Select ${color}`}
                />
              ))}
              <button
                onClick={() => setShowPaletteLibrary(true)}
                className="w-10 h-10 rounded-lg border border-dashed border-border/40 flex items-center justify-center text-muted-foreground hover:bg-muted/30 transition-colors"
                aria-label="Open full palette library"
              >
                <Palette className="w-4 h-4" />
              </button>
            </div>
          </GlassPanel>
        </section>

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

      {showImportHub && (
        <ImportHub
          onClose={() => { setShowImportHub(false); setImportedPages(loadImportedPages()); }}
          onOpenImported={handleOpenImported}
        />
      )}
      {showPaletteLibrary && (
        <PaletteLibrary
          selectedColor={selectedPaletteColor}
          onSelectColor={(c) => { setSelectedPaletteColor(c); setShowPaletteLibrary(false); }}
          onClose={() => setShowPaletteLibrary(false)}
        />
      )}
    </div>
  );
};
