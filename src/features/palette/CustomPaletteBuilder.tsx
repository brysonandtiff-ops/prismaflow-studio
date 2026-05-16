import React, { useState } from 'react';
import { CustomPalette, useCustomPalettes } from './useCustomPalettes';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, Trash2, X, Palette, Check } from 'lucide-react';

interface CustomPaletteBuilderProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  onClose: () => void;
}

export const CustomPaletteBuilder: React.FC<CustomPaletteBuilderProps> = ({
  selectedColor,
  onSelectColor,
  onClose,
}) => {
  const { customPalettes, addPalette, updatePalette, deletePalette } = useCustomPalettes();
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColors, setNewColors] = useState<string[]>(['#45E7FF', '#8B5CF6', '#FF6EC7']);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddColor = () => {
    setNewColors(prev => [...prev, '#FFFFFF']);
  };

  const handleUpdateColor = (index: number, value: string) => {
    setNewColors(prev => prev.map((c, i) => (i === index ? value : c)));
  };

  const handleRemoveColor = (index: number) => {
    setNewColors(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const name = newName.trim() || 'My Palette';
    addPalette(name, newColors);
    setIsCreating(false);
    setNewName('');
    setNewColors(['#45E7FF', '#8B5CF6', '#FF6EC7']);
  };

  const handleRename = (id: string) => {
    const palette = customPalettes.find(p => p.id === id);
    if (!palette) return;
    setEditingId(id);
    setEditName(palette.name);
  };

  const handleSaveRename = () => {
    if (editingId && editName.trim()) {
      updatePalette(editingId, { name: editName.trim() });
    }
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <GlassPanel strong className="w-full max-w-lg max-h-[90dvh] flex flex-col shadow-2xl border border-border/40">
        {/* Header */}
        <div className="p-5 border-b border-border/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#8B5CF6]" />
            <h2 className="text-xl font-bold tracking-tight">Custom Palettes</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="rounded-xl hover:bg-muted/60">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Create New */}
          {!isCreating ? (
            <Button
              onClick={() => setIsCreating(true)}
              className="w-full rounded-xl border border-dashed border-border/40 bg-muted/10 hover:bg-muted/30 text-muted-foreground hover:text-foreground h-14"
              variant="ghost"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Palette
            </Button>
          ) : (
            <div className="p-4 rounded-xl bg-muted/20 border border-border/20 space-y-4">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Palette name..."
                className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="grid grid-cols-6 gap-2">
                {newColors.map((color, i) => (
                  <div key={i} className="relative">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleUpdateColor(i, e.target.value)}
                      className="w-full aspect-square rounded-lg cursor-pointer border-none"
                    />
                    {newColors.length > 1 && (
                      <button
                        onClick={() => handleRemoveColor(i)}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF6EC7] text-[#07080D] flex items-center justify-center text-[10px]"
                        aria-label={`Remove colour ${i + 1}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                {newColors.length < 12 && (
                  <button
                    onClick={handleAddColor}
                    className="aspect-square rounded-lg border border-dashed border-border/40 flex items-center justify-center text-muted-foreground hover:bg-muted/30 transition-colors"
                    aria-label="Add colour"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1 rounded-xl bg-gradient-to-r from-[#45E7FF] to-[#8B5CF6] text-[#07080D] font-semibold">
                  <Check className="w-4 h-4 mr-2" /> Save Palette
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)} className="rounded-xl border-border/40">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Saved Palettes */}
          {customPalettes.length === 0 && !isCreating && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No custom palettes yet. Create one to get started.
            </p>
          )}

          {customPalettes.map((palette) => (
            <div
              key={palette.id}
              className="p-4 rounded-xl bg-muted/20 border border-border/20 hover:border-border/40 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                {editingId === palette.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={handleSaveRename}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                      className="flex-1 px-2 py-1 rounded bg-background/50 border border-border/40 text-sm"
                      autoFocus
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => handleRename(palette.id)}
                    className="font-semibold text-sm hover:text-primary transition-colors"
                  >
                    {palette.name}
                  </button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePalette(palette.id)}
                  aria-label={`Delete ${palette.name}`}
                  className="h-7 w-7 rounded-lg hover:bg-[#FF6EC7]/10 hover:text-[#FF6EC7]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
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
      </GlassPanel>
    </div>
  );
};