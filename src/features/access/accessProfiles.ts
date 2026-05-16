export type AccessProfileType = 
  | 'default'
  | 'adhd'
  | 'autism'
  | 'dyslexia'
  | 'low-vision'
  | 'motor'
  | 'blind';

export interface AccessProfile {
  id: AccessProfileType;
  name: string;
  description: string;
}

export const ACCESS_PROFILES: AccessProfile[] = [
  { id: 'default', name: 'Default', description: 'Standard experience.' },
  { id: 'adhd', name: 'ADHD Focus Flow', description: 'Reduced distractions, focused region controls.' },
  { id: 'autism', name: 'Autism Calm Mode', description: 'Reduced motion, predictable layout, soft colors.' },
  { id: 'dyslexia', name: 'Dyslexia Assist', description: 'Improved spacing and readability.' },
  { id: 'low-vision', name: 'Low Vision Mode', description: 'Enlarged controls, high contrast, thick outlines.' },
  { id: 'motor', name: 'Motor Assist', description: 'Large buttons, simplified interactions.' },
  { id: 'blind', name: 'Blind Guide Mode', description: 'TTS descriptions and robust keyboard navigation.' },
];
