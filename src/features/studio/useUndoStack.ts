import { useState, useCallback } from 'react';

export function useUndoStack<T>(initialState: T) {
  const [state, setState] = useState({
    history: [initialState],
    currentIndex: 0
  });

  const pushState = useCallback((newState: T) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.currentIndex + 1);
      return {
        history: [...newHistory, newState],
        currentIndex: prev.currentIndex + 1
      };
    });
  }, []);

  const undo = useCallback(() => {
    let targetState: T | null = null;
    setState(prev => {
      if (prev.currentIndex > 0) {
        const nextIndex = prev.currentIndex - 1;
        targetState = prev.history[nextIndex];
        return { ...prev, currentIndex: nextIndex };
      }
      return prev;
    });
    return targetState;
  }, []);

  const redo = useCallback(() => {
    let targetState: T | null = null;
    setState(prev => {
      if (prev.currentIndex < prev.history.length - 1) {
        const nextIndex = prev.currentIndex + 1;
        targetState = prev.history[nextIndex];
        return { ...prev, currentIndex: nextIndex };
      }
      return prev;
    });
    return targetState;
  }, []);

  return {
    currentState: state.history[state.currentIndex],
    pushState,
    undo,
    redo,
    canUndo: state.currentIndex > 0,
    canRedo: state.currentIndex < state.history.length - 1,
    reset: useCallback((initial: T) => {
      setState({
        history: [initial],
        currentIndex: 0
      });
    }, [])
  };
}
