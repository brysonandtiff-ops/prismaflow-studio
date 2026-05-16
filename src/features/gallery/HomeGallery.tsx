import React from 'react';
import { STARTER_PAGES } from '@/data/starterPages';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { Settings, Play } from 'lucide-react';

interface HomeGalleryProps {
  onSelectPage: (id: string) => void;
  onOpenAccess: () => void;
  onOpenAbout: () => void;
}

export const HomeGallery: React.FC<HomeGalleryProps> = ({ onSelectPage, onOpenAccess, onOpenAbout }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight">Studio Gallery</h2>
              <p className="text-muted-foreground text-pretty">Choose a canvas to start your creative journey.</p>
            </div>
            <Button variant="outline" size="icon" onClick={onOpenAccess} aria-label="Accessibility Settings">
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {STARTER_PAGES.map((page) => (
              <GlassPanel key={page.id} className="group cursor-pointer flex flex-col h-full" as="article">
                <div 
                  className="aspect-square bg-muted/30 flex items-center justify-center relative overflow-hidden"
                  onClick={() => onSelectPage(page.id)}
                >
                  {page.image ? (
                    <img src={page.image} alt={page.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                      <div className="w-24 h-24 border-4 border-current rounded-full" />
                    </div>
                  )}
                  <div className="absolute inset-0 z-10 bg-background/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <div className="bg-background/80 p-4 rounded-full scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-8 h-8 fill-current" />
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-2">
                  <h3 className="text-xl font-bold">{page.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{page.description}</p>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider px-2 py-1 rounded bg-secondary text-secondary-foreground">
                      {page.difficulty}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => onSelectPage(page.id)}>
                      Open Studio
                    </Button>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        </section>

        <GlassPanel className="p-8 bg-primary/5 border-primary/20">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold">Inclusive by Design</h3>
              <p className="text-muted-foreground text-pretty max-w-prose">
                PRISMAFLOW Studio is built for everyone. Access customized profiles for ADHD, Autism, Dyslexia, and more in the Access Centre.
              </p>
              <div className="flex gap-4">
                <Button onClick={onOpenAccess}>Open Access Centre</Button>
                <Button variant="outline" onClick={onOpenAbout}>Privacy & Safety</Button>
              </div>
            </div>
            <div className="shrink-0 w-32 h-32 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Settings className="w-16 h-16 text-primary" />
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
