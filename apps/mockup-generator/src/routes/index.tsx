import { createFileRoute } from '@tanstack/react-router';
import { Button, Card, CardContent, CardHeader, CardTitle, Label } from '@upshift-tools/shared-ui';
import {
  CheckCircle2,
  Copy,
  Download,
  Globe2,
  ImagePlus,
  Link,
  LayoutTemplate,
  Loader2,
  MonitorSmartphone,
  Palette,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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
  sourceUrl?: string;
}

type MockupPresetId = 'upshift-warm' | 'aqua-showcase' | 'editorial-brown' | 'minimal-paper' | 'custom';

const DEFAULT_SETTINGS: MockupSettings = {
  preset: 'widescreen',
  background: 'pattern',
  device: 'phone',
  layout: 'overlap',
  count: 3,
  padding: 126,
  radius: 28,
  shadow: 44,
  rotation: 6,
  solidColor: '#f8f5ef',
  gradientStart: '#fffcf7',
  gradientEnd: '#f3ede3',
  gradientAngle: 120,
  patternBase: '#f8f5ef',
  patternColor: '#16110f',
  patternOpacity: 6,
  patternScale: 36,
};

const MOCKUP_PRESETS: Array<{
  id: Exclude<MockupPresetId, 'custom'>;
  name: string;
  description: string;
  swatch: string;
  settings: Partial<MockupSettings>;
}> = [
  {
    id: 'upshift-warm',
    name: 'Upshift Warm',
    description: 'Warm paper, subtle grid, calm depth.',
    swatch: 'linear-gradient(135deg, #f8f5ef, #fffcf7)',
    settings: {
      background: 'pattern',
      patternBase: '#f8f5ef',
      patternColor: '#16110f',
      patternOpacity: 6,
      patternScale: 36,
      shadow: 44,
      padding: 126,
      radius: 28,
      rotation: 6,
    },
  },
  {
    id: 'aqua-showcase',
    name: 'Aqua Showcase',
    description: 'Teal showcase for high-contrast case visuals.',
    swatch: 'linear-gradient(135deg, #41b8dc, #08758a)',
    settings: {
      background: 'gradient',
      gradientStart: '#41b8dc',
      gradientEnd: '#08758a',
      gradientAngle: 115,
      shadow: 62,
      padding: 118,
      radius: 34,
      rotation: 8,
    },
  },
  {
    id: 'editorial-brown',
    name: 'Editorial Brown',
    description: 'Premium warmth for crafted social posts.',
    swatch: 'linear-gradient(135deg, #f1dccb, #74442f)',
    settings: {
      background: 'gradient',
      gradientStart: '#f1dccb',
      gradientEnd: '#74442f',
      gradientAngle: 112,
      shadow: 54,
      padding: 122,
      radius: 30,
      rotation: 7,
    },
  },
  {
    id: 'minimal-paper',
    name: 'Minimal Paper',
    description: 'Clean solid surface with restrained shadows.',
    swatch: 'linear-gradient(135deg, #fffcf7, #f8f5ef)',
    settings: {
      background: 'solid',
      solidColor: '#fffcf7',
      shadow: 28,
      padding: 140,
      radius: 22,
      rotation: 0,
    },
  },
];

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const screenshotsRef = useRef<UploadedScreenshot[]>([]);
  const [screenshots, setScreenshots] = useState<UploadedScreenshot[]>([]);
  const [settings, setSettings] = useState<MockupSettings>(DEFAULT_SETTINGS);
  const [activePreset, setActivePreset] = useState<MockupPresetId>('upshift-warm');
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [captureUrl, setCaptureUrl] = useState('');
  const [captureStatus, setCaptureStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [captureMessage, setCaptureMessage] = useState('');

  const visibleCount = Math.min(settings.count, Math.max(1, screenshots.length || settings.count)) as 1 | 2 | 3;
  const preset = OUTPUT_PRESETS[settings.preset];
  const activePresetLabel = MOCKUP_PRESETS.find((item) => item.id === activePreset)?.name ?? 'Custom';

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

  const setCustomSetting = useCallback(<Key extends keyof MockupSettings>(key: Key, value: MockupSettings[Key]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setActivePreset('custom');
  }, []);

  const applyMockupPreset = useCallback((presetId: Exclude<MockupPresetId, 'custom'>) => {
    const nextPreset = MOCKUP_PRESETS.find((item) => item.id === presetId);
    if (!nextPreset) return;
    setSettings((prev) => ({ ...prev, ...nextPreset.settings }));
    setActivePreset(presetId);
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

  const addScreenshotFromUrl = useCallback(async () => {
    const normalizedUrl = normalizeCaptureUrl(captureUrl);
    if (!normalizedUrl) {
      setCaptureStatus('error');
      setCaptureMessage('Enter a valid website URL.');
      return;
    }

    setCaptureStatus('loading');
    setCaptureMessage('Taking screenshot...');

    try {
      const captured = await captureWebsiteScreenshot(normalizedUrl);
      setScreenshots((prev) => {
        const next = [...prev, captured].slice(-3);
        const removed = prev.filter((item) => !next.some((nextItem) => nextItem.id === item.id));
        removed.forEach((item) => URL.revokeObjectURL(item.objectUrl));
        setSettings((current) => ({ ...current, count: Math.min(next.length, 3) as 1 | 2 | 3 }));
        return next;
      });
      setCaptureStatus('success');
      setCaptureMessage('Website screenshot added.');
      window.setTimeout(() => setCaptureStatus('idle'), 1800);
    } catch (error) {
      setCaptureStatus('error');
      setCaptureMessage(error instanceof Error ? error.message : 'Could not capture this URL.');
    }
  }, [captureUrl]);

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
      setSettings((current) => ({
        ...current,
        count: Math.max(1, Math.min(current.count, next.length || 1)) as 1 | 2 | 3,
      }));
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setScreenshots((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.objectUrl));
      return [];
    });
    setSettings(DEFAULT_SETTINGS);
    setActivePreset('upshift-warm');
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
    <div className='min-h-screen text-foreground'>
      <section className='mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10'>
        <header className='mb-7 flex flex-col gap-3 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between'>
          <div className='max-w-3xl'>
            <p className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground'>
              <Sparkles className='h-3.5 w-3.5 text-(--brand-accent-strong)' aria-hidden />
              Mockup Generator
            </p>
            <h1 className='font-display mt-2 max-w-2xl text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl'>
              Turn screenshots into launch-ready images
            </h1>
            <p className='mt-3 max-w-2xl text-base leading-7 text-muted-foreground'>
              Compose up to 3 screenshots with warm brand presets, device frames, and canvas-native PNG export.
            </p>
          </div>
          <div className='rounded-(--radius) border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
            <span className='font-semibold text-foreground'>{preset.label}</span> · {preset.width}x{preset.height}
          </div>
        </header>

        <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start'>
          <main className='space-y-4 xl:sticky xl:top-20'>
            <div className='mockup-preview-enter overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-3 shadow-[var(--shadow-card)]'>
              <canvas ref={canvasRef} className='block h-auto w-full rounded-[calc(var(--radius-xl)-8px)]' />
            </div>

            <Card className='bg-card/95 backdrop-blur'>
              <CardContent className='flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between'>
                <div className='min-w-0'>
                  <p className='font-display text-base font-semibold text-foreground'>Export</p>
                  <p className='text-sm text-muted-foreground'>
                    {selectedImages.length > 0
                      ? `${selectedImages.length} screenshot${selectedImages.length === 1 ? '' : 's'} · ${activePresetLabel}`
                      : 'Preview renders locally from the same export canvas.'}
                  </p>
                </div>
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
              </CardContent>
            </Card>

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

          <aside className='space-y-5'>
            <div
              className={[
                'rounded-xl border border-dashed transition-colors duration-200',
                'flex min-h-[164px] cursor-pointer flex-col items-center justify-center gap-3 p-6 text-center',
                isDragging
                  ? 'border-(--brand-accent-strong) bg-accent shadow-(--shadow-md)'
                  : 'border-input bg-card hover:border-(--brand-accent-strong)/50 hover:bg-accent/60',
              ].join(' ')}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
              }}
              role='button'
              tabIndex={0}
              aria-label='Upload screenshots'
            >
              <span className='flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-accent text-[var(--brand-accent-strong)]'>
                <Upload className='h-5 w-5' aria-hidden />
              </span>
              <div>
                <p className='font-display text-xl font-semibold text-foreground'>
                  {isDragging ? 'Drop screenshots here' : 'Upload screenshots'}
                </p>
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

            <section className='rounded-[var(--radius-xl)] border border-border bg-card p-4'>
              <div className='flex flex-col gap-4 lg:flex-row items-center'>
                <div className='min-w-0 flex-1 space-y-2'>
                  <Label
                    htmlFor='website-screenshot-url'
                    className='flex items-center gap-2 text-sm font-semibold text-foreground'
                  >
                    <Globe2 className='h-4 w-4 text-[var(--brand-accent-strong)]' />
                    Capture from URL (This uses the microlink API which is limited to 50 requests per day.)
                  </Label>
                  <div className='flex min-h-11 items-center gap-2 rounded-[var(--radius)] border border-input bg-background px-3 transition focus-within:ring-2 focus-within:ring-ring'>
                    <Link className='h-4 w-4 shrink-0 text-muted-foreground' aria-hidden />
                    <input
                      id='website-screenshot-url'
                      type='url'
                      value={captureUrl}
                      onChange={(event) => {
                        setCaptureUrl(event.target.value);
                        if (captureStatus !== 'loading') {
                          setCaptureStatus('idle');
                          setCaptureMessage('');
                        }
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          addScreenshotFromUrl();
                        }
                      }}
                      placeholder='https://upshift.be'
                      className='min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground'
                    />
                  </div>
                  <p className='text-xs leading-5 text-muted-foreground'>
                    Captures are generated in-browser via a screenshot service, then added to the local canvas.
                  </p>
                </div>
                <Button
                  type='button'
                  onClick={addScreenshotFromUrl}
                  disabled={captureStatus === 'loading'}
                  className='gap-2 lg:min-w-36'
                >
                  {captureStatus === 'loading' ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <Globe2 className='h-4 w-4' />
                  )}
                  {captureStatus === 'loading' ? 'Capturing' : 'Capture URL'}
                </Button>
              </div>
              {captureMessage && (
                <p
                  className={[
                    'mt-3 flex items-center gap-2 rounded-[var(--radius)] px-3 py-2 text-sm',
                    captureStatus === 'error'
                      ? 'border border-destructive/30 bg-destructive/10 text-destructive'
                      : 'border border-[var(--success)]/25 bg-[var(--success-soft)] text-[var(--success)]',
                  ].join(' ')}
                  role={captureStatus === 'error' ? 'alert' : 'status'}
                >
                  {captureStatus === 'loading' ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : captureStatus === 'error' ? (
                    <X className='h-4 w-4' />
                  ) : (
                    <CheckCircle2 className='h-4 w-4' />
                  )}
                  {captureMessage}
                </p>
              )}
            </section>

            {screenshots.length > 0 && (
              <section aria-label='Uploaded screenshots' className='space-y-2'>
                <div className='flex items-center justify-between gap-3'>
                  <p className='text-sm font-semibold text-foreground'>Screenshots</p>
                  <p className='text-xs text-muted-foreground'>{screenshots.length}/3 loaded</p>
                </div>
                <div className='grid gap-2 sm:grid-cols-3'>
                  {screenshots.map((screenshot, index) => (
                    <div
                      key={screenshot.id}
                      className='flex items-center gap-3 rounded-[var(--radius)] border border-border bg-card p-2 text-sm'
                    >
                      <img
                        src={screenshot.objectUrl}
                        alt=''
                        width={64}
                        height={48}
                        className='h-12 w-16 shrink-0 rounded-[calc(var(--radius)-4px)] object-cover'
                      />
                      <div className='min-w-0 flex-1'>
                        <p className='truncate font-medium text-foreground'>
                          {screenshot.sourceUrl ?? screenshot.file.name}
                        </p>
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
              </section>
            )}

            <div className='space-y-4'>
              <ControlCard icon={<LayoutTemplate className='h-4 w-4' />} title='Canvas'>
                <SegmentedControl
                  label='Size'
                  value={settings.preset}
                  options={Object.entries(OUTPUT_PRESETS).map(([value, output]) => ({ label: output.label, value }))}
                  onChange={(value) => setCustomSetting('preset', value as OutputPreset)}
                />
              </ControlCard>

            <ControlCard icon={<ImagePlus className='h-4 w-4' />} title='Screenshots'>
              <SegmentedControl
                label='Visible shots'
                value={String(visibleCount)}
                options={[
                  { label: '1', value: '1' },
                  { label: '2', value: '2' },
                  { label: '3', value: '3' },
                ]}
                onChange={(value) => setCustomSetting('count', Number(value) as 1 | 2 | 3)}
              />
              <SegmentedControl
                label='Layout'
                value={settings.layout}
                options={[
                  { label: 'Center', value: 'center' },
                  { label: 'Overlap', value: 'overlap' },
                  { label: 'Row', value: 'row' },
                ]}
                onChange={(value) => setCustomSetting('layout', value as LayoutStyle)}
              />
            </ControlCard>

            <ControlCard
              icon={<Palette className='h-4 w-4' />}
              title='Background'
              action={
                <span className='rounded-full bg-accent px-2 py-1 text-xs font-semibold text-[var(--brand-accent-strong)]'>
                  {activePresetLabel}
                </span>
              }
            >
              <PresetGrid activePreset={activePreset} onSelect={applyMockupPreset} />
              <Divider />
              <SegmentedControl
                label='Mode'
                value={settings.background}
                options={[
                  { label: 'Solid', value: 'solid' },
                  { label: 'Gradient', value: 'gradient' },
                  { label: 'Pattern', value: 'pattern' },
                ]}
                onChange={(value) => setCustomSetting('background', value as BackgroundStyle)}
              />
              <BackgroundControls settings={settings} setCustomSetting={setCustomSetting} setSettings={setSettings} />
            </ControlCard>

            <ControlCard icon={<MonitorSmartphone className='h-4 w-4' />} title='Frame'>
              <SegmentedControl
                label='Device'
                value={settings.device}
                options={[
                  { label: 'None', value: 'none' },
                  { label: 'Phone', value: 'phone' },
                  { label: 'Browser', value: 'browser' },
                ]}
                onChange={(value) => setCustomSetting('device', value as DeviceStyle)}
              />
            </ControlCard>

            <ControlCard icon={<SlidersHorizontal className='h-4 w-4' />} title='Effects'>
              <RangeControl
                label='Padding'
                value={settings.padding}
                min={48}
                max={220}
                step={4}
                onChange={(value) => setCustomSetting('padding', value)}
              />
              <RangeControl
                label='Corner radius'
                value={settings.radius}
                min={0}
                max={64}
                step={2}
                onChange={(value) => setCustomSetting('radius', value)}
              />
              <RangeControl
                label='Shadow'
                value={settings.shadow}
                min={10}
                max={110}
                step={2}
                onChange={(value) => setCustomSetting('shadow', value)}
              />
              <RangeControl
                label='Rotation'
                value={settings.rotation}
                min={0}
                max={16}
                step={1}
                onChange={(value) => setCustomSetting('rotation', value)}
              />
              <Button type='button' variant='ghost' onClick={resetAll} className='w-full gap-2'>
                <RotateCcw className='h-4 w-4' />
                Reset all
              </Button>
            </ControlCard>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function ControlCard({
  icon,
  title,
  action,
  children,
}: {
  icon: ReactNode;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between gap-3 pb-2'>
        <CardTitle className='font-display flex items-center gap-2 text-lg font-semibold'>
          <span className='text-[var(--brand-accent-strong)]'>{icon}</span>
          {title}
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent className='space-y-5'>{children}</CardContent>
    </Card>
  );
}

function PresetGrid({
  activePreset,
  onSelect,
}: {
  activePreset: MockupPresetId;
  onSelect: (presetId: Exclude<MockupPresetId, 'custom'>) => void;
}) {
  return (
    <div className='grid gap-2'>
      {MOCKUP_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type='button'
          onClick={() => onSelect(preset.id)}
          className={[
            'grid min-h-[70px] grid-cols-[44px_minmax(0,1fr)] items-center gap-3 rounded-[var(--radius)] border p-2 text-left transition',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            activePreset === preset.id
              ? 'border-[var(--brand-accent-strong)] bg-accent/80'
              : 'border-border bg-transparent hover:bg-muted/60',
          ].join(' ')}
        >
          <span
            className='h-11 w-11 rounded-[calc(var(--radius)-2px)] border border-border'
            style={{ background: preset.swatch }}
          />
          <span className='min-w-0'>
            <span className='block font-semibold text-foreground'>{preset.name}</span>
            <span className='block truncate text-xs text-muted-foreground'>{preset.description}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function Divider() {
  return <div className='h-px bg-border' aria-hidden />;
}

function BackgroundControls({
  settings,
  setCustomSetting,
  setSettings,
}: {
  settings: MockupSettings;
  setCustomSetting: <Key extends keyof MockupSettings>(key: Key, value: MockupSettings[Key]) => void;
  setSettings: React.Dispatch<React.SetStateAction<MockupSettings>>;
}) {
  if (settings.background === 'solid') {
    return (
      <fieldset className='space-y-3'>
        <legend className='sr-only'>Solid background controls</legend>
        <ColorControl
          label='Solid color'
          value={settings.solidColor}
          onChange={(value) => setCustomSetting('solidColor', value)}
        />
        <BackgroundPresetRow
          presets={['#fffcf7', '#f8f5ef', '#f3ede3', '#16110f', '#e8f5f8']}
          onSelect={(value) => setCustomSetting('solidColor', value)}
        />
      </fieldset>
    );
  }

  if (settings.background === 'gradient') {
    return (
      <fieldset className='space-y-4'>
        <legend className='sr-only'>Gradient background controls</legend>
        <div className='grid grid-cols-2 gap-3'>
          <ColorControl
            label='Start'
            value={settings.gradientStart}
            onChange={(value) => setCustomSetting('gradientStart', value)}
          />
          <ColorControl
            label='End'
            value={settings.gradientEnd}
            onChange={(value) => setCustomSetting('gradientEnd', value)}
          />
        </div>
        <RangeControl
          label='Angle'
          value={settings.gradientAngle}
          min={0}
          max={360}
          step={5}
          onChange={(value) => setCustomSetting('gradientAngle', value)}
        />
        <div className='grid grid-cols-3 gap-2'>
          {[
            ['#fffcf7', '#f3ede3'],
            ['#f1dccb', '#74442f'],
            ['#41b8dc', '#08758a'],
          ].map(([start, end]) => (
            <button
              key={`${start}-${end}`}
              type='button'
              className='h-9 rounded-[calc(var(--radius)-4px)] border border-border shadow-[var(--shadow-sm)] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              style={{ background: `linear-gradient(115deg, ${start}, ${end})` }}
              onClick={() => {
                setSettings((prev) => ({ ...prev, gradientStart: start, gradientEnd: end }));
                setCustomSetting('background', 'gradient');
              }}
              aria-label={`Use ${start} to ${end} gradient`}
            />
          ))}
        </div>
      </fieldset>
    );
  }

  return (
    <fieldset className='space-y-4'>
      <legend className='sr-only'>Pattern background controls</legend>
      <div className='grid grid-cols-2 gap-3'>
        <ColorControl
          label='Base'
          value={settings.patternBase}
          onChange={(value) => setCustomSetting('patternBase', value)}
        />
        <ColorControl
          label='Pattern'
          value={settings.patternColor}
          onChange={(value) => setCustomSetting('patternColor', value)}
        />
      </div>
      <BackgroundPresetRow
        presets={['#f8f5ef', '#fffcf7', '#f3ede3', '#16110f']}
        onSelect={(value) => setCustomSetting('patternBase', value)}
      />
      <RangeControl
        label='Pattern opacity'
        value={settings.patternOpacity}
        min={1}
        max={28}
        step={1}
        onChange={(value) => setCustomSetting('patternOpacity', value)}
      />
      <RangeControl
        label='Pattern scale'
        value={settings.patternScale}
        min={18}
        max={84}
        step={2}
        onChange={(value) => setCustomSetting('patternScale', value)}
      />
    </fieldset>
  );
}

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className='block space-y-2'>
      <span className='text-xs font-semibold text-muted-foreground'>{label}</span>
      <span className='flex min-h-10 items-center gap-2 rounded-[calc(var(--radius)-4px)] border border-border bg-card px-2'>
        <input
          type='color'
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className='h-6 w-8 cursor-pointer border-0 bg-transparent p-0'
          aria-label={label}
        />
        <input
          type='text'
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className='min-w-0 flex-1 bg-transparent text-xs font-semibold uppercase text-foreground outline-none focus-visible:ring-0'
          aria-label={`${label} hex value`}
          spellCheck={false}
        />
      </span>
    </label>
  );
}

function BackgroundPresetRow({ presets, onSelect }: { presets: string[]; onSelect: (value: string) => void }) {
  return (
    <div className='flex flex-wrap gap-2'>
      {presets.map((color) => (
        <button
          key={color}
          type='button'
          className='h-7 w-7 rounded-full border border-border shadow-[var(--shadow-sm)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          style={{ backgroundColor: color }}
          onClick={() => onSelect(color)}
          aria-label={`Use ${color}`}
        />
      ))}
    </div>
  );
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
      <div className='grid grid-cols-[repeat(auto-fit,minmax(68px,1fr))] gap-1 rounded-[var(--radius)] border border-border bg-muted p-1'>
        {options.map((option) => (
          <button
            key={option.value}
            type='button'
            onClick={() => onChange(option.value)}
            className={[
              'min-h-9 rounded-[calc(var(--radius)-4px)] px-2 text-xs font-semibold transition-colors',
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

function normalizeCaptureUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function captureWebsiteScreenshot(url: string): Promise<UploadedScreenshot> {
  const screenshotUrl = buildScreenshotServiceUrl(url);
  const response = await fetch(screenshotUrl, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('The screenshot service could not load this page.');
  }

  const blob = await response.blob();
  if (!blob.type.startsWith('image/')) {
    throw new Error('The screenshot service did not return an image.');
  }

  const hostname = new URL(url).hostname.replace(/^www\./, '');
  const extension = blob.type.includes('jpeg') ? 'jpg' : blob.type.includes('webp') ? 'webp' : 'png';
  const file = new File([blob], `${hostname}-screenshot.${extension}`, { type: blob.type });
  const screenshot = await loadScreenshot(file);
  return { ...screenshot, sourceUrl: url };
}

function buildScreenshotServiceUrl(url: string) {
  const params = new URLSearchParams({
    url,
    screenshot: 'true',
    meta: 'false',
    'viewport.width': '1440',
    'viewport.height': '1800',
    waitUntil: 'networkidle2',
    delay: '1200',
    embed: 'screenshot.url',
  });

  return `https://api.microlink.io/?${params.toString()}`;
}
