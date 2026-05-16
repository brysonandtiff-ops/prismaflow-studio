import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  className,
  as: Component = 'div'
}) => {
  return (
    <Component className={cn("glass-panel rounded-xl overflow-hidden shadow-lg", className)}>
      {children}
    </Component>
  );
};
