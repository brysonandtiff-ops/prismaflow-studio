# PRISMAFLOW Studio v1.0

PRISMAFLOW Studio is a premium accessible colouring PWA built for all ages and all abilities. **Status: All 16 core features confirmed operational.**

## Confirmed Built Features
| # | Feature | Status |
|---|---------|--------|
| 1 | **Installable PWA** | Works offline with Service Worker & Manifest |
| 2 | **SVG Colouring Engine** | Tap-to-fill regions with metadata |
| 3 | **Brush Overlay** | Freehand drawing above the artwork |
| 4 | **Undo / Redo** | Safe, non-destructive editing (stale state fixed) |
| 5 | **Project Persistence** | Auto-saved to LocalStorage |
| 6 | **Export to PNG** | High-resolution artwork download |
| 7 | **Clear Canvas** | Clears fills + brush strokes with confirmation |
| 8 | **Keyboard Navigation** | Arrow keys to navigate regions, Enter to fill |
| 9 | **Screen Reader Support** | ARIA roles & labels on all SVG regions |
| 10 | **ADHD Focus Flow** | Distraction-reduced toolbar |
| 11 | **Autism Calm Mode** | Reduced motion via CSS overrides |
| 12 | **Dyslexia Assist** | Enhanced spacing & readability |
| 13 | **Low Vision Mode** | High contrast, enlarged UI, thick outlines |
| 14 | **Motor Assist** | Large button targets (64×64 px) |
| 15 | **Blind Guide Mode** | TTS descriptions, full keyboard control |
| 16 | **Responsive Layout** | Desktop & mobile sidebar/toolbar |

## Tech Stack
- React 18 + TypeScript
- Vite + PWA Plugin (Workbox)
- Tailwind CSS + shadcn/ui
- Lucide React icons

## Current State
- **Build**: Passing (TypeScript + Vite production build verified)
- **Bundle**: ~76 kB gzipped JS + 12 kB CSS
- **Precache**: 24 assets (373 KiB total)
- **Last Verified**: 2026-05-16

## Accessibility Profiles
- **ADHD Focus Flow**: Minimizes distractions.
- **Autism Calm Mode**: Reduces motion and uses soothing colors.
- **Dyslexia Assist**: Enhances readability and spacing.
- **Low Vision Mode**: High contrast and enlarged UI.
- **Motor Assist**: Larger targets and simplified interactions.
- **Blind Guide Mode**: Full keyboard navigation and spoken descriptions.

## Privacy
All artwork is stored locally on your device. No account required. No data tracking.

## Development
```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run verify
```
