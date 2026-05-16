import React from 'react';
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
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    if (target.id) {
      onFill(target.id);
    }
  };

  /* ── Prism Fox — 19 geometric crystal facets ── */
  const prismFoxPaths = (
    <>
      {/* Ears */}
      <path id="ear-left" d="M70,65 L35,15 L95,50 Z" />
      <path id="ear-right" d="M130,65 L165,15 L105,50 Z" />
      <path id="inner-ear-left" d="M75,58 L55,30 L88,50 Z" />
      <path id="inner-ear-right" d="M125,58 L145,30 L112,50 Z" />
      {/* Face */}
      <path id="forehead" d="M70,65 L100,48 L130,65 L100,78 Z" />
      <path id="left-cheek" d="M70,65 L100,78 L48,108 L52,82 Z" />
      <path id="right-cheek" d="M130,65 L100,78 L152,108 L148,82 Z" />
      <path id="left-eye" d="M72,78 L82,81 L78,88 L68,85 Z" />
      <path id="right-eye" d="M128,78 L118,81 L122,88 L132,85 Z" />
      <path id="muzzle" d="M78,92 L122,92 L128,115 L72,115 Z" />
      <path id="nose" d="M92,115 L108,115 L100,126 Z" />
      {/* Body */}
      <path id="neck-fur" d="M50,118 L100,140 L150,118 L128,108 L72,108 Z" />
      <path id="chest-fur" d="M60,140 L100,168 L140,140 L100,132 Z" />
      {/* Tail */}
      <path id="tail-base" d="M128,115 L162,100 L175,120 L152,135 Z" />
      <path id="tail-middle" d="M162,100 L188,78 L195,105 L175,120 Z" />
      <path id="tail-tip" d="M188,78 L198,52 L185,68 Z" />
      {/* Crystals */}
      <path id="crystal-1" d="M100,168 L112,185 L88,185 Z" />
      <path id="crystal-2" d="M30,18 L42,35 L22,35 Z" />
      <path id="crystal-3" d="M182,125 L195,140 L172,142 Z" />
    </>
  );

  /* ── Calm Mandala — 29 symmetric regions ── */
  const calmMandalaPaths = (
    <>
      {/* Center */}
      <circle id="center-circle" cx="100" cy="100" r="16" />
      {/* Inner petals (8, rotated) */}
      <path id="inner-petal-1" d="M100,84 L116,58 L130,84 L116,96 Z" />
      <path id="inner-petal-2" d="M116,96 L141,84 L130,58 L116,72 Z" transform="rotate(45,100,100)" />
      <path id="inner-petal-3" d="M130,100 L155,84 L141,58 L116,72 Z" transform="rotate(90,100,100)" />
      <path id="inner-petal-4" d="M141,116 L155,84 L130,58 L116,72 Z" transform="rotate(135,100,100)" />
      <path id="inner-petal-5" d="M130,116 L155,100 L141,72 L116,84 Z" transform="rotate(180,100,100)" />
      <path id="inner-petal-6" d="M116,116 L141,116 L130,142 L116,128 Z" transform="rotate(225,100,100)" />
      <path id="inner-petal-7" d="M100,130 L116,116 L130,142 L100,142 Z" transform="rotate(270,100,100)" />
      <path id="inner-petal-8" d="M84,116 L100,130 L116,142 L84,142 Z" transform="rotate(315,100,100)" />
      {/* Middle petals (8, rotated) */}
      <path id="middle-petal-1" d="M100,62 L125,35 L145,62 L125,80 Z" />
      <path id="middle-petal-2" d="M125,80 L155,62 L145,35 L125,55 Z" transform="rotate(45,100,100)" />
      <path id="middle-petal-3" d="M145,100 L175,80 L155,50 L125,70 Z" transform="rotate(90,100,100)" />
      <path id="middle-petal-4" d="M155,120 L175,80 L145,50 L125,75 Z" transform="rotate(135,100,100)" />
      <path id="middle-petal-5" d="M145,138 L165,120 L145,90 L125,110 Z" transform="rotate(180,100,100)" />
      <path id="middle-petal-6" d="M125,145 L145,145 L125,165 L110,145 Z" transform="rotate(225,100,100)" />
      <path id="middle-petal-7" d="M100,155 L125,145 L145,165 L100,165 Z" transform="rotate(270,100,100)" />
      <path id="middle-petal-8" d="M75,145 L100,155 L125,165 L75,165 Z" transform="rotate(315,100,100)" />
      {/* Outer arcs (8 curved segments) */}
      <path id="outer-arc-1" d="M100,18 A82,82 0 0,1 144,40 L125,55 A60,60 0 0,0 100,38 Z" />
      <path id="outer-arc-2" d="M144,40 A82,82 0 0,1 178,78 L158,85 A60,60 0 0,0 125,55 Z" transform="rotate(45,100,100)" />
      <path id="outer-arc-3" d="M178,78 A82,82 0 0,1 182,122 L162,118 A60,60 0 0,0 158,85 Z" transform="rotate(90,100,100)" />
      <path id="outer-arc-4" d="M182,122 A82,82 0 0,1 160,166 L145,148 A60,60 0 0,0 162,118 Z" transform="rotate(135,100,100)" />
      <path id="outer-arc-5" d="M160,166 A82,82 0 0,1 122,182 L118,162 A60,60 0 0,0 145,148 Z" transform="rotate(180,100,100)" />
      <path id="outer-arc-6" d="M122,182 A82,82 0 0,1 78,182 L82,162 A60,60 0 0,0 118,162 Z" transform="rotate(225,100,100)" />
      <path id="outer-arc-7" d="M78,182 A82,82 0 0,1 40,166 L55,148 A60,60 0 0,0 82,162 Z" transform="rotate(270,100,100)" />
      <path id="outer-arc-8" d="M40,166 A82,82 0 0,1 18,122 L38,118 A60,60 0 0,0 55,148 Z" transform="rotate(315,100,100)" />
      {/* Corner accents */}
      <path id="corner-accent-1" d="M90,8 L100,2 L110,8 L100,14 Z" />
      <path id="corner-accent-2" d="M192,90 L198,100 L192,110 L186,100 Z" />
      <path id="corner-accent-3" d="M90,192 L100,198 L110,192 L100,186 Z" />
      <path id="corner-accent-4" d="M8,90 L2,100 L8,110 L14,100 Z" />
    </>
  );

  /* ── Space Whale — 18 organic + cosmic regions ── */
  const spaceWhalePaths = (
    <>
      {/* Whale body */}
      <path id="whale-body" d="M25,90 C25,48 85,28 142,55 C185,74 190,108 165,128 C135,152 75,148 45,128 C25,118 25,98 25,90" />
      {/* Belly */}
      <path id="whale-belly" d="M40,115 C65,134 125,138 158,118 C140,128 90,132 58,122 C48,118 42,116 40,115" />
      {/* Fins */}
      <path id="dorsal-fin" d="M100,45 L122,12 L138,50 Z" />
      <path id="left-pectoral" d="M78,82 L48,112 L70,122 Z" />
      <path id="right-pectoral" d="M122,82 L152,112 L130,122 Z" />
      {/* Tail */}
      <path id="tail-left" d="M25,90 L5,64 L22,87 Z" />
      <path id="tail-right" d="M25,90 L5,116 L22,93 Z" />
      {/* Eye */}
      <circle id="whale-eye" cx="55" cy="72" r="4.5" />
      {/* Nebulae */}
      <path id="nebula-1" d="M145,22 Q168,2 188,22 Q200,46 180,56 Q158,46 145,22" />
      <path id="nebula-2" d="M155,74 Q178,58 195,76 Q205,100 185,108 Q165,94 155,74" />
      <path id="nebula-3" d="M140,144 Q162,128 182,146 Q195,170 172,178 Q152,164 140,144" />
      {/* Moon */}
      <circle id="moon" cx="35" cy="35" r="14" />
      {/* Stars */}
      <circle id="star-1" cx="175" cy="20" r="3" />
      <circle id="star-2" cx="188" cy="46" r="2" />
      <circle id="star-3" cx="170" cy="138" r="2.5" />
      <circle id="star-4" cx="192" cy="162" r="2" />
      {/* Water / cosmic glow */}
      <path id="water-glow-1" d="M40,146 Q92,166 152,146 Q120,156 92,160 Q62,156 40,146" />
      <path id="water-glow-2" d="M8,122 Q26,142 46,132 Q32,138 22,134 Q16,128 8,122" />
    </>
  );

  const renderPaths = () => {
    switch (pageId) {
      case 'prism-fox': return prismFoxPaths;
      case 'calm-mandala': return calmMandalaPaths;
      case 'space-whale': return spaceWhalePaths;
      default: return null;
    }
  };

  const paths = renderPaths();

  return (
    <div className={cn("relative w-full h-full flex items-center justify-center p-4 md:p-8", className)}>
      <svg
        ref={ref}
        viewBox={viewBox}
        className="max-w-full max-h-full drop-shadow-2xl studio-canvas"
        onClick={handleClick}
      >
        <g
          className="fill-none stroke-foreground/20 stroke-[0.5] transition-all cursor-pointer"
          style={{ vectorEffect: 'non-scaling-stroke' }}
        >
          {paths && React.Children.map(paths.props.children, (child) => {
            if (React.isValidElement(child)) {
              const regionId = (child.props as any).id;
              return React.cloneElement(child as React.ReactElement, {
                fill: fills[regionId] || '#ffffff',
                className: cn(
                  "hover:stroke-primary hover:stroke-2 transition-all outline-none focus:stroke-primary focus:stroke-2",
                  child.props.className,
                  selectedRegionId === regionId && "stroke-primary stroke-2 animate-pulse"
                ),
                tabIndex: 0,
                role: "button",
                "aria-label": `Region: ${regions.find(r => r.id === regionId)?.name || regionId}`,
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onFill(regionId);
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
