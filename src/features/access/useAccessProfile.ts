import { useState, useEffect } from 'react';
import { AccessProfileType } from './accessProfiles';

export const useAccessProfile = () => {
  const [activeProfile, setActiveProfile] = useState<AccessProfileType>(() => {
    const saved = localStorage.getItem('prismaflow-access-profile');
    return (saved as AccessProfileType) || 'default';
  });

  useEffect(() => {
    localStorage.setItem('prismaflow-access-profile', activeProfile);
    
    // Apply attributes to document for CSS targeting
    document.documentElement.setAttribute('data-access-profile', activeProfile);
    document.documentElement.setAttribute('data-reduced-motion', String(activeProfile === 'autism'));
    document.documentElement.setAttribute('data-dyslexia-assist', String(activeProfile === 'dyslexia'));
    document.documentElement.setAttribute('data-low-vision', String(activeProfile === 'low-vision'));
    
  }, [activeProfile]);

  return { activeProfile, setActiveProfile };
};
