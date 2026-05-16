import React from 'react';
import { ACCESS_PROFILES, AccessProfileType } from './accessProfiles';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface AccessCentreProps {
  activeProfile: AccessProfileType;
  onSelectProfile: (profile: AccessProfileType) => void;
  onClose: () => void;
}

export const AccessCentre: React.FC<AccessCentreProps> = ({ activeProfile, onSelectProfile, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <GlassPanel className="w-full max-w-2xl max-h-[90dvh] flex flex-col shadow-2xl">
        <div className="p-6 border-b border-border/40 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Access Centre</h2>
            <p className="text-sm text-muted-foreground">Select a profile to customize your experience.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {ACCESS_PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => onSelectProfile(profile.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                activeProfile === profile.id
                  ? 'border-primary bg-primary/5 shadow-inner'
                  : 'border-transparent bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="space-y-1">
                <div className="font-bold flex items-center gap-2">
                  {profile.name}
                  {activeProfile === profile.id && <Check className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">{profile.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-border/40 flex justify-end shrink-0">
          <Button onClick={onClose}>Done</Button>
        </div>
      </GlassPanel>
    </div>
  );
};
