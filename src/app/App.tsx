import React from 'react';
import { AppShell } from '@/components/AppShell';
import { HomeGallery } from '@/features/gallery/HomeGallery';
import { Studio } from '@/features/studio/Studio';
import { AccessCentre } from '@/features/access/AccessCentre';
import { OnboardingCard } from '@/features/onboarding/OnboardingCard';
import { AboutPrivacy } from '@/features/about/AboutPrivacy';
import { useAccessProfile } from '@/features/access/useAccessProfile';
import { Button } from '@/components/ui/button';

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
      {currentScreen === 'studio' && !selectedPageId && (
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">No artwork selected</h2>
            <p className="text-muted-foreground">Choose a canvas from the gallery to begin.</p>
            <Button onClick={navigateHome}>Back to Gallery</Button>
          </div>
        </div>
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
