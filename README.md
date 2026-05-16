# PRISMAFLOW Studio v1.0

PRISMAFLOW Studio is a premium accessible colouring PWA built for all ages and all abilities. **Status: All 16 core features confirmed operational; `pnpm run verify` PASS.**

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

## Recent Changes (v7)
- **Gallery → Studio Wiring**: Cards now open the correct Studio canvas (Prism Fox, Calm Mandala, Space Whale) via `navigateToStudio(pageId)`.
- **Studio → Gallery Back Button**: Returns to Home Gallery without crashing or losing the App Shell.
- **React Rules of Hooks Fix**: Moved `STARTER_PAGES.find()` lookup after all `useState`/`useEffect` hooks in `Studio.tsx` to prevent conditional hook violations.
- **Gallery Keyboard Accessibility**: Added `role="button"`, `tabIndex={0}`, `aria-label`, and `Enter`/`Space` key handlers to gallery card images.
- **No-Artwork Fallback**: Displays a "No artwork selected" screen with a Back button if Studio is reached without a valid `pageId`.

## Tech Stack
- React 18 + TypeScript
- Vite + PWA Plugin (Workbox)
- Tailwind CSS + shadcn/ui
- Lucide React icons

## Current State
- **Build**: ✅ Passing (`tsc --noEmit` + `vite build`)
- **Verify**: ✅ Passing (`typecheck` → `build` → `e2e` → `a11y`)
- **Bundle**: ~76.4 kB gzipped JS + 12.5 kB CSS
- **Precache**: 24 assets (374.86 KiB total)
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
