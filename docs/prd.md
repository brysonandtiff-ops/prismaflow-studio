# Requirements Document

## 1. Application Overview

**Application Name**: PRISMAFLOW Studio v1.0

**Tagline**: Colour without barriers.

**Description**: A premium, public-ready, installable PWA colouring studio that enables users to colour SVG artworks with tap-to-fill regions and brush overlay. The application works offline and provides comprehensive accessibility features for users with diverse needs including ADHD, Autism, Dyslexia, Low Vision, Motor difficulties, and Blindness.

## 2. Users and Usage Scenarios

**Target Users**:
- Digital art enthusiasts seeking a creative colouring experience
- Users with accessibility needs requiring inclusive design
- Mobile and desktop users wanting offline creative tools

**Core Usage Scenarios**:
- Select and colour built-in SVG artworks using tap-to-fill or brush tools
- Customize colour palettes with presets or custom colors
- Save and resume colouring projects locally
- Export completed artworks as PNG images
- Adjust accessibility settings to match individual needs

## 3. Page Structure and Functionality

```
PRISMAFLOW Studio
├── Home Gallery Page
├── Studio Canvas Page
└── Accessibility Settings Panel (overlay)
```

### 3.1 Home Gallery Page

**Purpose**: Display available colouring pages and allow users to select one to start colouring.

**Functionality**:
- Display 3 built-in SVG colouring pages:
  - Prism Fox
  - Calm Mandala
  - Space Whale
- Each page shows thumbnail preview and title
- User taps/clicks a page to open it in Studio Canvas
- Access Accessibility Settings via settings icon

### 3.2 Studio Canvas Page

**Purpose**: Provide the main colouring workspace with tools and controls.

**Functionality**:

**Canvas Area**:
- Display selected SVG artwork with fillable regions
- Overlay HTML canvas for brush drawing
- Tap/click SVG region to fill with selected color
- Use brush tool to draw freehand strokes on overlay canvas

**Palette Picker**:
- Display preset colour palettes
- Allow users to create and select custom colors
- Show currently selected color

**Tool Controls**:
- Switch between Fill mode (tap regions) and Brush mode (freehand drawing)
- Undo button: revert last fill or brush stroke
- Redo button: restore undone action
- Clear button: reset all fills and brush strokes

**Project Management**:
- Save button: store current project state to LocalStorage
- Load button: retrieve saved project from LocalStorage
- Export button: download artwork as PNG file

**Navigation**:
- Back button: return to Home Gallery
- Settings icon: open Accessibility Settings Panel

### 3.3 Accessibility Settings Panel

**Purpose**: Allow users to activate accessibility profiles that adjust UI and interaction patterns.

**Functionality**:
- Display 6 accessibility profile options:
  1. **ADHD Focus Flow**: Show one selected region panel, reduce visible controls
  2. **Autism Calm Mode**: Reduce animation, apply softer contrast
  3. **Dyslexia Assist**: Increase spacing, use readable labels
  4. **Low Vision Mode**: Enlarge UI elements, apply high contrast, thicken outlines
  5. **Motor Assist**: Enlarge buttons, remove drag-only interactions
  6. **Blind Guide Mode**: Provide region list, enable keyboard navigation, activate TTS descriptions using Browser speechSynthesis API
- User selects one or more profiles to activate
- Apply selected profile settings immediately
- Close panel to return to previous page

## 4. Business Rules and Logic

### 4.1 Colouring Workflow
- User must select a colour before filling regions or using brush
- Each SVG region can be filled with one color at a time
- Brush strokes are drawn on overlay canvas independent of region fills
- Undo/redo stack tracks both region fills and brush strokes in chronological order

### 4.2 Project Persistence
- Save operation stores:
  - Selected artwork identifier
  - All region fill states (region ID + color)
  - All brush stroke data (coordinates, color, width)
  - Current palette selection
- Load operation restores saved state to canvas
- Only one project can be saved per artwork (overwrite on save)

### 4.3 Export Logic
- Export captures current canvas state (SVG regions + brush overlay) as PNG
- PNG filename format: `prismaflow-[artwork-name]-[timestamp].png`

### 4.4 Accessibility Profile Application
- Profiles apply UI adjustments without altering core functionality
- Multiple profiles can be active simultaneously
- Profile settings persist across sessions via LocalStorage
- Blind Guide Mode uses Browser speechSynthesis to announce region names and colors

### 4.5 PWA Offline Capability
- All 3 built-in SVG artworks are bundled with application
- Application functions fully offline after initial installation
- Save/load operations use LocalStorage (no network required)

## 5. Exceptions and Edge Cases

| Scenario | Handling |
|----------|----------|
| User attempts to fill region without selecting color | Prompt user to select a color first |
| User attempts to undo with empty history | Disable undo button, no action |
| User attempts to redo with no undone actions | Disable redo button, no action |
| User attempts to load project with no saved data | Display message: No saved project found |
| LocalStorage is full | Display error message, suggest clearing old data |
| Browser does not support speechSynthesis | Disable Blind Guide Mode TTS, show warning |
| Export fails due to browser restrictions | Display error message with troubleshooting guidance |
| User switches artwork while unsaved changes exist | Prompt user to save or discard changes |

## 6. Acceptance Criteria

1. User opens PRISMAFLOW Studio and sees Home Gallery with 3 colouring pages (Prism Fox, Calm Mandala, Space Whale)
2. User selects Calm Mandala and enters Studio Canvas Page
3. User selects a color from palette picker and taps a region to fill it
4. User switches to Brush mode and draws freehand strokes on canvas
5. User taps Undo to revert last action, then taps Redo to restore it
6. User taps Save to store project to LocalStorage
7. User taps Export and downloads artwork as PNG file
8. User opens Accessibility Settings, activates Low Vision Mode, and sees enlarged UI with high contrast

## 7. Out of Scope for v1.0

- User login and authentication system
- Backend server or cloud storage
- AI-powered features (auto-colouring, suggestions)
- Social sharing or community features
- Custom SVG upload by users
- Multi-layer drawing or advanced editing tools
- Animation or video export
- Collaborative colouring sessions
- In-app purchases or premium content
- Analytics or usage tracking
- Multi-language localization beyond English
- Advanced brush settings (opacity, texture, blending modes)
- Vector editing tools (move, resize, rotate regions)
- Colour history or favourites beyond current palette