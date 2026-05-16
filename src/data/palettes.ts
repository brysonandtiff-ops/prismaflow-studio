export interface Palette {
  id: string;
  name: string;
  category: 'calm' | 'bold' | 'natural' | 'accessibility' | 'pro';
  colors: string[];
  description: string;
  accessibilityNotes?: string;
}

export const PALETTES: Palette[] = [
  // ── CALM ──
  {
    id: 'prism-calm',
    name: 'Prism Calm',
    category: 'calm',
    colors: ['#8E94F2', '#9FA0FF', '#BBADFF', '#DAB6FF', '#EAD1FF', '#F7E1FF'],
    description: 'Soft pastels for a gentle, dreamy experience.'
  },
  {
    id: 'soft-pastel',
    name: 'Soft Pastel',
    category: 'calm',
    colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E6BAFF'],
    description: 'Classic pastel rainbow for light, airy colouring.'
  },
  {
    id: 'ocean-mist',
    name: 'Ocean Mist',
    category: 'calm',
    colors: ['#E0F7FA', '#B2EBF2', '#80DEEA', '#4DD0E1', '#26C6DA', '#00BCD4'],
    description: 'Cool water tones that wash over the canvas.'
  },
  {
    id: 'lavender-sleep',
    name: 'Lavender Sleep',
    category: 'calm',
    colors: ['#F3E5F5', '#E1BEE7', '#CE93D8', '#BA68C8', '#AB47BC', '#9C27B0'],
    description: 'Deep purples for late-night creative sessions.'
  },
  {
    id: 'gentle-forest',
    name: 'Gentle Forest',
    category: 'calm',
    colors: ['#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50'],
    description: 'Soft greens for nature lovers.'
  },

  // ── BOLD ──
  {
    id: 'neon-bloom',
    name: 'Neon Bloom',
    category: 'bold',
    colors: ['#FF0054', '#FF5400', '#FFBD00', '#E9FF70', '#00F5D4', '#00BBF9'],
    description: 'Electric neons that pop off the dark canvas.'
  },
  {
    id: 'cyber-candy',
    name: 'Cyber Candy',
    category: 'bold',
    colors: ['#FF00FF', '#00FFFF', '#FF0099', '#9900FF', '#00FF66', '#FF6600'],
    description: 'Synthwave brights for a futuristic feel.'
  },
  {
    id: 'arcade-pop',
    name: 'Arcade Pop',
    category: 'bold',
    colors: ['#FF3333', '#FF9933', '#FFFF33', '#33FF33', '#3333FF', '#FF33FF'],
    description: 'Retro gaming palette for bold statement pieces.'
  },
  {
    id: 'solar-punch',
    name: 'Solar Punch',
    category: 'bold',
    colors: ['#FF4500', '#FF6347', '#FFD700', '#FFA500', '#FF8C00', '#DC143C'],
    description: 'Hot oranges and reds like a summer sunset.'
  },
  {
    id: 'prism-fire',
    name: 'Prism Fire',
    category: 'bold',
    colors: ['#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#FFEE00'],
    description: 'A gradient of flame from deep red to bright yellow.'
  },

  // ── NATURAL ──
  {
    id: 'forest-soft',
    name: 'Forest Soft',
    category: 'natural',
    colors: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2', '#B7E4C7'],
    description: 'Rich forest greens for organic colouring.'
  },
  {
    id: 'desert-clay',
    name: 'Desert Clay',
    category: 'natural',
    colors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460', '#D2691E'],
    description: 'Warm earth tones inspired by desert landscapes.'
  },
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    category: 'natural',
    colors: ['#FF7F50', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    description: 'Vibrant marine colours for underwater scenes.'
  },
  {
    id: 'arctic-sky',
    name: 'Arctic Sky',
    category: 'natural',
    colors: ['#B0E0E6', '#87CEEB', '#4682B4', '#5F9EA0', '#7B68EE', '#483D8B'],
    description: 'Cool arctic blues and aurora purples.'
  },
  {
    id: 'autumn-garden',
    name: 'Autumn Garden',
    category: 'natural',
    colors: ['#8B0000', '#D2691E', '#CD853F', '#DAA520', '#556B2F', '#8FBC8F'],
    description: 'Warm autumn leaves and late harvest greens.'
  },

  // ── ACCESSIBILITY ──
  {
    id: 'high-contrast',
    name: 'High Contrast',
    category: 'accessibility',
    colors: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
    description: 'Maximum contrast for low-vision users.',
    accessibilityNotes: 'Recommended for Low Vision Mode. Colours are pure and highly distinguishable.'
  },
  {
    id: 'low-vision-bright',
    name: 'Low Vision Bright',
    category: 'accessibility',
    colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    description: 'Pure bright primaries and secondaries.',
    accessibilityNotes: 'Pure saturated colours visible at larger font sizes.'
  },
  {
    id: 'colour-blind-friendly',
    name: 'Colour Blind Friendly',
    category: 'accessibility',
    colors: ['#0072B2', '#009E73', '#D55E00', '#CC79A7', '#F0E442', '#56B4E9'],
    description: 'Chosen to be distinguishable by most colour-vision types.',
    accessibilityNotes: 'Based on research by Wong (2011). Avoids red-green confusion.'
  },
  {
    id: 'dyslexia-soft',
    name: 'Dyslexia Soft',
    category: 'accessibility',
    colors: ['#F5F5DC', '#E6E6FA', '#FFF8DC', '#F0FFF0', '#FFF0F5', '#F0F8FF'],
    description: 'Low-saturation pastels that reduce visual stress.',
    accessibilityNotes: 'Gentle on the eyes when combined with Dyslexia Assist spacing.'
  },
  {
    id: 'autism-calm',
    name: 'Autism Calm',
    category: 'accessibility',
    colors: ['#B2DFDB', '#C5CAE9', '#D1C4E9', '#DCEDC8', '#F0F4C3', '#FFE0B2'],
    description: 'Muted tones that do not overwhelm sensory processing.',
    accessibilityNotes: 'Avoids harsh bright flashes. Supports calm-mode focus.'
  },

  // ── PRO ──
  {
    id: 'skin-fur-tones',
    name: 'Skin / Fur Tones',
    category: 'pro',
    colors: ['#FFDBAC', '#F1C27D', '#E0AC69', '#8D5524', '#C68642', '#E0C8A0'],
    description: 'Natural skin and fur tones for character colouring.'
  },
  {
    id: 'metallics',
    name: 'Metallics',
    category: 'pro',
    colors: ['#FFD700', '#C0C0C0', '#B87333', '#E5E4E2', '#A8A9AD', '#D4AF37'],
    description: 'Gold, silver, copper, and bronze shades.'
  },
  {
    id: 'gemstones',
    name: 'Gemstones',
    category: 'pro',
    colors: ['#E0115F', '#0F52BA', '#50C878', '#40E0D0', '#9B111E', '#9966CC'],
    description: 'Ruby, sapphire, emerald, turquoise, garnet, amethyst.'
  },
  {
    id: 'space-glow',
    name: 'Space Glow',
    category: 'pro',
    colors: ['#0B0D17', '#1A1A2E', '#16213E', '#0F3460', '#E94560', '#533483'],
    description: 'Deep cosmic backgrounds with vibrant nebula accents.'
  },
  {
    id: 'shadow-highlight',
    name: 'Shadow + Highlight',
    category: 'pro',
    colors: ['#1A1A2E', '#3D3D5C', '#6B6B8D', '#A0A0B8', '#D4D4E0', '#FFFFFF'],
    description: 'Greyscale range for shading and highlight practice.'
  }
];
