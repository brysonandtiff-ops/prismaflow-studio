import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { GlassPanel } from '@/components/GlassPanel';
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
  Maximize2
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
  const [selectedColor, setSelectedColor] = useState('#8E94F2');
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
          <Button onClick={onBack}>Back to Gallery</Button>
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
    // Load initial fills if any
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
    
    // Auto save
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!page) return;

      // Undo/Redo
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

      // Region Navigation
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setSelectedRegionIndex(prev => {
          const next = (prev + 1) % page.regions.length;
          speakRegion(page.regions[next].id);
          return next;
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setSelectedRegionIndex(prev => {
          const next = prev <= 0 ? page.regions.length - 1 : prev - 1;
          speakRegion(page.regions[next].id);
          return next;
        });
      } else if (e.key === 'Enter') {
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
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
      {/* Studio Toolbar - Left on Desktop, Bottom on Mobile */}
      <aside className="w-full md:w-20 border-b md:border-b-0 md:border-r border-border/40 bg-background/60 backdrop-blur-md p-4 flex md:flex-col gap-4 items-center shrink-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back to Gallery">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="flex-1 md:flex-none flex md:flex-col gap-4">
          <Button 
            variant={mode === 'fill' ? 'default' : 'ghost'} 
            size="icon" 
            onClick={() => setMode('fill')}
            aria-label="Fill Mode"
            title="Fill Mode"
          >
            <PaintBucket className="w-6 h-6" />
          </Button>
          {!isADHD && (
            <Button 
              variant={mode === 'brush' ? 'default' : 'ghost'} 
              size="icon" 
              onClick={() => setMode('brush')}
              aria-label="Brush Mode"
              title="Brush Mode"
            >
              <Brush className="w-6 h-6" />
            </Button>
          )}
        </div>
        <div className="flex md:flex-col gap-4">
          {!isADHD && (
            <Button variant="ghost" size="icon" onClick={handleUndo} disabled={!canUndo} aria-label="Undo" title="Undo">
              <Undo className="w-6 h-6" />
            </Button>
          )}
          {!isADHD && (
            <Button variant="ghost" size="icon" onClick={handleRedo} disabled={!canRedo} aria-label="Redo" title="Redo">
              <Redo className="w-6 h-6" />
            </Button>
          )}
        </div>
      </aside>

      {/* Main Studio Area */}
      <div className="flex-1 relative flex flex-col min-w-0">
        <div className="absolute inset-0 overflow-hidden bg-muted/10">
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
        
        {/* Floating Controls for Mobile */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="outline" size="icon" className="glass-panel" onClick={onOpenAccess} aria-label="Settings">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Sidebar - Right */}
      <aside className={cn(
        "w-full md:w-80 border-t md:border-t-0 md:border-l border-border/40 bg-background/60 backdrop-blur-md flex flex-col shrink-0 z-20",
        isADHD && "md:w-64"
      )}>
        <div className="p-4 border-b border-border/40 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{page.title}</h3>
            <Button variant="ghost" size="sm" onClick={() => toast.success('Artwork saved!')}>
              Saved
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-pretty">{page.description}</p>
          <span className="inline-block text-xs font-medium uppercase tracking-wider px-2 py-1 rounded bg-secondary text-secondary-foreground">
            {page.difficulty}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {isBlind && (
            <section className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Region Guide</h4>
              <div className="grid gap-2">
                {page.regions.map(r => (
                  <Button 
                    key={r.id} 
                    variant="outline" 
                    className="justify-between"
                    onClick={() => {
                      handleFill(r.id);
                      speakRegion(r.id);
                    }}
                  >
                    <span>{r.name}</span>
                    <Volume2 className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </section>
          )}

          <section>
            <PalettePicker 
              selectedColor={selectedColor} 
              onSelectColor={setSelectedColor} 
            />
          </section>

          {mode === 'brush' && (
            <section className="space-y-4 pt-4 border-t border-border/40">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brush Settings</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Size</span>
                    <span>{brushSize}px</span>
                  </div>
                  <input 
                    type="range" min="1" max="50" 
                    value={brushSize} 
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Opacity</span>
                    <span>{Math.round(brushOpacity * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="1" step="0.1"
                    value={brushOpacity} 
                    onChange={(e) => setBrushOpacity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </section>
          )}

          <section className="pt-4 border-t border-border/40">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100" 
              onClick={handleClearCanvas}
            >
              Clear Canvas
            </Button>
          </section>
        </div>

        <div className="p-4 border-t border-border/40 grid grid-cols-2 gap-4">
          <Button className="w-full" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button variant="outline" className="w-full">
            <Maximize2 className="w-4 h-4 mr-2" /> Focus
          </Button>
        </div>
      </aside>
    </div>
  );
};
