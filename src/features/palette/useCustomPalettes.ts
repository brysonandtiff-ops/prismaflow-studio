import { useState, useCallback, useEffect } from 'react';
import { Palette } from '@/data/palettes';

const STORAGE_KEY = 'prismaflow-custom-palettes';

export interface CustomPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: number;
}

export const useCustomPalettes = () => {
  const [customPalettes, setCustomPalettes] = useState<CustomPalette[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPalettes));
  }, [customPalettes]);

  const addPalette = useCallback((name: string, colors: string[]) => {
    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const newPalette: CustomPalette = { id, name, colors, createdAt: Date.now() };
    setCustomPalettes(prev => [...prev, newPalette]);
    return id;
  }, []);

  const updatePalette = useCallback((id: string, updates: Partial<Omit<CustomPalette, 'id' | 'createdAt'>>) => {
    setCustomPalettes(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deletePalette = useCallback((id: string) => {
    setCustomPalettes(prev => prev.filter(p => p.id !== id));
  }, []);

  const toPalette = useCallback((cp: CustomPalette): Palette => ({
    id: cp.id,
    name: cp.name,
    category: 'pro',
    colors: cp.colors,
    description: 'Your custom palette.',
  }), []);

  return {
    customPalettes,
    addPalette,
    updatePalette,
    deletePalette,
    toPalette,
  };
};