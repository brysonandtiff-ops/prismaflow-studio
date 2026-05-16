import React from 'react';
import { PALETTES } from '@/data/palettes';
import { Button } from '@/components/ui/button';
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
    <div className={cn("space-y-6", className)}>
      {PALETTES.map((palette) => (
        <div key={palette.name} className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {palette.name}
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {palette.colors.map((color) => (
              <button
                key={color}
                onClick={() => onSelectColor(color)}
                className={cn(
                  "aspect-square rounded-md border-2 transition-all hover:scale-110",
                  selectedColor === color ? "border-primary scale-110 shadow-md" : "border-transparent"
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      ))}
      
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Custom Color
        </h4>
        <input 
          type="color" 
          value={selectedColor}
          onChange={(e) => onSelectColor(e.target.value)}
          className="w-full h-10 rounded-md cursor-pointer border-none bg-muted/30"
        />
      </div>
    </div>
  );
};
