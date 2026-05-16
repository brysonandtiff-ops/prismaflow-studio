import React from 'react';
import { PALETTES } from '@/data/palettes';
import { cn } from '@/lib/utils';

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
  return (
    <div className={cn("space-y-5", className)}>
      {PALETTES.map((palette) => (
        <div key={palette.name} className="space-y-2.5">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {palette.name}
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {palette.colors.map((color) => (
              <button
                key={color}
                onClick={() => onSelectColor(color)}
                className={cn(
                  "aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-115 hover:z-10",
                  selectedColor === color
                    ? "border-[#45E7FF] scale-110 shadow-[0_0_12px_-2px_rgba(69,231,255,0.4)]"
                    : "border-transparent hover:border-white/20"
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="space-y-2.5 pt-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Custom Color
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
          />
        </div>
      </div>
    </div>
  );
};
