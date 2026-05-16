import React from 'react';
import { AppShell } from '@/components/AppShell';
import { HomeGallery } from '@/features/gallery/HomeGallery';
import { Studio } from '@/features/studio/Studio';
import { AccessCentre } from '@/features/access/AccessCentre';
import { OnboardingCard } from '@/features/onboarding/OnboardingCard';
import { AboutPrivacy } from '@/features/about/AboutPrivacy';
import { useAccessProfile } from '@/features/access/useAccessProfile';

export type Screen = 'home' | 'studio' | 'access' | 'about';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = React.useState<Screen>('home');
  const [selectedPageId, setSelectedPageId] = React.useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = React.useState(() => {
    return !localStorage.getItem('prismaflow-onboarded');
  });
  const [showAbout, setShowAbout] = React.useState(false);
  const { activeProfile, setActiveProfile } = useAccessProfile();

  const handleStart = () => {
    setShowOnboarding(false);
    localStorage.setItem('prismaflow-onboarded', 'true');
  };

  const navigateToStudio = (pageId: string) => {
    setSelectedPageId(pageId);
    setCurrentScreen('studio');
  };

  const navigateHome = () => {
    setCurrentScreen('home');
    setSelectedPageId(null);
  };

  return (
    <AppShell>
      {showOnboarding && <OnboardingCard onStart={handleStart} />}
      {showAbout && <AboutPrivacy onClose={() => setShowAbout(false)} />}
      
      {currentScreen === 'home' && (
        <HomeGallery 
          onSelectPage={navigateToStudio} 
          onOpenAccess={() => setCurrentScreen('access')} 
          onOpenAbout={() => setShowAbout(true)}
        />
      )}
      {currentScreen === 'studio' && selectedPageId && (
        <Studio 
          pageId={selectedPageId} 
          onBack={navigateHome} 
          onOpenAccess={() => setCurrentScreen('access')}
          activeProfile={activeProfile}
        />
      )}
      {currentScreen === 'access' && (
        <AccessCentre 
          activeProfile={activeProfile}
          onSelectProfile={setActiveProfile}
          onClose={() => setCurrentScreen(selectedPageId ? 'studio' : 'home')} 
        />
      )}
    </AppShell>
  );
};

export default App;
