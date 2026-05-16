import React, { useState } from 'react';
import { PALETTES } from '@/data/palettes';
import { useCustomPalettes } from './useCustomPalettes';
import { PaletteLibrary } from './PaletteLibrary';
import { CustomPaletteBuilder } from './CustomPaletteBuilder';
import { cn } from '@/lib/utils';
import { Library, Paintbrush, Palette } from 'lucide-react';

interface PalettePickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  className?: string;
}

export const PalettePicker: React.FC<PalettePickerProps> = ({
  selectedColor,
  onSelectColor,
  className
}) => {
  const { customPalettes } = useCustomPalettes();
  const [showLibrary, setShowLibrary] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowLibrary(true)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-muted/20 border border-border/20 hover:border-border/40 hover:bg-muted/30 transition-all text-sm font-medium"
        >
          <Library className="w-4 h-4 text-[#45E7FF]" />
          <span>Palette Library</span>
        </button>
        <button
          onClick={() => setShowBuilder(true)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-muted/20 border border-border/20 hover:border-border/40 hover:bg-muted/30 transition-all text-sm font-medium"
        >
          <Paintbrush className="w-4 h-4 text-[#8B5CF6]" />
          <span>Custom Builder</span>
        </button>
      </div>

      {/* Favourites / Quick pick — first 3 built-in palettes */}
      {PALETTES.slice(0, 3).map((palette) => (
        <div key={palette.id} className="space-y-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {palette.name}
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {palette.colors.map((color) => (
              <button
                key={color}
                onClick={() => onSelectColor(color)}
                className={cn(
                  "aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:z-10",
                  selectedColor === color
                    ? "border-[#45E7FF] scale-110 shadow-[0_0_12px_-2px_rgba(69,231,255,0.4)]"
                    : "border-transparent hover:border-white/20"
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select colour ${color} from ${palette.name}`}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Custom palettes */}
      {customPalettes.map((cp) => (
        <div key={cp.id} className="space-y-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
            <Palette className="w-3 h-3 text-[#8B5CF6]" />
            {cp.name}
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {cp.colors.map((color) => (
              <button
                key={color}
                onClick={() => onSelectColor(color)}
                className={cn(
                  "aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:z-10",
                  selectedColor === color
                    ? "border-[#45E7FF] scale-110 shadow-[0_0_12px_-2px_rgba(69,231,255,0.4)]"
                    : "border-transparent hover:border-white/20"
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select colour ${color} from ${cp.name}`}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Custom colour picker */}
      <div className="space-y-2 pt-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Custom Colour
        </h4>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg border-2 border-border/40 shrink-0"
            style={{ backgroundColor: selectedColor }}
          />
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onSelectColor(e.target.value)}
            className="flex-1 h-10 rounded-lg cursor-pointer border border-border/40 bg-muted/20"
            aria-label="Pick custom colour"
          />
        </div>
      </div>

      {showLibrary && (
        <PaletteLibrary
          selectedColor={selectedColor}
          onSelectColor={(c) => { onSelectColor(c); setShowLibrary(false); }}
          onClose={() => setShowLibrary(false)}
        />
      )}
      {showBuilder && (
        <CustomPaletteBuilder
          selectedColor={selectedColor}
          onSelectColor={(c) => { onSelectColor(c); setShowBuilder(false); }}
          onClose={() => setShowBuilder(false)}
        />
      )}
    </div>
  );
};
