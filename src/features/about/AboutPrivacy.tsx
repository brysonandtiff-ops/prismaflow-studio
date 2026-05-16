import React from 'react';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { ShieldCheck, WifiOff, Accessibility, Eye } from 'lucide-react';

interface AboutPrivacyProps {
  onClose: () => void;
}

export const AboutPrivacy: React.FC<AboutPrivacyProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <GlassPanel strong className="w-full max-w-2xl max-h-[90dvh] flex flex-col shadow-2xl border border-border/40">
        <div className="p-6 border-b border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#6EF3B5]" />
            <h2 className="text-2xl font-bold tracking-tight">Privacy & Safety</h2>
          </div>
          <Button variant="ghost" onClick={onClose} className="rounded-xl hover:bg-muted/60">
            Close
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#45E7FF]" />
              Your Data, Your Device
            </h3>
            <p className="text-muted-foreground text-pretty leading-relaxed">
              PRISMAFLOW Studio saves your artwork locally on your device. No account is required, and we don't upload your creations to any server by default. Your privacy is built-in.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-muted/20 border border-border/20 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <WifiOff className="w-4 h-4 text-[#FFD166]" />
                Works Offline
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Once loaded, you can colour anywhere, even without an internet connection.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-muted/20 border border-border/20 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Accessibility className="w-4 h-4 text-[#8B5CF6]" />
                Inclusive Free
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All accessibility features are included for free, forever. No barriers to creativity.
              </p>
            </div>
          </div>

          <section className="space-y-4 pt-4 border-t border-border/30">
            <h3 className="text-lg font-bold">Safe for Everyone</h3>
            <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
              This app is designed to be a safe space for kids, families, and professionals. There are no social feeds, public comments, or hidden tracking. Just pure creative flow.
            </p>
          </section>
        </div>

        <div className="p-6 border-t border-border/30 flex justify-end">
          <Button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-[#45E7FF] to-[#8B5CF6] text-[#07080D] font-semibold hover:opacity-90 transition-opacity"
          >
            Understood
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
};
