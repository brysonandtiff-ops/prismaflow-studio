import React from 'react';
import { AppShell } from '@/components/AppShell';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { HomeGallery } from '@/features/gallery/HomeGallery';
import { Studio } from '@/features/studio/Studio';
import { AccessCentre } from '@/features/access/AccessCentre';
import { OnboardingCard } from '@/features/onboarding/OnboardingCard';
import { AboutPrivacy } from '@/features/about/AboutPrivacy';
import { useAccessProfile } from '@/features/access/useAccessProfile';
import { ProjectSafetyBar } from '@/features/project/ProjectSafetyBar';
import { Button } from '@/components/ui/button';

export type Screen = 'home' | 'studio' | 'access' | 'about';

interface AppLocation {
  screen: Screen;
  pageId: string | null;
}

function decodePageId(value: string) {
  try {
    return decodeURIComponent(value) || null;
  } catch {
    return null;
  }
}

function readLocation(): AppLocation {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash.startsWith('studio/')) {
    const pageId = decodePageId(hash.slice('studio/'.length));
    return pageId ? { screen: 'studio', pageId } : { screen: 'home', pageId: null };
  }
  if (hash.startsWith('access/')) {
    return { screen: 'access', pageId: decodePageId(hash.slice('access/'.length)) };
  }
  if (hash === 'access') return { screen: 'access', pageId: null };
  return { screen: 'home', pageId: null };
}

function setLocation(screen: Screen, pageId?: string | null) {
  const nextHash = screen === 'studio' && pageId
    ? `#studio/${encodeURIComponent(pageId)}`
    : screen === 'access' && pageId
      ? `#access/${encodeURIComponent(pageId)}`
      : screen === 'access'
        ? '#access'
        : '#home';
  if (window.location.hash !== nextHash) window.location.hash = nextHash;
}

function hasCompletedOnboarding() {
  try {
    return Boolean(localStorage.getItem('prismaflow-onboarded'));
  } catch {
    return false;
  }
}

const App: React.FC = () => {
  const initialLocation = React.useMemo(readLocation, []);
  const [currentScreen, setCurrentScreen] = React.useState<Screen>(initialLocation.screen);
  const [selectedPageId, setSelectedPageId] = React.useState<string | null>(initialLocation.pageId);
  const [showOnboarding, setShowOnboarding] = React.useState(() => !hasCompletedOnboarding());
  const [showAbout, setShowAbout] = React.useState(false);
  const { activeProfile, setActiveProfile } = useAccessProfile();

  React.useEffect(() => {
    const syncLocation = () => {
      const location = readLocation();
      setCurrentScreen(location.screen);
      setSelectedPageId(location.pageId);
      setShowAbout(false);
    };
    window.addEventListener('hashchange', syncLocation);
    return () => window.removeEventListener('hashchange', syncLocation);
  }, []);

  React.useEffect(() => {
    const suffix = currentScreen === 'studio' ? 'Studio' : currentScreen === 'access' ? 'Access Centre' : 'Gallery';
    document.title = `${suffix} — PRISMAFLOW Studio`;
  }, [currentScreen]);

  const handleStart = () => {
    setShowOnboarding(false);
    try {
      localStorage.setItem('prismaflow-onboarded', 'true');
    } catch {
      // The app still works when storage is unavailable; project controls will surface the limitation.
    }
  };

  const navigateToStudio = (pageId: string) => {
    setSelectedPageId(pageId);
    setCurrentScreen('studio');
    setLocation('studio', pageId);
  };

  const navigateHome = () => {
    setCurrentScreen('home');
    setSelectedPageId(null);
    setShowAbout(false);
    setLocation('home');
  };

  const navigateToAccess = () => {
    setCurrentScreen('access');
    setLocation('access', selectedPageId);
  };

  const closeAccess = () => {
    if (selectedPageId) {
      setCurrentScreen('studio');
      setLocation('studio', selectedPageId);
    } else {
      navigateHome();
    }
  };

  return (
    <AppShell>
      <AppErrorBoundary onReturnHome={navigateHome}>
        {showOnboarding && <OnboardingCard onStart={handleStart} />}
        {showAbout && <AboutPrivacy onClose={() => setShowAbout(false)} />}

        {currentScreen === 'home' && (
          <HomeGallery
            onSelectPage={navigateToStudio}
            onOpenAccess={navigateToAccess}
            onOpenAbout={() => setShowAbout(true)}
          />
        )}

        {currentScreen === 'studio' && selectedPageId && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1">
              <Studio
                pageId={selectedPageId}
                onBack={navigateHome}
                onOpenAccess={navigateToAccess}
                activeProfile={activeProfile}
              />
            </div>
            <ProjectSafetyBar pageId={selectedPageId} />
          </div>
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
            onClose={closeAccess}
          />
        )}
      </AppErrorBoundary>
    </AppShell>
  );
};

export default App;
