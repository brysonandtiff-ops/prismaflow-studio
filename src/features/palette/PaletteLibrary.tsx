import React, { useState } from 'react';
import { PALETTES, Palette } from '@/data/palettes';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Palette as PaletteIcon, Check, X } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  calm: 'Calm',
  bold: 'Bold',
  natural: 'Natural',
  accessibility: 'Accessibility',
  pro: 'Pro',
};

const CATEGORY_ORDER = ['calm', 'bold', 'natural', 'accessibility', 'pro'];

interface PaletteLibraryProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  onClose: () => void;
}

export const PaletteLibrary: React.FC<PaletteLibraryProps> = ({
  selectedColor,
  onSelectColor,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('calm');

  const grouped = CATEGORY_ORDER.map(cat => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    palettes: PALETTES.filter(p => p.category === cat),
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <GlassPanel strong className="w-full max-w-3xl max-h-[90dvh] flex flex-col shadow-2xl border border-border/40">
        {/* Header */}
        <div className="p-5 border-b border-border/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <PaletteIcon className="w-5 h-5 text-[#45E7FF]" />
            <h2 className="text-xl font-bold tracking-tight">Palette Library</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="rounded-xl hover:bg-muted/60">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="px-5 pt-4 flex gap-2 overflow-x-auto shrink-0">
          {grouped.map(({ category, label }) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === category
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'bg-muted/20 text-muted-foreground border border-transparent hover:bg-muted/40'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Palette Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped
              .find(g => g.category === activeCategory)
              ?.palettes.map(palette => (
                <div
                  key={palette.id}
                  className="p-4 rounded-xl bg-muted/20 border border-border/20 hover:border-border/40 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{palette.name}</h3>
                      <p className="text-xs text-muted-foreground text-pretty">{palette.description}</p>
                    </div>
                  </div>
                  {palette.accessibilityNotes && (
                    <p className="text-[11px] text-[#6EF3B5] leading-relaxed">{palette.accessibilityNotes}</p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {palette.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => onSelectColor(color)}
                        className={cn(
                          "w-9 h-9 rounded-lg border-2 transition-all hover:scale-110",
                          selectedColor === color
                            ? "border-[#45E7FF] shadow-[0_0_10px_-2px_rgba(69,231,255,0.4)]"
                            : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color} from ${palette.name}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};