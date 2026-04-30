export const OUTPUT_PRESETS = {
  widescreen: { label: '16:9', width: 1920, height: 1080 },
  square: { label: '1:1', width: 1400, height: 1400 },
  portrait: { label: '4:5', width: 1200, height: 1500 },
  story: { label: '9:16', width: 1080, height: 1920 },
} as const;

export type OutputPreset = keyof typeof OUTPUT_PRESETS;
export type BackgroundStyle = 'solid' | 'gradient' | 'pattern';
export type DeviceStyle = 'none' | 'phone' | 'browser';
export type LayoutStyle = 'center' | 'overlap' | 'row';

export interface MockupImage {
  image: HTMLImageElement;
  width: number;
  height: number;
}

export interface MockupPlacement {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
}

export interface PlacedMockupImage extends MockupImage {
  id: string;
  device: DeviceStyle;
  placement: MockupPlacement;
}

export interface MockupSettings {
  preset: OutputPreset;
  background: BackgroundStyle;
  layout: LayoutStyle;
  padding: number;
  radius: number;
  shadow: number;
  rotation: number;
  solidColor: string;
  gradientStart: string;
  gradientEnd: string;
  gradientAngle: number;
  patternBase: string;
  patternColor: string;
  patternOpacity: number;
  patternScale: number;
}

export interface RenderOptions {
  selectedId?: string | null;
  showControls?: boolean;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function createDefaultPlacements<T extends MockupImage>(
  images: T[],
  settings: MockupSettings,
  device: DeviceStyle = 'phone',
): Array<T & { device: DeviceStyle; placement: MockupPlacement }> {
  const preset = OUTPUT_PRESETS[settings.preset];
  const selected = images.slice(0, 3);
  const scale = Math.min(preset.width, preset.height) / 1200;
  const inset = settings.padding * scale;
  const stage: Rect = {
    x: inset,
    y: inset,
    width: preset.width - inset * 2,
    height: preset.height - inset * 2,
  };
  const slots = getSlots(stage, selected.length || 1, settings.layout, preset.width / preset.height);

  return selected.map((item, index) => {
    const slot = slots[index] ?? slots[0];
    return {
      ...item,
      device: hasDevice(item) ? item.device : device,
      placement: {
        centerX: clamp01((slot.x + slot.width / 2) / preset.width),
        centerY: clamp01((slot.y + slot.height / 2) / preset.height),
        width: clamp(slot.width / preset.width, 0.08, 0.96),
        height: clamp(slot.height / preset.height, 0.08, 0.96),
        rotation: getRotation(index, selected.length, settings.layout, settings.rotation),
        zIndex: index,
      },
    };
  });
}

export function renderMockup(
  canvas: HTMLCanvasElement,
  images: PlacedMockupImage[],
  settings: MockupSettings,
  options: RenderOptions = {},
) {
  const preset = OUTPUT_PRESETS[settings.preset];
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = preset.width;
  canvas.height = preset.height;
  ctx.clearRect(0, 0, preset.width, preset.height);
  drawBackground(ctx, preset.width, preset.height, settings);

  if (!images.length) {
    drawEmptyState(ctx, preset.width, preset.height);
    return;
  }

  const scale = Math.min(preset.width, preset.height) / 1200;
  const sorted = [...images].sort((a, b) => a.placement.zIndex - b.placement.zIndex);

  sorted.forEach((item) => {
    const slot = placementToRect(item.placement, preset.width, preset.height);
    drawDevice(ctx, item, slot, settings, item.placement.rotation, scale, item.device);
  });

  if (options.showControls && options.selectedId) {
    const selected = sorted.find((item) => item.id === options.selectedId);
    if (selected) drawSelectionControls(ctx, selected, preset.width, preset.height);
  }
}

function hasDevice(item: MockupImage): item is MockupImage & { device: DeviceStyle } {
  return 'device' in item && typeof item.device === 'string';
}

function clamp01(value: number) {
  return clamp(value, 0, 1);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function placementToRect(placement: MockupPlacement, width: number, height: number): Rect {
  const itemWidth = placement.width * width;
  const itemHeight = placement.height * height;
  return {
    x: placement.centerX * width - itemWidth / 2,
    y: placement.centerY * height - itemHeight / 2,
    width: itemWidth,
    height: itemHeight,
  };
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, settings: MockupSettings) {
  if (settings.background === 'solid') {
    ctx.fillStyle = settings.solidColor;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  if (settings.background === 'gradient') {
    const gradient = createAngledGradient(ctx, width, height, settings.gradientAngle);
    gradient.addColorStop(0, settings.gradientStart);
    gradient.addColorStop(1, settings.gradientEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  ctx.fillStyle = settings.patternBase;
  ctx.fillRect(0, 0, width, height);
  drawGridPattern(ctx, width, height, settings.patternColor, settings.patternOpacity, settings.patternScale);
  drawDotPattern(ctx, width, height, settings.patternColor, settings.patternOpacity * 0.65, settings.patternScale);
}

function createAngledGradient(ctx: CanvasRenderingContext2D, width: number, height: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  const length = Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians));
  const centerX = width / 2;
  const centerY = height / 2;
  const deltaX = Math.cos(radians) * length * 0.5;
  const deltaY = Math.sin(radians) * length * 0.5;
  return ctx.createLinearGradient(centerX - deltaX, centerY - deltaY, centerX + deltaX, centerY + deltaY);
}

function drawGridPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  opacity: number,
  scale: number,
) {
  ctx.save();
  ctx.strokeStyle = hexToRgba(color, opacity / 100);
  ctx.lineWidth = Math.max(1, Math.min(width, height) / 1200);
  const step = Math.max(16, scale);
  for (let x = 0; x <= width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDotPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  opacity: number,
  scale: number,
) {
  ctx.save();
  ctx.fillStyle = hexToRgba(color, opacity / 100);
  const step = Math.max(16, scale);
  const size = Math.max(1.5, scale / 18);
  for (let y = step / 2; y < height; y += step) {
    for (let x = step / 2; x < width; x += step) {
      if ((Math.round(x / step) + Math.round(y / step)) % 3 === 0) {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.restore();
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const safe = normalized.length === 3 ? normalized.split('').map((char) => char + char).join('') : normalized;
  const value = Number.parseInt(safe, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red},${green},${blue},${Math.max(0, Math.min(1, alpha))})`;
}

function drawEmptyState(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.68)';
  roundRect(ctx, width * 0.26, height * 0.36, width * 0.48, height * 0.28, 32);
  ctx.fill();
  ctx.fillStyle = '#16110f';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${Math.max(30, width * 0.03)}px Bespoke Slab Variable, DM Sans, sans-serif`;
  ctx.fillText('Upload screenshots to begin', width / 2, height / 2);
  ctx.restore();
}

function getSlots(stage: Rect, count: number, layout: LayoutStyle, aspect: number): Rect[] {
  if (count === 1) return [centerSlot(stage, 0.84, aspect)];

  if (layout === 'overlap') {
    if (count === 2) {
      const width = stage.width * 0.58;
      const height = stage.height * 0.82;
      return [
        { x: stage.x + stage.width * 0.05, y: stage.y + stage.height * 0.1, width, height },
        { x: stage.x + stage.width * 0.37, y: stage.y + stage.height * 0.04, width, height },
      ];
    }
    const width = stage.width * 0.36;
    const height = stage.height * 0.9;
    return [
      { x: stage.x + stage.width * 0.02, y: stage.y + stage.height * 0.08, width, height },
      { x: stage.x + stage.width * 0.32, y: stage.y, width, height },
      { x: stage.x + stage.width * 0.62, y: stage.y + stage.height * 0.08, width, height },
    ];
  }

  const gap = stage.width * (count === 2 ? 0.07 : 0.045);
  const width = (stage.width - gap * (count - 1)) / count;
  const height = stage.height * (count === 2 ? 0.86 : 0.92);
  return Array.from({ length: count }, (_, index) => ({
    x: stage.x + index * (width + gap),
    y: stage.y + (stage.height - height) / 2,
    width,
    height,
  }));
}

function centerSlot(stage: Rect, fill: number, aspect: number): Rect {
  const landscapeBoost = aspect > 1.2 ? 1 : 0.82;
  const width = stage.width * fill * landscapeBoost;
  const height = stage.height * fill;
  return {
    x: stage.x + (stage.width - width) / 2,
    y: stage.y + (stage.height - height) / 2,
    width,
    height,
  };
}

function getRotation(index: number, count: number, layout: LayoutStyle, amount: number) {
  if (layout === 'center') return 0;
  if (count === 1) return 0;
  if (count === 2) return (index === 0 ? -amount : amount) * 0.75;
  return [amount * -0.85, 0, amount * 0.85][index] ?? 0;
}

function drawDevice(
  ctx: CanvasRenderingContext2D,
  item: MockupImage,
  slot: Rect,
  settings: MockupSettings,
  degrees: number,
  scale: number,
  device: DeviceStyle,
) {
  ctx.save();
  ctx.translate(slot.x + slot.width / 2, slot.y + slot.height / 2);
  ctx.rotate((degrees * Math.PI) / 180);

  if (device === 'phone') drawPhone(ctx, item, slot.width, slot.height, settings, scale);
  else if (device === 'browser') drawBrowser(ctx, item, slot.width, slot.height, settings, scale);
  else drawBareImage(ctx, item, slot.width, slot.height, settings, scale);

  ctx.restore();
}

function drawBareImage(
  ctx: CanvasRenderingContext2D,
  item: MockupImage,
  maxWidth: number,
  maxHeight: number,
  settings: MockupSettings,
  scale: number,
) {
  const rect = fitRect(item.width / item.height, maxWidth, maxHeight);
  const radius = settings.radius * scale;
  drawShadow(ctx, settings.shadow, scale);
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, rect.x, rect.y, rect.width, rect.height, radius);
  ctx.fill();
  clipRounded(ctx, rect, radius);
  drawImageCover(ctx, item.image, rect, item.width / item.height);
  ctx.restore();
}

function drawPhone(
  ctx: CanvasRenderingContext2D,
  item: MockupImage,
  maxWidth: number,
  maxHeight: number,
  settings: MockupSettings,
  scale: number,
) {
  const outer = fitRect(9 / 19.2, maxWidth, maxHeight);
  const bezel = outer.width * 0.035;
  const screen = {
    x: outer.x + bezel,
    y: outer.y + bezel,
    width: outer.width - bezel * 2,
    height: outer.height - bezel * 2,
  };
  const radius = outer.width * 0.12;

  drawShadow(ctx, settings.shadow, scale);
  ctx.fillStyle = '#151515';
  roundRect(ctx, outer.x, outer.y, outer.width, outer.height, radius);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = Math.max(1, 2 * scale);
  ctx.stroke();

  ctx.fillStyle = '#f9fafb';
  roundRect(ctx, screen.x, screen.y, screen.width, screen.height, radius * 0.78);
  ctx.fill();
  clipRounded(ctx, screen, radius * 0.72);
  drawImageCover(ctx, item.image, screen, item.width / item.height);
  ctx.restore();

  ctx.fillStyle = '#050505';
  roundRect(ctx, -outer.width * 0.15, outer.y + outer.height * 0.036, outer.width * 0.3, outer.height * 0.038, 999);
  ctx.fill();
}

function drawBrowser(
  ctx: CanvasRenderingContext2D,
  item: MockupImage,
  maxWidth: number,
  maxHeight: number,
  settings: MockupSettings,
  scale: number,
) {
  const aspect = Math.min(1.9, Math.max(1.25, item.width / item.height));
  const outer = fitRect(aspect, maxWidth, maxHeight);
  const bar = Math.max(38 * scale, outer.height * 0.08);
  const radius = Math.max(14 * scale, settings.radius * scale * 0.8);
  const screen = { x: outer.x, y: outer.y + bar, width: outer.width, height: outer.height - bar };

  drawShadow(ctx, settings.shadow, scale);
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, outer.x, outer.y, outer.width, outer.height, radius);
  ctx.fill();
  ctx.fillStyle = '#f2f4f7';
  topRoundRect(ctx, outer.x, outer.y, outer.width, bar, radius);
  ctx.fill();
  ctx.fillStyle = '#ff5f57';
  ctx.beginPath();
  ctx.arc(outer.x + bar * 0.38, outer.y + bar / 2, bar * 0.11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffbd2e';
  ctx.beginPath();
  ctx.arc(outer.x + bar * 0.68, outer.y + bar / 2, bar * 0.11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#28c840';
  ctx.beginPath();
  ctx.arc(outer.x + bar * 0.98, outer.y + bar / 2, bar * 0.11, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  roundRect(ctx, outer.x + bar * 1.45, outer.y + bar * 0.25, outer.width * 0.42, bar * 0.5, 999);
  ctx.fill();

  clipBottomRounded(ctx, screen, radius);
  drawImageCover(ctx, item.image, screen, item.width / item.height);
  ctx.restore();
}

function drawSelectionControls(ctx: CanvasRenderingContext2D, item: PlacedMockupImage, width: number, height: number) {
  const rect = placementToRect(item.placement, width, height);
  const center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  const rotation = (item.placement.rotation * Math.PI) / 180;
  const corners = getRotatedCorners(rect, center, rotation);
  const rotateHandle = rotatePoint({ x: center.x, y: rect.y - Math.max(48, Math.min(width, height) * 0.04) }, center, rotation);

  ctx.save();
  ctx.strokeStyle = '#06c2a4';
  ctx.lineWidth = Math.max(3, Math.min(width, height) / 360);
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);
  corners.slice(1).forEach((corner) => ctx.lineTo(corner.x, corner.y));
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo((corners[0].x + corners[1].x) / 2, (corners[0].y + corners[1].y) / 2);
  ctx.lineTo(rotateHandle.x, rotateHandle.y);
  ctx.stroke();

  const handleSize = Math.max(18, Math.min(width, height) * 0.018);
  ctx.fillStyle = '#fffcf7';
  ctx.strokeStyle = '#06c2a4';
  corners.forEach((corner) => {
    roundRect(ctx, corner.x - handleSize / 2, corner.y - handleSize / 2, handleSize, handleSize, handleSize * 0.22);
    ctx.fill();
    ctx.stroke();
  });
  ctx.beginPath();
  ctx.arc(rotateHandle.x, rotateHandle.y, handleSize * 0.62, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function getRotatedCorners(rect: Rect, center: { x: number; y: number }, rotation: number) {
  return [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ].map((point) => rotatePoint(point, center, rotation));
}

function rotatePoint(point: { x: number; y: number }, center: { x: number; y: number }, radians: number) {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

function fitRect(aspect: number, maxWidth: number, maxHeight: number): Rect {
  let width = maxWidth;
  let height = width / aspect;
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspect;
  }
  return { x: -width / 2, y: -height / 2, width, height };
}

function drawImageCover(ctx: CanvasRenderingContext2D, image: HTMLImageElement, rect: Rect, imageAspect: number) {
  const rectAspect = rect.width / rect.height;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (imageAspect > rectAspect) {
    sourceWidth = sourceHeight * rectAspect;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = sourceWidth / rectAspect;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  }

  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, rect.x, rect.y, rect.width, rect.height);
}

function drawShadow(ctx: CanvasRenderingContext2D, amount: number, scale: number) {
  ctx.shadowColor = `rgba(22,17,15,${0.12 + amount / 260})`;
  ctx.shadowBlur = amount * scale;
  ctx.shadowOffsetY = amount * 0.32 * scale;
}

function clipRounded(ctx: CanvasRenderingContext2D, rect: Rect, radius: number) {
  ctx.save();
  roundRect(ctx, rect.x, rect.y, rect.width, rect.height, radius);
  ctx.clip();
}

function clipBottomRounded(ctx: CanvasRenderingContext2D, rect: Rect, radius: number) {
  ctx.save();
  bottomRoundRect(ctx, rect.x, rect.y, rect.width, rect.height, radius);
  ctx.clip();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function topRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function bottomRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y);
  ctx.closePath();
}
