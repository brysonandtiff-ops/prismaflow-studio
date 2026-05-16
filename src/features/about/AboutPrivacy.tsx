import React from 'react';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Eye, WifiOff, Accessibility } from 'lucide-react';

interface AboutPrivacyProps {
  onClose: () => void;
}

export const AboutPrivacy: React.FC<AboutPrivacyProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <GlassPanel className="w-full max-w-2xl max-h-[90dvh] flex flex-col shadow-2xl">
        <div className="p-6 border-b border-border/40 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Privacy & Safety</h2>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Your Data, Your Device
            </h3>
            <p className="text-muted-foreground text-pretty leading-relaxed">
              PRISMAFLOW Studio saves your artwork locally on your device. No account is required, and we don't upload your creations to any server by default. Your privacy is built-in.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-muted/30 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <WifiOff className="w-4 h-4 text-primary" />
                Works Offline
              </div>
              <p className="text-sm text-muted-foreground">
                Once loaded, you can colour anywhere, even without an internet connection.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Accessibility className="w-4 h-4 text-primary" />
                Inclusive Free
              </div>
              <p className="text-sm text-muted-foreground">
                All accessibility features are included for free, forever. No barriers to creativity.
              </p>
            </div>
          </div>

          <section className="space-y-4 pt-4 border-t border-border/40">
            <h3 className="text-lg font-bold">Safe for Everyone</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              This app is designed to be a safe space for kids, families, and professionals. There are no social feeds, public comments, or hidden tracking. Just pure creative flow.
            </p>
          </section>
        </div>

        <div className="p-6 border-t border-border/40 flex justify-end">
          <Button onClick={onClose}>Understood</Button>
        </div>
      </GlassPanel>
    </div>
  );
};
