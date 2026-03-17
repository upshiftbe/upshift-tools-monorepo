import { createFileRoute } from '@tanstack/react-router';
import { Button, Card, CardContent, CardHeader, CardTitle, Label } from '@upshift-tools/shared-ui';
import {
  AlertCircle,
  ArchiveIcon,
  CheckCircle2,
  Download,
  ImageDown,
  Loader2,
  Settings2,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import {
  formatBytes,
  getOutputFilename,
  processImage,
  type OutputFormat,
  type ProcessedImage,
} from '~/lib/imageProcessor';
import { downloadAsZip } from '~/lib/zipHelper';

export const Route = createFileRoute('/')({ component: App });

const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'];

type FileStatus = 'processing' | 'done' | 'error';

interface ProcessedFile {
  id: string;
  file: File;
  status: FileStatus;
  result?: ProcessedImage;
  error?: string;
}

function App() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [format, setFormat] = useState<OutputFormat>('webp');
  const [quality, setQuality] = useState(82);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (incoming: File[]) => {
      const valid = incoming.filter((f) => ACCEPTED_MIME_TYPES.includes(f.type));
      if (!valid.length) return;

      const entries: ProcessedFile[] = valid.map((file) => ({
        id: crypto.randomUUID(),
        file,
        status: 'processing',
      }));

      setFiles((prev) => [...entries, ...prev]);

      for (const entry of entries) {
        try {
          const result = await processImage(entry.file, format, quality / 100);
          setFiles((prev) => prev.map((f) => (f.id === entry.id ? { ...f, status: 'done', result } : f)));
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Conversion failed';
          setFiles((prev) => prev.map((f) => (f.id === entry.id ? { ...f, status: 'error', error } : f)));
        }
      }
    },
    [format, quality],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(Array.from(e.dataTransfer.files));
    },
    [processFiles],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(Array.from(e.target.files ?? []));
      e.target.value = '';
    },
    [processFiles],
  );

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.result?.objectUrl) URL.revokeObjectURL(target.result.objectUrl);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => {
        if (f.result?.objectUrl) URL.revokeObjectURL(f.result.objectUrl);
      });
      return [];
    });
  }, []);

  const handleDownloadAll = useCallback(async () => {
    const done = files.filter(
      (f): f is ProcessedFile & { result: ProcessedImage } => f.status === 'done' && f.result != null,
    );
    if (!done.length) return;
    await downloadAsZip(done.map((f) => ({ name: getOutputFilename(f.file.name, format), blob: f.result.blob })));
  }, [files, format]);

  const doneCount = files.filter((f) => f.status === 'done').length;

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Hero */}
      <section className='px-6 pt-20 pb-10 sm:pt-24 sm:pb-12 text-center'>
        <div className='flex items-center justify-center gap-3 mb-4'>
          <ImageDown className='h-10 w-10 text-primary' aria-hidden />
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl text-foreground'>Image Optimizer</h1>
        </div>
        <p className='text-base text-muted-foreground max-w-lg mx-auto leading-relaxed'>
          Compress and convert images to WebP or AVIF — entirely in your browser. Nothing is ever uploaded to a server.
        </p>
      </section>

      <section className='max-w-3xl mx-auto px-4 sm:px-6 pb-16 lg:pb-20 space-y-5'>
        {/* Drop zone */}
        <div
          className={[
            'rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer',
            'flex flex-col items-center justify-center gap-3 p-10 sm:p-14 text-center',
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50',
          ].join(' ')}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role='button'
          tabIndex={0}
          aria-label='Upload images to optimise'
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <Upload
            className={`h-10 w-10 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`}
            aria-hidden
          />
          <div>
            <p className='font-semibold text-foreground'>
              {isDragging ? 'Drop to convert' : 'Drag & drop images here'}
            </p>
            <p className='text-sm text-muted-foreground mt-1'>
              or click to browse &mdash; JPEG, PNG, WebP, GIF, BMP, TIFF
            </p>
          </div>
          <input
            ref={inputRef}
            type='file'
            accept={ACCEPTED_MIME_TYPES.join(',')}
            multiple
            onChange={handleFileInput}
            className='hidden'
            aria-hidden
          />
        </div>

        {/* Settings */}
        <Card className='shadow-[var(--shadow-sm)]'>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-base font-semibold text-foreground'>
              <Settings2 className='h-4 w-4 text-primary shrink-0' />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-wrap items-end gap-6'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Output format</Label>
              <div className='flex gap-2'>
                {(['webp', 'avif'] as OutputFormat[]).map((f) => (
                  <Button
                    key={f}
                    type='button'
                    variant={format === f ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setFormat(f)}
                    className='uppercase text-xs tracking-wide font-semibold'
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>

            <div className='flex-1 min-w-[180px] space-y-2'>
              <Label className='text-sm font-medium flex items-center justify-between'>
                Quality
                <span className='font-semibold tabular-nums text-primary'>{quality}%</span>
              </Label>
              <input
                type='range'
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className='w-full accent-[var(--primary)] cursor-pointer'
                aria-label={`Quality: ${quality}%`}
              />
              <div className='flex justify-between text-xs text-muted-foreground select-none'>
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {files.length > 0 && (
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-semibold text-foreground'>
                {doneCount} / {files.length} converted
              </p>
              <div className='flex gap-2'>
                {doneCount > 1 && (
                  <Button variant='outline' size='sm' onClick={handleDownloadAll} className='gap-2'>
                    <ArchiveIcon className='h-4 w-4' />
                    Download ZIP
                  </Button>
                )}
                <Button variant='ghost' size='sm' onClick={handleClearAll} className='gap-2 text-muted-foreground'>
                  <Trash2 className='h-4 w-4' />
                  Clear all
                </Button>
              </div>
            </div>

            <div className='space-y-2'>
              {files.map((f) => (
                <FileRow key={f.id} item={f} format={format} onRemove={() => handleRemove(f.id)} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function FileRow({ item, format, onRemove }: { item: ProcessedFile; format: OutputFormat; onRemove: () => void }) {
  const savings =
    item.result != null ? Math.round((1 - item.result.outputSize / item.result.originalSize) * 100) : null;

  const handleDownload = () => {
    if (!item.result) return;
    const a = document.createElement('a');
    a.href = item.result.objectUrl;
    a.download = getOutputFilename(item.file.name, format);
    a.click();
  };

  return (
    <div className='file-row-enter flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm'>
      {/* Status */}
      <span className='shrink-0' aria-hidden>
        {item.status === 'processing' && <Loader2 className='h-5 w-5 animate-spin text-primary' />}
        {item.status === 'done' && <CheckCircle2 className='h-5 w-5 text-emerald-500' />}
        {item.status === 'error' && <AlertCircle className='h-5 w-5 text-destructive' />}
      </span>

      {/* Filename */}
      <span className='flex-1 truncate font-medium text-foreground min-w-0'>{item.file.name}</span>

      {/* Size info */}
      {item.status === 'done' && item.result && (
        <span className='flex items-center gap-2 shrink-0 text-xs text-muted-foreground'>
          <span>{formatBytes(item.result.originalSize)}</span>
          <span aria-hidden>→</span>
          <span className='font-semibold text-foreground'>{formatBytes(item.result.outputSize)}</span>
          {savings !== null && (
            <span
              className={[
                'font-semibold tabular-nums rounded-full px-2 py-0.5 text-xs',
                savings > 0
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-muted text-muted-foreground',
              ].join(' ')}
            >
              {savings > 0 ? `-${savings}%` : savings === 0 ? '±0%' : `+${Math.abs(savings)}%`}
            </span>
          )}
        </span>
      )}

      {item.status === 'error' && (
        <span className='text-xs text-destructive shrink-0 max-w-[180px] truncate'>{item.error}</span>
      )}

      {/* Actions */}
      <div className='flex gap-1 shrink-0 ml-1'>
        {item.status === 'done' && (
          <Button variant='outline' size='sm' onClick={handleDownload} className='h-7 gap-1.5 px-2.5 text-xs'>
            <Download className='h-3.5 w-3.5' />
            Download
          </Button>
        )}
        <Button
          variant='ghost'
          size='sm'
          onClick={onRemove}
          className='h-7 w-7 p-0 text-muted-foreground hover:text-foreground'
          aria-label={`Remove ${item.file.name}`}
        >
          <X className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
