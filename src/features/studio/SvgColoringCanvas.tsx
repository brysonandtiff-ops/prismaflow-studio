import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SvgColoringCanvasProps {
  pageId: string;
  fills: Record<string, string>;
  onFill: (regionId: string) => void;
  className?: string;
  viewBox: string;
  selectedRegionId?: string;
  regions?: { id: string; name: string }[];
}

export const SvgColoringCanvas = React.forwardRef<SVGSVGElement, SvgColoringCanvasProps>(({
  pageId,
  fills,
  onFill,
  className,
  viewBox,
  selectedRegionId,
  regions = []
}, ref) => {
  // Map pageId to actual SVG structure
  // For v1, we'll hardcode the SVG paths for the 3 starter pages
  const renderPaths = () => {
    switch (pageId) {
      case 'prism-fox':
        return (
          <>
            <path id="ear-left" d="M40,60 L60,20 L80,60 Z" />
            <path id="ear-right" d="M120,60 L140,20 L160,60 Z" />
            <path id="face-top" d="M60,60 L100,50 L140,60 L100,100 Z" />
            <path id="face-left" d="M60,60 L100,100 L60,130 L40,100 Z" />
            <path id="face-right" d="M140,60 L100,100 L140,130 L160,100 Z" />
            <path id="nose" d="M90,100 L110,100 L100,115 Z" />
            <path id="neck" d="M60,130 L100,160 L140,130 L100,135 Z" />
            <path id="tail-base" d="M140,130 L180,150 L160,180 Z" />
            <path id="tail-tip" d="M180,150 L195,165 L180,180 Z" />
          </>
        );
      case 'calm-mandala':
        return (
          <>
            <circle id="center-circle" cx="100" cy="100" r="20" />
            <path id="inner-petal-1" d="M100,80 Q115,60 130,80 Q115,100 100,80" transform="rotate(0, 100, 100)" />
            <path id="inner-petal-2" d="M100,80 Q115,60 130,80 Q115,100 100,80" transform="rotate(90, 100, 100)" />
            <path id="inner-petal-3" d="M100,80 Q115,60 130,80 Q115,100 100,80" transform="rotate(180, 100, 100)" />
            <path id="inner-petal-4" d="M100,80 Q115,60 130,80 Q115,100 100,80" transform="rotate(270, 100, 100)" />
            <path id="outer-ring-1" d="M100,20 A80,80 0 0,1 180,100 L160,100 A60,60 0 0,0 100,40 Z" />
            <path id="outer-ring-2" d="M180,100 A80,80 0 0,1 100,180 L100,160 A60,60 0 0,0 160,100 Z" />
            <path id="outer-ring-3" d="M100,180 A80,80 0 0,1 20,100 L40,100 A60,60 0 0,0 100,160 Z" />
            <path id="outer-ring-4" d="M20,100 A80,80 0 0,1 100,20 L100,40 A60,60 0 0,0 40,100 Z" />
          </>
        );
      case 'space-whale':
        return (
          <>
            <path id="whale-body" d="M20,100 C20,40 160,40 180,100 C180,140 120,160 80,160 C40,160 20,140 20,100" />
            <path id="whale-belly" d="M40,130 Q80,145 140,130" fill="none" stroke="currentColor" strokeWidth="1" />
            <path id="fin-top" d="M100,55 L120,30 L130,60 Z" />
            <path id="fin-side-left" d="M60,110 L30,130 L60,140 Z" />
            <path id="fin-side-right" d="M140,110 L170,130 L140,140 Z" />
            <path id="tail-fluke-left" d="M20,100 L5,80 L15,110 Z" />
            <path id="tail-fluke-right" d="M20,100 L5,120 L15,110 Z" />
            <path id="nebula-cloud" d="M150,40 Q170,20 190,40 Q210,60 190,80 Q170,100 150,80 Q130,60 150,40" opacity="0.1" />
            <circle id="star-1" cx="40" cy="30" r="2" />
            <circle id="star-2" cx="170" cy="50" r="1.5" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("relative w-full h-full flex items-center justify-center p-8", className)}>
      <svg
        ref={ref}
        viewBox={viewBox}
        className="max-w-full max-h-full drop-shadow-2xl studio-canvas"
        onClick={(e) => {
          const target = e.target as SVGElement;
          if (target.id) {
            onFill(target.id);
          }
        }}
      >
        <g 
          className="fill-none stroke-foreground/20 stroke-[0.5] transition-all cursor-pointer"
          style={{ vectorEffect: 'non-scaling-stroke' }}
        >
          {React.Children.map(renderPaths()?.props.children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                // @ts-ignore
                fill: fills[child.props.id] || '#ffffff',
                className: cn(
                  "hover:stroke-primary hover:stroke-2 transition-all outline-none focus:stroke-primary focus:stroke-2",
                  child.props.className,
                  selectedRegionId === child.props.id && "stroke-primary stroke-2 animate-pulse"
                ),
                tabIndex: 0,
                role: "button",
                "aria-label": `Region: ${regions.find(r => r.id === child.props.id)?.name || child.props.id}`,
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    // @ts-ignore
                    onFill(child.props.id);
                  }
                }
              });
            }
            return child;
          })}
        </g>
      </svg>
    </div>
  );
});
SvgColoringCanvas.displayName = 'SvgColoringCanvas';
