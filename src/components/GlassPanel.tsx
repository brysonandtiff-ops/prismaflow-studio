import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  strong?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className,
  as: Component = 'div',
  strong = false
}) => {
  return (
    <Component className={cn(
      strong ? "glass-panel-strong" : "glass-panel",
      "rounded-2xl overflow-hidden shadow-[0_4px_24px_-4px_hsl(228_29%_4%/0.5)]",
      className
    )}>
      {children}
    </Component>
  );
};
