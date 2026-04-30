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
    <div className='min-h-screen text-foreground'>
      <section className='mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10'>
        <header className='mb-6 flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between'>
          <div className='max-w-2xl'>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground'>Image Optimizer</p>
            <h1 className='font-display mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>Compress browser-side images</h1>
            <p className='mt-3 text-sm leading-6 text-muted-foreground'>
              Convert images to WebP or AVIF in the browser. Files stay local, and results are ready for direct download.
            </p>
          </div>
          {files.length > 0 && (
            <div className='rounded-[var(--radius)] border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
              <span className='font-semibold text-foreground'>{doneCount}</span> of{' '}
              <span className='font-semibold text-foreground'>{files.length}</span> converted
            </div>
          )}
        </header>

        <div className='grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start'>
          <div className='space-y-5'>
        <div
          className={[
            'rounded-[var(--radius-xl)] border border-dashed transition duration-200 cursor-pointer',
            'flex min-h-[260px] flex-col items-center justify-center gap-4 p-8 text-center sm:p-10',
            isDragging
              ? 'border-[var(--brand-accent-strong)] bg-accent shadow-[var(--shadow-md)]'
              : 'border-input bg-card hover:border-[var(--brand-accent-strong)]/50 hover:bg-accent/60',
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
          <span className='flex h-14 w-14 items-center justify-center rounded-[var(--radius)] bg-accent text-[var(--brand-accent-strong)]'>
            <Upload className='h-6 w-6' aria-hidden />
          </span>
          <div>
            <p className='font-semibold text-foreground'>
              {isDragging ? 'Drop to convert' : 'Drag & drop images here'}
            </p>
            <p className='mt-1 text-sm text-muted-foreground'>
              Or click to browse. JPEG, PNG, WebP, GIF, BMP, and TIFF are supported.
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

          </div>

          <aside className='space-y-5 lg:sticky lg:top-20'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='font-display flex items-center gap-2 text-base font-semibold text-foreground'>
              <Settings2 className='h-4 w-4 shrink-0 text-[var(--brand-accent-strong)]' />
              Output settings
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-5'>
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
                    className='uppercase text-xs font-semibold tracking-wide'
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium flex items-center justify-between'>
                Quality
                <span className='font-semibold tabular-nums text-[var(--brand-accent-strong)]'>{quality}%</span>
              </Label>
              <input
                type='range'
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className='w-full cursor-pointer accent-[var(--brand-accent-strong)]'
                aria-label={`Quality: ${quality}%`}
              />
              <div className='flex justify-between text-xs text-muted-foreground select-none'>
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>
          </CardContent>
        </Card>
          </aside>
        </div>

        {files.length > 0 && (
          <div className='mt-6 space-y-3'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <p className='text-sm font-semibold text-foreground flex items-center gap-2'>
                <ImageDown className='h-4 w-4 text-[var(--brand-accent-strong)]' />
                Converted files
              </p>
              <div className='flex flex-wrap gap-2'>
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
    <div className='file-row-enter grid gap-3 rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-sm sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:items-center'>
      <span className='shrink-0' aria-hidden>
        {item.status === 'processing' && <Loader2 className='h-5 w-5 animate-spin text-[var(--brand-accent-strong)]' />}
        {item.status === 'done' && <CheckCircle2 className='h-5 w-5 text-[var(--success)]' />}
        {item.status === 'error' && <AlertCircle className='h-5 w-5 text-destructive' />}
      </span>

      <span className='flex-1 truncate font-medium text-foreground min-w-0'>{item.file.name}</span>

      {item.status === 'done' && item.result && (
        <span className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:justify-end'>
          <span>{formatBytes(item.result.originalSize)}</span>
          <span aria-hidden>→</span>
          <span className='font-semibold text-foreground'>{formatBytes(item.result.outputSize)}</span>
          {savings !== null && (
            <span
              className={[
                'font-semibold tabular-nums rounded-full px-2 py-0.5 text-xs',
                savings > 0
                  ? 'bg-[var(--success-soft)] text-[var(--success)]'
                  : 'bg-muted text-muted-foreground',
              ].join(' ')}
            >
              {savings > 0 ? `-${savings}%` : savings === 0 ? '±0%' : `+${Math.abs(savings)}%`}
            </span>
          )}
        </span>
      )}

      {item.status === 'error' && (
        <span className='text-xs text-destructive sm:max-w-[220px] sm:truncate'>{item.error}</span>
      )}

      <div className='flex gap-1 sm:justify-end'>
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
