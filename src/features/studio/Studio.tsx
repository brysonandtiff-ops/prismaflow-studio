import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SvgColoringCanvas } from './SvgColoringCanvas';
import { BrushCanvas } from './BrushCanvas';
import { PalettePicker } from '@/features/palette/PalettePicker';
import { STARTER_PAGES } from '@/data/starterPages';
import { useUndoStack } from './useUndoStack';
import { AccessProfileType } from '@/features/access/accessProfiles';
import {
  ChevronLeft,
  Undo,
  Redo,
  Download,
  Settings,
  Brush,
  PaintBucket,
  Volume2,
  Maximize2,
  Eraser,
  Save
} from 'lucide-react';
import { exportArtwork } from '@/features/export/exportArtwork';
import { toast } from 'sonner';

interface StudioProps {
  pageId: string;
  onBack: () => void;
  onOpenAccess: () => void;
  activeProfile: AccessProfileType;
}

export const Studio: React.FC<StudioProps> = ({
  pageId,
  onBack,
  onOpenAccess,
  activeProfile
}) => {
  const [selectedColor, setSelectedColor] = useState('#45E7FF');
  const [mode, setMode] = useState<'fill' | 'brush'>('fill');
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [brushData, setBrushData] = useState<string | undefined>(undefined);
  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number>(-1);

  const page = STARTER_PAGES.find(p => p.id === pageId);

  if (!page) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Page not found</h2>
          <Button onClick={onBack} className="bg-gradient-to-r from-[#45E7FF] to-[#8B5CF6] text-[#07080D] font-semibold">
            Back to Gallery
          </Button>
        </div>
      </div>
    );
  }

  const {
    currentState: fills,
    pushState: pushFill,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetFills
  } = useUndoStack<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem(`prismaflow-project-${pageId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.fills) resetFills(parsed.fills);
        if (parsed.brushData) setBrushData(parsed.brushData);
      } catch (e) {
        console.error('Failed to load project', e);
      }
    }
  }, [pageId, resetFills]);

  const handleFill = useCallback((regionId: string) => {
    if (mode !== 'fill') return;
    const newFills = { ...fills, [regionId]: selectedColor };
    pushFill(newFills);

    localStorage.setItem(`prismaflow-project-${pageId}`, JSON.stringify({
      pageId,
      fills: newFills,
      brushData,
      lastModified: Date.now()
    }));
  }, [fills, mode, pageId, pushFill, selectedColor, brushData]);

  const handleBrushUpdate = useCallback((dataUrl: string) => {
    setBrushData(dataUrl);
    localStorage.setItem(`prismaflow-project-${pageId}`, JSON.stringify({
      pageId,
      fills,
      brushData: dataUrl,
      lastModified: Date.now()
    }));
  }, [fills, pageId]);

  const handleClearCanvas = () => {
    if (window.confirm('Clear all progress (fills and brush strokes)? This cannot be undone.')) {
      resetFills({});
      setBrushData(undefined);
      localStorage.setItem(`prismaflow-project-${pageId}`, JSON.stringify({
        pageId,
        fills: {},
        brushData: undefined,
        lastModified: Date.now()
      }));
      toast.success('Canvas cleared');
    }
  };

  const handleUndo = useCallback(() => {
    const prevState = undo();
    if (prevState) {
      localStorage.setItem(`prismaflow-project-${pageId}`, JSON.stringify({
        pageId,
        fills: prevState,
        brushData,
        lastModified: Date.now()
      }));
    }
  }, [undo, pageId, brushData]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      localStorage.setItem(`prismaflow-project-${pageId}`, JSON.stringify({
        pageId,
        fills: nextState,
        brushData,
        lastModified: Date.now()
      }));
    }
  }, [redo, pageId, brushData]);

  const speakRegion = useCallback((regionId: string) => {
    if (!('speechSynthesis' in window)) return;
    const region = page?.regions.find(r => r.id === regionId);
    if (!region) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${region.name}. ${region.description}. Current color: ${fills[regionId] || 'white'}.`
    );
    window.speechSynthesis.speak(utterance);
  }, [page, fills]);

  useEffect(() => {
    if (selectedRegionIndex >= 0 && svgRef.current) {
      const regionId = page.regions[selectedRegionIndex].id;
      const path = svgRef.current.querySelector(`[id="${regionId}"]`);
      if (path && path instanceof SVGElement) {
        (path as HTMLElement).focus();
      }
    }
  }, [selectedRegionIndex, page]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!page) return;

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          if (e.shiftKey) handleRedo();
          else handleUndo();
          return;
        }
        if (e.key === 'y') {
          handleRedo();
          return;
        }
      }

      const isNext = e.key === 'ArrowRight' || e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey);
      const isPrev = e.key === 'ArrowLeft' || e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey);

      if (isNext || isPrev) {
        if (e.key === 'Tab') {
          const active = document.activeElement;
          const inCanvas = svgRef.current && active && svgRef.current.contains(active as Node);
          if (!inCanvas) return;
          e.preventDefault();
        }

        if (isNext) {
          setSelectedRegionIndex(prev => {
            const next = (prev + 1) % page.regions.length;
            speakRegion(page.regions[next].id);
            return next;
          });
        } else {
          setSelectedRegionIndex(prev => {
            const next = prev <= 0 ? page.regions.length - 1 : prev - 1;
            speakRegion(page.regions[next].id);
            return next;
          });
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (selectedRegionIndex >= 0) {
          handleFill(page.regions[selectedRegionIndex].id);
          toast.success(`Filled ${page.regions[selectedRegionIndex].name}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, selectedRegionIndex, handleFill, handleUndo, handleRedo]);

  const svgRef = useRef<SVGSVGElement>(null);
  const brushCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleExport = async () => {
    if (!svgRef.current) return;
    toast.promise(
      exportArtwork(pageId, svgRef.current, brushCanvasRef.current),
      {
        loading: 'Preparing your masterpiece...',
        success: 'Artwork exported successfully!',
        error: 'Failed to export artwork'
      }
    );
  };

  const isADHD = activeProfile === 'adhd';
  const isBlind = activeProfile === 'blind';

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative bg-[#07080D]">
      {/* Studio Toolbar */}
      <aside className="w-full md:w-[72px] border-b md:border-b-0 md:border-r border-border/30 bg-card/60 backdrop-blur-2xl p-3 flex md:flex-col gap-3 items-center shrink-0 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          aria-label="Back to Gallery"
          className="rounded-xl hover:bg-muted/60 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="hidden md:block w-8 h-px bg-border/40" />

        <div className="flex-1 md:flex-none flex md:flex-col gap-2">
          <Button
            variant={mode === 'fill' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setMode('fill')}
            aria-label="Fill Mode"
            title="Fill Mode"
            className={cn(
              "rounded-xl transition-all",
              mode === 'fill' && "bg-gradient-to-br from-[#45E7FF] to-[#00BBF9] text-[#07080D] shadow-lg shadow-[#45E7FF]/20 hover:opacity-90"
            )}
          >
            <PaintBucket className="w-5 h-5" />
          </Button>
          {!isADHD && (
            <Button
              variant={mode === 'brush' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setMode('brush')}
              aria-label="Brush Mode"
              title="Brush Mode"
              className={cn(
                "rounded-xl transition-all",
                mode === 'brush' && "bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white shadow-lg shadow-[#8B5CF6]/20 hover:opacity-90"
              )}
            >
              <Brush className="w-5 h-5" />
            </Button>
          )}
        </div>

        <div className="hidden md:block w-8 h-px bg-border/40" />

        <div className="flex md:flex-col gap-2">
          {!isADHD && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUndo}
              disabled={!canUndo}
              aria-label="Undo"
              title="Undo"
              className="rounded-xl hover:bg-muted/60 disabled:opacity-30"
            >
              <Undo className="w-5 h-5" />
            </Button>
          )}
          {!isADHD && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRedo}
              disabled={!canRedo}
              aria-label="Redo"
              title="Redo"
              className="rounded-xl hover:bg-muted/60 disabled:opacity-30"
            >
              <Redo className="w-5 h-5" />
            </Button>
          )}
        </div>
      </aside>

      {/* Main Studio Area */}
      <div className="flex-1 relative flex flex-col min-w-0">
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#0A0C14] via-[#07080D] to-[#0D0F1A]">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
          <SvgColoringCanvas
            ref={svgRef}
            pageId={pageId}
            fills={fills}
            onFill={handleFill}
            viewBox={page.svgViewBox}
            selectedRegionId={selectedRegionIndex >= 0 ? page.regions[selectedRegionIndex].id : undefined}
            regions={page.regions}
          />
          {mode === 'brush' && (
            <BrushCanvas
              ref={brushCanvasRef}
              active={true}
              color={selectedColor}
              size={brushSize}
              opacity={brushOpacity}
              onUpdate={handleBrushUpdate}
              initialData={brushData}
            />
          )}
        </div>

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenAccess}
            aria-label="Settings"
            className="glass-panel-strong rounded-xl border-border/40 hover:border-[#45E7FF]/30 hover:bg-[#45E7FF]/5 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Sidebar - Right */}
      <aside className={cn(
        "w-full md:w-80 border-t md:border-t-0 md:border-l border-border/30 bg-card/60 backdrop-blur-2xl flex flex-col shrink-0 z-20",
        isADHD && "md:w-64"
      )}>
        {/* Header */}
        <div className="p-5 border-b border-border/30 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg tracking-tight">{page.title}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.success('Artwork saved!')}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Save className="w-3.5 h-3.5" />
              Saved
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{page.description}</p>
          <span className="inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary/80 text-secondary-foreground">
            {page.difficulty}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          {/* Blind Guide Region List */}
          {isBlind && (
            <section className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5" />
                Region Guide
              </h4>
              <div className="grid gap-2">
                {page.regions.map(r => (
                  <Button
                    key={r.id}
                    variant="outline"
                    className="justify-between rounded-xl border-border/40 hover:border-[#45E7FF]/40 hover:bg-[#45E7FF]/5 transition-colors"
                    onClick={() => {
                      handleFill(r.id);
                      speakRegion(r.id);
                    }}
                  >
                    <span>{r.name}</span>
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                ))}
              </div>
            </section>
          )}

          {/* Palette */}
          <section>
            <PalettePicker
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
            />
          </section>

          {/* Brush Settings */}
          {mode === 'brush' && (
            <section className="space-y-4 pt-4 border-t border-border/30">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brush Settings</h4>
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Size</span>
                    <span className="font-mono">{brushSize}px</span>
                  </div>
                  <input
                    type="range" min="1" max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full accent-[#45E7FF]"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Opacity</span>
                    <span className="font-mono">{Math.round(brushOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0.1" max="1" step="0.1"
                    value={brushOpacity}
                    onChange={(e) => setBrushOpacity(parseFloat(e.target.value))}
                    className="w-full accent-[#45E7FF]"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Clear */}
          <section className="pt-4 border-t border-border/30">
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl border-[#FF6EC7]/20 text-[#FF6EC7] hover:text-[#FF8AD4] hover:bg-[#FF6EC7]/5 hover:border-[#FF6EC7]/30 transition-colors"
              onClick={handleClearCanvas}
            >
              <Eraser className="w-3.5 h-3.5 mr-2" />
              Clear Canvas
            </Button>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-border/30 grid grid-cols-2 gap-3">
          <Button
            className="w-full rounded-xl bg-gradient-to-r from-[#45E7FF] to-[#8B5CF6] text-[#07080D] font-semibold hover:opacity-90 transition-opacity"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-xl border-border/40 hover:border-[#45E7FF]/30 hover:bg-[#45E7FF]/5 transition-colors"
          >
            <Maximize2 className="w-4 h-4 mr-2" /> Focus
          </Button>
        </div>
      </aside>
    </div>
  );
};
