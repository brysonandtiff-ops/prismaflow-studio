import React, { useState, useRef, useCallback } from 'react';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Upload, Image as ImageIcon, FileText, Trash2, Check, AlertTriangle, Paintbrush, Eye } from 'lucide-react';
import { sanitizeSvg } from './svgSanitizer';
import { convertImageToLineArt, DEFAULT_CONVERT_OPTIONS, RasterConvertOptions } from './rasterConverter';
import { ColoringPage } from '@/features/studio/regionModel';
import { toast } from 'sonner';

export interface ImportedPage {
  id: string;
  title: string;
  type: 'svg' | 'raster';
  data: string;
  regions: { id: string; name: string }[];
  createdAt: number;
}

const STORAGE_KEY = 'prismaflow-imported-pages';

function loadImportedPages(): ImportedPage[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function saveImportedPages(pages: ImportedPage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
}

interface ImportHubProps {
  onClose: () => void;
  onOpenImported: (page: ImportedPage) => void;
}

export const ImportHub: React.FC<ImportHubProps> = ({ onClose, onOpenImported }) => {
  const [importedPages, setImportedPages] = useState<ImportedPage[]>(loadImportedPages);
  const [preview, setPreview] = useState<{ type: 'svg' | 'raster'; data: string; regions: { id: string; name: string }[] } | null>(null);
  const [previewName, setPreviewName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [rasterOptions, setRasterOptions] = useState<RasterConvertOptions>(DEFAULT_CONVERT_OPTIONS);
  const [originalRasterFile, setOriginalRasterFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setPreview(null);
    setOriginalRasterFile(null);

    try {
      if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
        const text = await file.text();
        const result = sanitizeSvg(text);

        if (!result.safe && result.regions.length === 0) {
          toast.error('Could not process SVG: ' + result.warnings.join(', '));
          setIsProcessing(false);
          return;
        }

        if (result.warnings.length > 0) {
          toast.info('SVG sanitized: ' + result.warnings.slice(0, 3).join(', '));
        }

        setPreview({ type: 'svg', data: result.svgString, regions: result.regions });
        setPreviewName(file.name.replace(/\.svg$/i, ''));
      } else if (file.type.startsWith('image/') || file.name.match(/\.(png|jpg|jpeg|webp)$/i)) {
        const result = await convertImageToLineArt(file, rasterOptions);
        setOriginalRasterFile(file);
        setPreview({ type: 'raster', data: result, regions: [] });
        setPreviewName(file.name.replace(/\.(png|jpg|jpeg|webp)$/i, ''));
      } else {
        toast.error('Unsupported file type. Please upload SVG, PNG, JPG, or WebP.');
      }
    } catch (err) {
      toast.error('Import failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [rasterOptions]);

  const handleApplyRasterOptions = useCallback(async () => {
    if (!preview || preview.type !== 'raster') return;
    if (!originalRasterFile) {
      toast.error('Upload the image again before applying new adjustments.');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await convertImageToLineArt(originalRasterFile, rasterOptions);
      setPreview({ ...preview, data: result });
      toast.success('Line art adjustments applied');
    } catch (err) {
      toast.error('Could not apply adjustments: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  }, [originalRasterFile, preview, rasterOptions]);

  const handleSave = useCallback(() => {
    if (!preview || !previewName.trim()) return;

    const newPage: ImportedPage = {
      id: `imported-${Date.now()}`,
      title: previewName.trim(),
      type: preview.type,
      data: preview.data,
      regions: preview.regions,
      createdAt: Date.now(),
    };

    const updated = [...importedPages, newPage];
    setImportedPages(updated);
    saveImportedPages(updated);

    toast.success(`"${newPage.title}" saved to My Imported Pages`);
    setPreview(null);
    setPreviewName('');
    setOriginalRasterFile(null);
  }, [preview, previewName, importedPages]);

  const handleDelete = useCallback((id: string) => {
    if (!window.confirm('Delete this imported page?')) return;
    const updated = importedPages.filter(p => p.id !== id);
    setImportedPages(updated);
    saveImportedPages(updated);
    toast.success('Page deleted');
  }, [importedPages]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startRename = useCallback((id: string) => {
    const page = importedPages.find(p => p.id === id);
    if (!page) return;
    setEditingId(id);
    setEditName(page.title);
  }, [importedPages]);

  const saveRename = useCallback(() => {
    if (!editingId || !editName.trim()) { setEditingId(null); return; }
    const updated = importedPages.map(p =>
      p.id === editingId ? { ...p, title: editName.trim() } : p
    );
    setImportedPages(updated);
    saveImportedPages(updated);
    setEditingId(null);
    setEditName('');
    toast.success('Page renamed');
  }, [editingId, editName, importedPages]);

  const handleOpenFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <GlassPanel strong className="w-full max-w-2xl max-h-[90dvh] flex flex-col shadow-2xl border border-border/40">
        {/* Header */}
        <div className="p-5 border-b border-border/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#FFD166]" />
            <h2 className="text-xl font-bold tracking-tight">Creator Import Hub</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="rounded-xl hover:bg-muted/60">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Upload Area */}
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml,image/png,image/jpeg,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Upload image or SVG"
            />
            <button
              onClick={handleOpenFile}
              disabled={isProcessing}
              className="w-full h-24 rounded-xl border-2 border-dashed border-border/40 bg-muted/10 hover:bg-muted/30 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm font-medium">
                {isProcessing ? 'Processing...' : 'Drop SVG, PNG, JPG, or WebP here'}
              </span>
              <span className="text-xs text-muted-foreground">or click to browse</span>
            </button>
          </div>

          {/* Raster Options */}
          {preview?.type === 'raster' && (
            <div className="p-4 rounded-xl bg-muted/20 border border-border/20 space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#45E7FF]" />
                <h3 className="text-sm font-semibold">Line Art Adjustments</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(['lineStrength', 'contrast', 'brightness', 'simplification'] as const).map(key => (
                  <div key={key} className="space-y-1">
                    <label className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={rasterOptions[key]}
                      onChange={(e) => setRasterOptions(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                      className="w-full accent-[#45E7FF]"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="invert"
                  checked={rasterOptions.invert}
                  onChange={(e) => setRasterOptions(prev => ({ ...prev, invert: e.target.checked }))}
                  className="accent-[#45E7FF]"
                />
                <label htmlFor="invert" className="text-sm">Invert colours</label>
              </div>
              <Button
                onClick={handleApplyRasterOptions}
                disabled={isProcessing || !originalRasterFile}
                variant="outline"
                size="sm"
                className="rounded-xl border-[#45E7FF]/30 text-[#45E7FF] hover:bg-[#45E7FF]/10"
              >
                {isProcessing ? 'Processing...' : 'Apply adjustments'}
              </Button>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="p-4 rounded-xl bg-muted/20 border border-border/20 space-y-4">
              <div className="flex items-center gap-2">
                {preview.type === 'svg' ? <FileText className="w-4 h-4 text-[#6EF3B5]" /> : <ImageIcon className="w-4 h-4 text-[#FF6EC7]" />}
                <h3 className="text-sm font-semibold">Preview</h3>
                {preview.type === 'svg' && preview.regions.length > 0 && (
                  <span className="text-xs text-[#6EF3B5]">{preview.regions.length} regions detected</span>
                )}
                {preview.type === 'raster' && (
                  <span className="text-xs text-[#FF6EC7]">Brush colouring only</span>
                )}
              </div>

              <div className="bg-white/5 rounded-lg overflow-hidden flex items-center justify-center min-h-[200px]">
                {preview.type === 'svg' ? (
                  <div
                    className="w-full max-h-[300px] overflow-auto"
                    dangerouslySetInnerHTML={{ __html: preview.data }}
                  />
                ) : (
                  <img src={preview.data} alt="Preview" className="max-w-full max-h-[300px] object-contain" />
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={previewName}
                  onChange={(e) => setPreviewName(e.target.value)}
                  placeholder="Name your artwork..."
                  className="flex-1 px-3 py-2 rounded-lg bg-background/50 border border-border/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button
                  onClick={handleSave}
                  disabled={!previewName.trim()}
                  className="rounded-xl bg-gradient-to-r from-[#45E7FF] to-[#8B5CF6] text-[#07080D] font-semibold hover:opacity-90 transition-opacity"
                >
                  <Check className="w-4 h-4 mr-1.5" /> Save
                </Button>
              </div>
            </div>
          )}

          {/* My Imported Pages */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Paintbrush className="w-4 h-4 text-[#8B5CF6]" />
              My Imported Pages ({importedPages.length})
            </h3>
            {importedPages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No imported pages yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {importedPages.map(page => (
                  <div
                    key={page.id}
                    className="p-3 rounded-xl bg-muted/20 border border-border/20 hover:border-border/40 transition-colors flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-lg bg-muted/40 flex items-center justify-center shrink-0 overflow-hidden">
                      {page.type === 'svg' ? (
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <img src={page.data} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingId === page.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={saveRename}
                          onKeyDown={(e) => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') setEditingId(null); }}
                          className="w-full px-2 py-1 rounded bg-background/50 border border-border/40 text-sm"
                          autoFocus
                          aria-label="Rename imported page"
                        />
                      ) : (
                        <button
                          onClick={() => startRename(page.id)}
                          className="text-sm font-medium truncate hover:text-primary transition-colors text-left w-full"
                          aria-label={`Rename ${page.title}`}
                        >
                          {page.title}
                        </button>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-medium",
                          page.type === 'svg'
                            ? "bg-[#6EF3B5]/10 text-[#6EF3B5]"
                            : "bg-[#FF6EC7]/10 text-[#FF6EC7]"
                        )}>
                          {page.type === 'svg' ? 'SVG Region' : 'Raster'}
                        </span>
                        <span>{page.type === 'svg' ? `${page.regions.length} regions` : 'Brush only'}</span>
                        <span>·</span>
                        <span>{new Date(page.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenImported(page)}
                        className="h-8 rounded-lg text-xs hover:bg-primary/10 hover:text-primary"
                      >
                        Open
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(page.id)}
                        aria-label={`Delete ${page.title}`}
                        className="h-8 w-8 rounded-lg hover:bg-[#FF6EC7]/10 hover:text-[#FF6EC7]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};