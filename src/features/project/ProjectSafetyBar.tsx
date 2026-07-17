import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Download, FileUp, Maximize2, Minimize2, RotateCcw, Save, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProjectRecord {
  pageId: string;
  fills?: Record<string, string>;
  brushData?: string;
  lastModified?: number;
  version?: number;
}

interface PortableProject {
  schema: 'prismaflow-project';
  version: 1;
  exportedAt: string;
  pageId: string;
  project: ProjectRecord;
}

interface ProjectSafetyBarProps {
  pageId: string;
  pageTitle?: string;
}

const projectKey = (pageId: string) => `prismaflow-project-${pageId}`;
const backupKey = (pageId: string) => `prismaflow-project-backup-${pageId}`;

function readRecord(raw: string | null): ProjectRecord | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ProjectRecord;
    if (!parsed || typeof parsed !== 'object' || typeof parsed.pageId !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}

function safeFilename(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'prismaflow-project';
}

function formatSavedAt(timestamp?: number) {
  if (!timestamp) return 'Not saved yet';
  return `Saved ${new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(timestamp)}`;
}

export const ProjectSafetyBar: React.FC<ProjectSafetyBarProps> = ({ pageId, pageTitle }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const previousRawRef = useRef<string | null>(null);
  const [record, setRecord] = useState<ProjectRecord | null>(null);
  const [hasBackup, setHasBackup] = useState(false);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [isFullscreen, setIsFullscreen] = useState(() => Boolean(document.fullscreenElement));
  const [statusMessage, setStatusMessage] = useState('Local-first project protection active.');

  const syncFromStorage = useCallback(() => {
    const key = projectKey(pageId);
    const currentRaw = localStorage.getItem(key);

    if (previousRawRef.current !== null && currentRaw && currentRaw !== previousRawRef.current) {
      try {
        localStorage.setItem(backupKey(pageId), previousRawRef.current);
        setHasBackup(true);
      } catch (error) {
        console.warn('[PRISMAFLOW] Could not write project backup', error);
        setStatusMessage('Storage is full. Export a project copy now.');
      }
    }

    previousRawRef.current = currentRaw;
    const currentRecord = readRecord(currentRaw);
    setRecord(currentRecord);
    setHasBackup(Boolean(localStorage.getItem(backupKey(pageId))));
  }, [pageId]);

  useEffect(() => {
    previousRawRef.current = localStorage.getItem(projectKey(pageId));
    syncFromStorage();

    const interval = window.setInterval(syncFromStorage, 700);
    const handleOnline = () => {
      setIsOnline(true);
      setStatusMessage('Back online. Your project remains stored locally.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setStatusMessage('Offline mode. Colouring and local saves still work.');
    };
    const handleFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('fullscreenchange', handleFullscreen);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('fullscreenchange', handleFullscreen);
    };
  }, [pageId, syncFromStorage]);

  const createManualSnapshot = () => {
    const raw = localStorage.getItem(projectKey(pageId));
    if (!raw) {
      toast.info('Make a change on the canvas before saving a snapshot.');
      return;
    }

    try {
      localStorage.setItem(backupKey(pageId), raw);
      setHasBackup(true);
      setStatusMessage('Recovery snapshot saved on this device.');
      toast.success('Recovery snapshot saved');
    } catch (error) {
      console.error('[PRISMAFLOW] Snapshot failed', error);
      toast.error('Could not save a recovery snapshot. Export the project instead.');
    }
  };

  const downloadProject = () => {
    const current = readRecord(localStorage.getItem(projectKey(pageId)));
    if (!current) {
      toast.info('Make a change on the canvas before exporting a project file.');
      return;
    }

    const portable: PortableProject = {
      schema: 'prismaflow-project',
      version: 1,
      exportedAt: new Date().toISOString(),
      pageId,
      project: { ...current, pageId, version: 1 },
    };
    const blob = new Blob([JSON.stringify(portable, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${safeFilename(pageTitle || pageId)}.prismaflow.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setStatusMessage('Portable project copy downloaded.');
    toast.success('Project file downloaded');
  };

  const restoreBackup = () => {
    const raw = localStorage.getItem(backupKey(pageId));
    if (!raw || !readRecord(raw)) {
      toast.error('No valid recovery snapshot is available.');
      return;
    }
    if (!window.confirm('Restore the previous recovery snapshot? Current unsaved canvas state will be replaced.')) return;

    localStorage.setItem(projectKey(pageId), raw);
    setStatusMessage('Recovery snapshot restored. Reloading the canvas.');
    window.location.reload();
  };

  const importProject = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as PortableProject;
      if (parsed.schema !== 'prismaflow-project' || parsed.version !== 1 || !parsed.project) {
        throw new Error('Unsupported project format');
      }
      if (parsed.pageId !== pageId && parsed.project.pageId !== pageId) {
        throw new Error('This project file belongs to another artwork');
      }
      const currentRaw = localStorage.getItem(projectKey(pageId));
      if (currentRaw) localStorage.setItem(backupKey(pageId), currentRaw);
      localStorage.setItem(projectKey(pageId), JSON.stringify({
        ...parsed.project,
        pageId,
        version: 1,
        lastModified: Date.now(),
      }));
      setStatusMessage('Project file restored. Reloading the canvas.');
      window.location.reload();
    } catch (error) {
      console.error('[PRISMAFLOW] Import failed', error);
      toast.error(error instanceof Error ? error.message : 'Could not restore the project file');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (error) {
      console.warn('[PRISMAFLOW] Fullscreen unavailable', error);
      toast.error('Fullscreen is not available in this browser view.');
    }
  };

  return (
    <section
      aria-label="Project safety controls"
      className="z-[70] w-full shrink-0 border-t border-white/10 bg-[#0b0d16]/95 px-3 py-2 shadow-[0_-14px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2">
        <div className="mr-auto flex min-w-0 items-center gap-2 px-1">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#6EF3B5]" aria-hidden="true" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-foreground">{formatSavedAt(record?.lastModified)}</p>
            <p className="truncate text-[10px] text-muted-foreground" aria-live="polite">{statusMessage}</p>
          </div>
          <span className={cn(
            'ml-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium',
            isOnline ? 'bg-[#6EF3B5]/10 text-[#6EF3B5]' : 'bg-[#FFD166]/10 text-[#FFD166]',
          )}>
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? 'Online' : 'Offline ready'}
          </span>
        </div>

        <Button size="sm" variant="ghost" className="h-9 gap-1.5 rounded-xl" onClick={createManualSnapshot}>
          <Save className="h-3.5 w-3.5" /> Snapshot
        </Button>
        <Button size="sm" variant="ghost" className="h-9 gap-1.5 rounded-xl" onClick={downloadProject}>
          <Download className="h-3.5 w-3.5" /> Project file
        </Button>
        <Button size="sm" variant="ghost" className="h-9 gap-1.5 rounded-xl" onClick={() => inputRef.current?.click()}>
          <FileUp className="h-3.5 w-3.5" /> Restore file
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-9 gap-1.5 rounded-xl"
          onClick={restoreBackup}
          disabled={!hasBackup}
        >
          <RotateCcw className="h-3.5 w-3.5" /> Previous
        </Button>
        <Button size="sm" variant="ghost" className="h-9 gap-1.5 rounded-xl" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          {isFullscreen ? 'Exit focus' : 'Focus'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json,.prismaflow"
          className="sr-only"
          aria-label="Restore PRISMAFLOW project file"
          onChange={(event) => void importProject(event.target.files?.[0])}
        />
      </div>
    </section>
  );
};
