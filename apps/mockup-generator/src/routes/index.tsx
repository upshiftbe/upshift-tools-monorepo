import { createFileRoute } from '@tanstack/react-router';
import { Button, Card, CardContent, CardHeader, CardTitle, Label } from '@upshift-tools/shared-ui';
import {
  CheckCircle2,
  Copy,
  Download,
  ImagePlus,
  Loader2,
  MonitorSmartphone,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  OUTPUT_PRESETS,
  renderMockup,
  type BackgroundStyle,
  type DeviceStyle,
  type LayoutStyle,
  type MockupImage,
  type MockupSettings,
  type OutputPreset,
} from '~/lib/mockupRenderer';

export const Route = createFileRoute('/')({ component: App });

const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface UploadedScreenshot extends MockupImage {
  id: string;
  file: File;
  objectUrl: string;
}

const DEFAULT_SETTINGS: MockupSettings = {
  preset: 'widescreen',
  background: 'gradient',
  device: 'phone',
  layout: 'overlap',
  count: 3,
  padding: 118,
  radius: 34,
  shadow: 62,
  rotation: 8,
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const screenshotsRef = useRef<UploadedScreenshot[]>([]);
  const [screenshots, setScreenshots] = useState<UploadedScreenshot[]>([]);
  const [settings, setSettings] = useState<MockupSettings>(DEFAULT_SETTINGS);
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const visibleCount = Math.min(settings.count, Math.max(1, screenshots.length || settings.count)) as 1 | 2 | 3;
  const preset = OUTPUT_PRESETS[settings.preset];

  useEffect(() => {
    if (!canvasRef.current) return;
    renderMockup(canvasRef.current, screenshots, { ...settings, count: visibleCount });
  }, [screenshots, settings, visibleCount]);

  useEffect(() => {
    screenshotsRef.current = screenshots;
  }, [screenshots]);

  useEffect(() => {
    return () => {
      screenshotsRef.current.forEach((screenshot) => URL.revokeObjectURL(screenshot.objectUrl));
    };
  }, []);

  const processFiles = useCallback(async (incoming: File[]) => {
    const valid = incoming.filter((file) => ACCEPTED_MIME_TYPES.includes(file.type)).slice(0, 3);
    if (!valid.length) return;

    const loaded = await Promise.all(valid.map(loadScreenshot));
    setScreenshots((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.objectUrl));
      return loaded;
    });
    setSettings((prev) => ({ ...prev, count: Math.min(loaded.length, 3) as 1 | 2 | 3 }));
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      processFiles(Array.from(event.dataTransfer.files));
    },
    [processFiles],
  );

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(Array.from(event.target.files ?? []));
      event.target.value = '';
    },
    [processFiles],
  );

  const removeScreenshot = useCallback((id: string) => {
    setScreenshots((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.objectUrl);
      const next = prev.filter((item) => item.id !== id);
      setSettings((current) => ({ ...current, count: Math.max(1, Math.min(current.count, next.length || 1)) as 1 | 2 | 3 }));
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setScreenshots((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.objectUrl));
      return [];
    });
    setSettings(DEFAULT_SETTINGS);
    setCopyStatus('idle');
  }, []);

  const exportBlob = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png', 1));
  }, []);

  const downloadPng = useCallback(async () => {
    setIsExporting(true);
    const blob = await exportBlob();
    setIsExporting(false);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `mockup-${OUTPUT_PRESETS[settings.preset].label.replace(':', 'x')}.png`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [exportBlob, settings.preset]);

  const copyPng = useCallback(async () => {
    setIsExporting(true);
    setCopyStatus('idle');
    const blob = await exportBlob();
    setIsExporting(false);
    if (!blob || !navigator.clipboard || typeof ClipboardItem === 'undefined') {
      setCopyStatus('error');
      return;
    }

    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopyStatus('copied');
      window.setTimeout(() => setCopyStatus('idle'), 1800);
    } catch {
      setCopyStatus('error');
    }
  }, [exportBlob]);

  const selectedImages = useMemo(() => screenshots.slice(0, visibleCount), [screenshots, visibleCount]);

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <section className='mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10'>
        <header className='mb-6 flex flex-col gap-3 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between'>
          <div className='max-w-3xl'>
            <p className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground'>
              <Sparkles className='h-3.5 w-3.5 text-[var(--brand-accent-strong)]' />
              Mockup Generator
            </p>
            <h1 className='mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>
              Turn screenshots into polished launch images
            </h1>
            <p className='mt-3 text-sm leading-6 text-muted-foreground'>
              Compose up to three screenshots into copyable PNG assets with canvas-rendered device frames, social presets,
              gradients, shadows, and fast browser-only export.
            </p>
          </div>
          <div className='rounded-[var(--radius)] border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
            <span className='font-semibold text-foreground'>{preset.label}</span> · {preset.width}x{preset.height}
          </div>
        </header>

        <div className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start'>
          <main className='space-y-5'>
            <div
              className={[
                'rounded-[var(--radius-xl)] border border-dashed transition duration-200',
                'flex min-h-[172px] cursor-pointer flex-col items-center justify-center gap-3 p-6 text-center',
                isDragging
                  ? 'border-[var(--brand-accent-strong)] bg-accent shadow-[var(--shadow-md)]'
                  : 'border-input bg-card hover:border-[var(--brand-accent-strong)]/50 hover:bg-accent/60',
              ].join(' ')}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(event) => event.key === 'Enter' && inputRef.current?.click()}
              role='button'
              tabIndex={0}
              aria-label='Upload screenshots'
            >
              <span className='flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-accent text-[var(--brand-accent-strong)]'>
                <Upload className='h-5 w-5' aria-hidden />
              </span>
              <div>
                <p className='font-semibold text-foreground'>{isDragging ? 'Drop screenshots here' : 'Upload screenshots'}</p>
                <p className='mt-1 text-sm text-muted-foreground'>Add 1-3 PNG, JPEG, WebP, or GIF files.</p>
              </div>
              <input
                ref={inputRef}
                type='file'
                accept={ACCEPTED_MIME_TYPES.join(',')}
                multiple
                onChange={handleInput}
                className='hidden'
                aria-hidden
              />
            </div>

            {screenshots.length > 0 && (
              <div className='grid gap-2 sm:grid-cols-3'>
                {screenshots.map((screenshot, index) => (
                  <div
                    key={screenshot.id}
                    className='flex items-center gap-3 rounded-[var(--radius)] border border-border bg-card p-2 text-sm'
                  >
                    <img
                      src={screenshot.objectUrl}
                      alt=''
                      className='h-12 w-16 shrink-0 rounded-[calc(var(--radius)-4px)] object-cover'
                    />
                    <div className='min-w-0 flex-1'>
                      <p className='truncate font-medium text-foreground'>{screenshot.file.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        Shot {index + 1} · {screenshot.width}x{screenshot.height}
                      </p>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0 text-muted-foreground'
                      onClick={() => removeScreenshot(screenshot.id)}
                      aria-label={`Remove ${screenshot.file.name}`}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className='mockup-preview-enter overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-3 shadow-[var(--shadow-sm)]'>
              <canvas ref={canvasRef} className='block h-auto w-full rounded-[calc(var(--radius-xl)-8px)]' />
            </div>

            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
              <p className='text-sm text-muted-foreground'>
                {selectedImages.length > 0
                  ? `${selectedImages.length} screenshot${selectedImages.length === 1 ? '' : 's'} in the current composition.`
                  : 'The preview is generated locally and exported from the same canvas.'}
              </p>
              <div className='flex flex-wrap gap-2'>
                <Button type='button' variant='outline' onClick={copyPng} className='gap-2' disabled={isExporting}>
                  {isExporting ? <Loader2 className='h-4 w-4 animate-spin' /> : <Copy className='h-4 w-4' />}
                  {copyStatus === 'copied' ? 'Copied' : 'Copy PNG'}
                </Button>
                <Button type='button' onClick={downloadPng} className='gap-2' disabled={isExporting}>
                  <Download className='h-4 w-4' />
                  Download PNG
                </Button>
              </div>
            </div>

            {copyStatus === 'error' && (
              <div className='flex items-center gap-2 rounded-[var(--radius)] border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
                <Trash2 className='h-4 w-4' />
                Copy is not available in this browser context. Download still works.
              </div>
            )}
            {copyStatus === 'copied' && (
              <div className='flex items-center gap-2 rounded-[var(--radius)] border border-[var(--success)]/25 bg-[var(--success-soft)] px-3 py-2 text-sm text-[var(--success)]'>
                <CheckCircle2 className='h-4 w-4' />
                PNG copied to clipboard.
              </div>
            )}
          </main>

          <aside className='space-y-5 xl:sticky xl:top-20'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='flex items-center gap-2 text-base font-semibold'>
                  <ImagePlus className='h-4 w-4 text-[var(--brand-accent-strong)]' />
                  Composition
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-5'>
                <SegmentedControl
                  label='Screenshots'
                  value={String(visibleCount)}
                  options={[
                    { label: '1', value: '1' },
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                  ]}
                  onChange={(value) => updateSetting(setSettings, 'count', Number(value) as 1 | 2 | 3)}
                />
                <SegmentedControl
                  label='Preset'
                  value={settings.preset}
                  options={Object.entries(OUTPUT_PRESETS).map(([value, output]) => ({ label: output.label, value }))}
                  onChange={(value) => updateSetting(setSettings, 'preset', value as OutputPreset)}
                />
                <SegmentedControl
                  label='Layout'
                  value={settings.layout}
                  options={[
                    { label: 'Center', value: 'center' },
                    { label: 'Overlap', value: 'overlap' },
                    { label: 'Row', value: 'row' },
                  ]}
                  onChange={(value) => updateSetting(setSettings, 'layout', value as LayoutStyle)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='flex items-center gap-2 text-base font-semibold'>
                  <MonitorSmartphone className='h-4 w-4 text-[var(--brand-accent-strong)]' />
                  Presentation
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-5'>
                <SegmentedControl
                  label='Frame'
                  value={settings.device}
                  options={[
                    { label: 'None', value: 'none' },
                    { label: 'Phone', value: 'phone' },
                    { label: 'Browser', value: 'browser' },
                  ]}
                  onChange={(value) => updateSetting(setSettings, 'device', value as DeviceStyle)}
                />
                <SegmentedControl
                  label='Background'
                  value={settings.background}
                  options={[
                    { label: 'Solid', value: 'solid' },
                    { label: 'Gradient', value: 'gradient' },
                    { label: 'Warm', value: 'warm' },
                    { label: 'Pattern', value: 'pattern' },
                  ]}
                  onChange={(value) => updateSetting(setSettings, 'background', value as BackgroundStyle)}
                />
                <RangeControl
                  label='Padding'
                  value={settings.padding}
                  min={48}
                  max={220}
                  step={4}
                  onChange={(value) => updateSetting(setSettings, 'padding', value)}
                />
                <RangeControl
                  label='Corner radius'
                  value={settings.radius}
                  min={0}
                  max={64}
                  step={2}
                  onChange={(value) => updateSetting(setSettings, 'radius', value)}
                />
                <RangeControl
                  label='Shadow'
                  value={settings.shadow}
                  min={10}
                  max={110}
                  step={2}
                  onChange={(value) => updateSetting(setSettings, 'shadow', value)}
                />
                <RangeControl
                  label='Rotation'
                  value={settings.rotation}
                  min={0}
                  max={16}
                  step={1}
                  onChange={(value) => updateSetting(setSettings, 'rotation', value)}
                />
                <Button type='button' variant='ghost' onClick={resetAll} className='w-full gap-2'>
                  <RotateCcw className='h-4 w-4' />
                  Reset
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}

function updateSetting<Key extends keyof MockupSettings>(
  setSettings: React.Dispatch<React.SetStateAction<MockupSettings>>,
  key: Key,
  value: MockupSettings[Key],
) {
  setSettings((prev) => ({ ...prev, [key]: value }));
}

function SegmentedControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className='space-y-2'>
      <Label className='text-sm font-medium'>{label}</Label>
      <div className='grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] gap-1 rounded-[var(--radius)] border border-border bg-muted p-1'>
        {options.map((option) => (
          <button
            key={option.value}
            type='button'
            onClick={() => onChange(option.value)}
            className={[
              'min-h-9 rounded-[calc(var(--radius)-4px)] px-2 text-xs font-semibold transition',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              value === option.value
                ? 'bg-card text-foreground shadow-[var(--shadow-sm)]'
                : 'text-muted-foreground hover:bg-card/70 hover:text-foreground',
            ].join(' ')}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className='space-y-2'>
      <Label className='flex items-center justify-between text-sm font-medium'>
        {label}
        <span className='text-xs font-semibold tabular-nums text-[var(--brand-accent-strong)]'>{value}</span>
      </Label>
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className='w-full cursor-pointer accent-[var(--brand-accent-strong)]'
        aria-label={`${label}: ${value}`}
      />
    </div>
  );
}

async function loadScreenshot(file: File): Promise<UploadedScreenshot> {
  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.src = objectUrl;
  await image.decode();
  return {
    id: crypto.randomUUID(),
    file,
    objectUrl,
    image,
    width: image.naturalWidth,
    height: image.naturalHeight,
  };
}
