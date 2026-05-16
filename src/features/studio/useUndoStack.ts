import { useState, useCallback } from 'react';

export function useUndoStack<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pushState = useCallback((newState: T) => {
    setHistory(prev => {
      const nextHistory = prev.slice(0, currentIndex + 1);
      return [...nextHistory, newState];
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  const currentState = history[currentIndex];

  return {
    currentState,
    pushState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    reset: useCallback((state: T) => {
      setHistory([state]);
      setCurrentIndex(0);
    }, [])
  };
}
