import React from 'react';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { Sparkles, Palette, MousePointer2, Settings, Download } from 'lucide-react';

interface OnboardingCardProps {
  onStart: () => void;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({ onStart }) => {
  const steps = [
    { icon: <Sparkles className="w-5 h-5 text-[#FFD166]" />, text: "Choose a page from the gallery." },
    { icon: <Palette className="w-5 h-5 text-[#45E7FF]" />, text: "Pick a color from the palettes." },
    { icon: <MousePointer2 className="w-5 h-5 text-[#6EF3B5]" />, text: "Tap a region to fill it instantly." },
    { icon: <Settings className="w-5 h-5 text-[#8B5CF6]" />, text: "Try Access Mode for tailored experience." },
    { icon: <Download className="w-5 h-5 text-[#FF6EC7]" />, text: "Export and share your artwork!" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <GlassPanel strong className="w-full max-w-md p-8 space-y-8 shadow-2xl border border-[#45E7FF]/10">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-[#07080D] text-3xl font-bold italic mb-2 bg-gradient-to-br from-[#45E7FF] to-[#8B5CF6] shadow-lg shadow-[#45E7FF]/20">
            P
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-balance">Welcome to PRISMAFLOW</h2>
          <p className="text-muted-foreground">Colour without barriers.</p>
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-muted/20 border border-border/20 hover:border-border/40 transition-colors">
              <div className="shrink-0">{step.icon}</div>
              <p className="text-sm font-medium">{step.text}</p>
            </div>
          ))}
        </div>

        <Button
          className="w-full h-12 text-lg font-bold rounded-xl bg-gradient-to-r from-[#45E7FF] to-[#8B5CF6] text-[#07080D] hover:opacity-90 transition-opacity"
          onClick={onStart}
        >
          Get Started
        </Button>
      </GlassPanel>
    </div>
  );
};
