import React from 'react';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { Sparkles, Palette, MousePointer2, Settings, Download } from 'lucide-react';

interface OnboardingCardProps {
  onStart: () => void;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({ onStart }) => {
  const steps = [
    { icon: <Sparkles className="w-5 h-5 text-yellow-400" />, text: "Choose a page from the gallery." },
    { icon: <Palette className="w-5 h-5 text-blue-400" />, text: "Pick a color from the palettes." },
    { icon: <MousePointer2 className="w-5 h-5 text-green-400" />, text: "Tap a region to fill it instantly." },
    { icon: <Settings className="w-5 h-5 text-purple-400" />, text: "Try Access Mode for tailored experience." },
    { icon: <Download className="w-5 h-5 text-pink-400" />, text: "Export and share your artwork!" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <GlassPanel className="w-full max-w-md p-8 space-y-8 shadow-2xl border-primary/20">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center text-primary-foreground text-3xl font-bold italic mb-4">
            P
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome to PRISMAFLOW</h2>
          <p className="text-muted-foreground">Colour without barriers.</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
              <div className="shrink-0">{step.icon}</div>
              <p className="text-sm font-medium">{step.text}</p>
            </div>
          ))}
        </div>

        <Button className="w-full h-12 text-lg font-bold" onClick={onStart}>
          Get Started
        </Button>
      </GlassPanel>
    </div>
  );
};
