import React from 'react';
import { cn } from '@/lib/utils';
import { ACCESS_PROFILES, AccessProfileType } from './accessProfiles';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const profileAccent: Record<string, string> = {
  default: 'from-[#A9B3C7] to-[#F8FAFF]',
  adhd: 'from-[#FFD166] to-[#FF6EC7]',
  autism: 'from-[#6EF3B5] to-[#45E7FF]',
  dyslexia: 'from-[#45E7FF] to-[#8B5CF6]',
  'low-vision': 'from-[#FF6EC7] to-[#FFD166]',
  motor: 'from-[#8B5CF6] to-[#FF6EC7]',
  blind: 'from-[#45E7FF] to-[#6EF3B5]',
};

const profileGlow: Record<string, string> = {
  default: '',
  adhd: 'glow-gold',
  autism: 'glow-cyan',
  dyslexia: 'glow-violet',
  'low-vision': 'glow-rose',
  motor: 'glow-violet',
  blind: 'glow-cyan',
};

interface AccessCentreProps {
  activeProfile: AccessProfileType;
  onSelectProfile: (profile: AccessProfileType) => void;
  onClose: () => void;
}

export const AccessCentre: React.FC<AccessCentreProps> = ({ activeProfile, onSelectProfile, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <GlassPanel strong className="w-full max-w-2xl max-h-[90dvh] flex flex-col shadow-2xl border border-border/40">
        <div className="p-6 border-b border-border/30 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#6EF3B5] animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#6EF3B5]">
                Accessibility
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Access Centre</h2>
            <p className="text-sm text-muted-foreground">Select a profile to customize your experience.</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
            className="rounded-xl hover:bg-muted/60"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {ACCESS_PROFILES.map((profile) => {
            const isActive = activeProfile === profile.id;
            return (
              <button
                key={profile.id}
                onClick={() => onSelectProfile(profile.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group",
                  isActive
                    ? 'border-[#45E7FF]/40 bg-[#45E7FF]/5 shadow-[0_0_20px_-4px_rgba(69,231,255,0.15)]'
                    : 'border-transparent bg-muted/20 hover:bg-muted/40 hover:border-border/40'
                )}
              >
                <div className="space-y-1.5">
                  <div className="font-bold flex items-center gap-2 text-base">
                    <span
                      className={cn(
                        "w-3 h-3 rounded-full bg-gradient-to-br shrink-0",
                        profileAccent[profile.id] || profileAccent.default
                      )}
                    />
                    {profile.name}
                    {isActive && (
                      <Check className="w-4 h-4 text-[#45E7FF]" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
                    {profile.description}
                  </p>
                </div>
                {isActive && (
                  <div className={cn(
                    "shrink-0 w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center ml-4",
                    profileAccent[profile.id] || profileAccent.default,
                    profileGlow[profile.id]
                  )}>
                    <Check className="w-5 h-5 text-[#07080D]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-6 border-t border-border/30 flex justify-end shrink-0">
          <Button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-[#45E7FF] to-[#8B5CF6] text-[#07080D] font-semibold hover:opacity-90 transition-opacity"
          >
            Done
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
};


