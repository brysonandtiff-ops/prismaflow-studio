import React, { useState, useEffect, useCallback } from 'react';
import { STARTER_PAGES } from '@/data/starterPages';
import type { ColoringPage } from '@/features/studio/regionModel';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Settings, Play, Sparkles, Palette, Upload, Clock,
  Wand2, Image as ImageIcon, RotateCcw, Keyboard,
  Eye, Download, Trash2, Pencil, Plus, FileImage, Layers,
  Zap, Palette as PaletteIcon, ArrowRight
} from 'lucide-react';
import { ImportHub, ImportedPage } from '@/features/import/ImportHub';
import { PaletteLibrary } from '@/features/palette/PaletteLibrary';
import { CustomPaletteBuilder } from '@/features/palette/CustomPaletteBuilder';
import { useCustomPalettes } from '@/features/palette/useCustomPalettes';
import { toast } from 'sonner';

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

const difficultyLabel: Record<string, string> = {
  calm: 'Calm',
  medium: 'Medium',
  detailed: 'Detailed',
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

function getProjectState(pageId: string) {
  try {
    const saved = localStorage.getItem(`prismaflow-project-${pageId}`);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch { return null; }
}

function estimateProgress(page: ColoringPage | ImportedPage, state: any) {
  if (!state) return 0;
  const filled = Object.keys(state.fills || {}).length;
  const total = 'regions' in page && page.regions ? page.regions.length : 0;
  if (total === 0) return state.brushData ? 50 : 0;
  return Math.min(100, Math.round((filled / total) * 100));
}

interface HomeGalleryProps {
  onSelectPage: (id: string) => void;
  onOpenAccess: () => void;
  onOpenAbout: () => void;
}

export const HomeGallery: React.FC<HomeGalleryProps> = ({ onSelectPage, onOpenAccess, onOpenAbout }) => {
  const [showImportHub, setShowImportHub] = useState(false);
  const [showPaletteLibrary, setShowPaletteLibrary] = useState(false);
  const [showPaletteBuilder, setShowPaletteBuilder] = useState(false);
  const [importedPages, setImportedPages] = useState<ImportedPage[]>(loadImportedPages);
  const [recentPages] = useState<string[]>(loadRecentPages);
  const [selectedPaletteColor, setSelectedPaletteColor] = useState('#45E7FF');
  const { customPalettes } = useCustomPalettes();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleSelectPage = (id: string) => {
    saveRecentPage(id);
    onSelectPage(id);
  };

  const handleOpenImported = (page: ImportedPage) => {
    handleSelectPage(page.id);
  };

  const handleDeleteImported = useCallback((id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const updated = importedPages.filter(p => p.id !== id);
    setImportedPages(updated);
    localStorage.setItem('prismaflow-imported-pages', JSON.stringify(updated));
    toast.success(`"${title}" deleted`);
  }, [importedPages]);

  const handleRenameImported = useCallback((id: string) => {
    const page = importedPages.find(p => p.id === id);
    if (!page) return;
    setEditingId(id);
    setEditName(page.title);
  }, [importedPages]);

  const saveRename = useCallback(() => {
    if (!editingId || !editName.trim()) { setEditingId(null); return; }
    const updated = importedPages.map(p =>
      p.id === editingId ? { ...p, title: editName.trim() } : p
    );
    setImportedPages(updated);
    localStorage.setItem('prismaflow-imported-pages', JSON.stringify(updated));
    setEditingId(null);
    setEditName('');
    toast.success('Page renamed');
  }, [editingId, editName, importedPages]);

  const handleResetProject = (pageId: string, title: string) => {
    if (!window.confirm(`Reset all progress for "${title}"? This cannot be undone.`)) return;
    localStorage.removeItem(`prismaflow-project-${pageId}`);
    toast.success(`"${title}" reset`);
  };

  const recentStarter = STARTER_PAGES.filter(p => recentPages.includes(p.id));
  const recentImported = importedPages.filter(p => recentPages.includes(p.id));
  const allRecentIds = recentPages;
  const hasRecentProjects = allRecentIds.length > 0;

  // Continue Colouring: merge starter + imported that have saved state or are in recent
  const continueProjects = allRecentIds.map(id => {
    const starter = STARTER_PAGES.find(p => p.id === id);
    const imported = importedPages.find(p => p.id === id);
    const page = starter || imported;
    if (!page) return null;
    const state = getProjectState(id);
    const progress = estimateProgress(page, state);
    return { page, state, progress };
  }).filter(Boolean) as { page: ColoringPage | ImportedPage; state: any; progress: number }[];

  const hasContinue = continueProjects.length > 0;

  // --- Component: Empty State ---
  const EmptyState: React.FC<{ icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }> =
    ({ icon, title, description, action }) => (
      <GlassPanel className="p-8 flex flex-col items-center text-center gap-4 border border-dashed border-border/30">
        <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground text-pretty max-w-xs">{description}</p>
        </div>
        {action}
      </GlassPanel>
    );

  // --- Component: Built-in Page Card ---
  const BuiltInCard: React.FC<{ page: typeof STARTER_PAGES[0] }> = ({ page }) => {
    const regionCount = page.regions.length;
    const recPalette = page.recommendedPalette || 'Prism Calm';
    const estTime = page.estimatedMinutes || 15;
    const badges = page.accessBadges || ['Keyboard Ready', 'Offline'];

    return (
      <GlassPanel
        className="group cursor-pointer flex flex-col h-full hover:border-border/70 transition-all duration-300 hover:-translate-y-1"
        as="article"
      >
        <div
          className="aspect-[4/3] bg-muted/20 flex items-center justify-center relative overflow-hidden rounded-t-2xl"
          onClick={() => handleSelectPage(page.id)}
          role="button"
          tabIndex={0}
          aria-label={`Open ${page.title}. ${page.altText || page.description}`}
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
              alt={page.altText || page.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
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
            <span className={cn(
              "text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary/60",
              difficultyAccent[page.difficulty] || 'text-muted-foreground'
            )}>
              {difficultyLabel[page.difficulty] || page.difficulty}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 text-pretty flex-1">
            {page.description}
          </p>
          {/* Meta row */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/30 px-2 py-1 rounded-lg">
              <Layers className="w-3 h-3" />
              {regionCount} regions
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/30 px-2 py-1 rounded-lg">
              <PaletteIcon className="w-3 h-3" />
              {recPalette}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/30 px-2 py-1 rounded-lg">
              <Clock className="w-3 h-3" />
              ~{estTime} min
            </span>
          </div>
          {/* Access badges */}
          <div className="flex flex-wrap gap-1.5">
            {badges.map(badge => (
              <span key={badge} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#6EF3B5]/10 text-[#6EF3B5]">
                {badge === 'Keyboard Ready' && <Keyboard className="w-2.5 h-2.5" />}
                {badge === 'Blind Guide' && <Eye className="w-2.5 h-2.5" />}
                {badge === 'Low Vision Safe' && <Zap className="w-2.5 h-2.5" />}
                {badge === 'Offline' && <Download className="w-2.5 h-2.5" />}
                {badge}
              </span>
            ))}
          </div>
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
  };

  // --- Component: Imported Page Card (Gallery view) ---
  const ImportedCard: React.FC<{ page: ImportedPage }> = ({ page }) => {
    const isEditing = editingId === page.id;
    const isRaster = page.type === 'raster';

    return (
      <GlassPanel className="flex flex-col h-full border border-border/20 hover:border-border/50 transition-all" as="article">
        <div
          className="aspect-[4/3] bg-muted/20 flex items-center justify-center relative overflow-hidden rounded-t-2xl cursor-pointer group"
          onClick={() => handleOpenImported(page)}
          role="button"
          tabIndex={0}
          aria-label={`Open imported page ${page.title}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpenImported(page);
            }
          }}
        >
          {isRaster ? (
            <img
              src={page.data}
              alt={page.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
              <FileImage className="w-14 h-14 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md",
              isRaster
                ? "bg-[#FF6EC7]/15 text-[#FF6EC7]"
                : "bg-[#6EF3B5]/15 text-[#6EF3B5]"
            )}>
              {isRaster ? 'Raster Line-Art' : 'SVG Region'}
            </span>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col gap-2">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={saveRename}
              onKeyDown={(e) => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') setEditingId(null); }}
              className="w-full px-2 py-1.5 rounded bg-background/50 border border-border/40 text-sm font-semibold"
              autoFocus
              aria-label="Rename imported page"
            />
          ) : (
            <button
              onClick={() => handleRenameImported(page.id)}
              className="text-left font-semibold text-sm truncate hover:text-primary transition-colors"
              aria-label={`Rename ${page.title}`}
            >
              {page.title}
            </button>
          )}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {new Date(page.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
          {isRaster && (
            <p className="text-[11px] text-[#FF6EC7]/80 bg-[#FF6EC7]/5 px-2 py-1 rounded">
              Brush colouring only — no regions detected
            </p>
          )}
          {!isRaster && (
            <p className="text-[11px] text-muted-foreground">
              {page.regions.length} colourable regions
            </p>
          )}
          <div className="mt-auto pt-2 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenImported(page)}
              className="flex-1 rounded-lg text-xs hover:bg-primary/10 hover:text-primary"
            >
              Open
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRenameImported(page.id)}
              aria-label={`Rename ${page.title}`}
              className="h-8 w-8 rounded-lg hover:bg-[#FFD166]/10 hover:text-[#FFD166]"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteImported(page.id, page.title)}
              aria-label={`Delete ${page.title}`}
              className="h-8 w-8 rounded-lg hover:bg-[#FF6EC7]/10 hover:text-[#FF6EC7]"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </GlassPanel>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-14">
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
                Choose a canvas to start your creative journey. Every piece is designed for immersive, accessible colouring.
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

        {/* 1. Continue Colouring */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#6EF3B5]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Continue Colouring</h3>
          </div>
          {hasContinue ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {continueProjects.map(({ page, state, progress }) => {
                const isStarter = 'difficulty' in page;
                const lastEdit = state?.lastModified
                  ? new Date(state.lastModified).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                  : 'Recently';
                return (
                  <GlassPanel key={page.id} className="p-4 flex flex-col gap-3 hover:border-border/50 transition-all" as="article">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{page.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Last edited {lastEdit}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-lg font-bold text-[#45E7FF]">{progress}%</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#45E7FF] to-[#8B5CF6] transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Button
                        size="sm"
                        onClick={() => handleSelectPage(page.id)}
                        className="flex-1 rounded-lg bg-gradient-to-r from-[#45E7FF] to-[#8B5CF6] text-[#07080D] font-semibold text-xs hover:opacity-90"
                      >
                        Continue
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetProject(page.id, page.title)}
                        className="rounded-lg border-border/40 text-muted-foreground hover:text-[#FF6EC7] hover:border-[#FF6EC7]/30 text-xs"
                      >
                        Reset
                      </Button>
                    </div>
                  </GlassPanel>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<Clock className="w-6 h-6 text-muted-foreground" />}
              title="No recent projects"
              description="Open any built-in or imported page and your progress will appear here for quick access."
            />
          )}
        </section>

        {/* 2. Built-in Pages */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-[#45E7FF]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Built-in Pages</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STARTER_PAGES.map(page => (
              <BuiltInCard key={page.id} page={page} />
            ))}
          </div>
        </section>

        {/* 3. My Imported Pages */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#FFD166]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">My Imported Pages</h3>
          </div>
          {importedPages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {importedPages.map(page => (
                <ImportedCard key={page.id} page={page} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Upload className="w-6 h-6 text-muted-foreground" />}
              title="No imported pages yet"
              description="Upload your own SVG or raster images to create personal colouring pages."
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImportHub(true)}
                  className="gap-2 border-[#FFD166]/30 text-[#FFD166] hover:bg-[#FFD166]/10 rounded-xl"
                >
                  <Plus className="w-4 h-4" /> Import Artwork
                </Button>
              }
            />
          )}
        </section>

        {/* 4. Create Your Own */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#FF6EC7]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Create Your Own</h3>
          </div>
          <GlassPanel className="p-6 md:p-8 border border-[#FF6EC7]/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6EC7]/5 via-transparent to-[#FFD166]/5 pointer-events-none" />
            <div className="relative flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 space-y-4">
                <h4 className="text-xl font-bold tracking-tight">Bring Your Art to Life</h4>
                <p className="text-sm text-muted-foreground text-pretty max-w-prose leading-relaxed">
                  Import SVG files with built-in region detection for tap-to-fill colouring, or convert any photo into line art for freehand brush painting.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => setShowImportHub(true)}
                    className="bg-gradient-to-r from-[#FF6EC7] to-[#FFD166] text-[#07080D] font-semibold hover:opacity-90 transition-opacity rounded-xl"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Open Import Hub
                  </Button>
                </div>
              </div>
              <div className="shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-[#FF6EC7]/15 to-[#FFD166]/15 flex items-center justify-center">
                <FileImage className="w-12 h-12 text-[#FF6EC7]" />
              </div>
            </div>
          </GlassPanel>
        </section>

        {/* 5. Palette Studio */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#8B5CF6]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Palette Studio</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Palette Library shortcut */}
            <GlassPanel
              className="p-6 flex flex-col gap-4 cursor-pointer hover:border-[#45E7FF]/30 transition-all group"
              onClick={() => setShowPaletteLibrary(true)}
              role="button"
              tabIndex={0}
              aria-label="Open Palette Library"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowPaletteLibrary(true); }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#45E7FF]/10 flex items-center justify-center">
                  <PaletteIcon className="w-5 h-5 text-[#45E7FF]" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Palette Library</h4>
                  <p className="text-xs text-muted-foreground">25 curated palettes across 5 categories</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-[#45E7FF] group-hover:translate-x-1 transition-all" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['#45E7FF', '#8B5CF6', '#FF6EC7', '#FFD166', '#6EF3B5', '#FF0054', '#00F5D4', '#FFFFFF', '#000000', '#E0115F'].map(c => (
                  <div key={c} className="w-5 h-5 rounded-sm" style={{ backgroundColor: c }} />
                ))}
              </div>
            </GlassPanel>

            {/* Custom Builder shortcut */}
            <GlassPanel
              className="p-6 flex flex-col gap-4 cursor-pointer hover:border-[#8B5CF6]/30 transition-all group"
              onClick={() => setShowPaletteBuilder(true)}
              role="button"
              tabIndex={0}
              aria-label="Open Custom Palette Builder"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowPaletteBuilder(true); }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Custom Palette Builder</h4>
                  <p className="text-xs text-muted-foreground">
                    {customPalettes.length > 0
                      ? `${customPalettes.length} custom palette${customPalettes.length === 1 ? '' : 's'} saved`
                      : 'Create and save your own colour palettes'}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-[#8B5CF6] group-hover:translate-x-1 transition-all" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {customPalettes.slice(0, 3).flatMap(cp => cp.colors.slice(0, 4)).concat(['#45E7FF', '#8B5CF6', '#FF6EC7', '#FFD166']).slice(0, 10).map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-sm" style={{ backgroundColor: c }} />
                ))}
                {customPalettes.length === 0 && (
                  <span className="text-xs text-muted-foreground">No custom palettes yet</span>
                )}
              </div>
            </GlassPanel>
          </div>
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
      {showPaletteBuilder && (
        <CustomPaletteBuilder
          selectedColor={selectedPaletteColor}
          onSelectColor={(c) => { setSelectedPaletteColor(c); }}
          onClose={() => setShowPaletteBuilder(false)}
        />
      )}
    </div>
  );
};
