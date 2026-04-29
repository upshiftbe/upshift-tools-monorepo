export const OUTPUT_PRESETS = {
  widescreen: { label: '16:9', width: 1920, height: 1080 },
  square: { label: '1:1', width: 1400, height: 1400 },
  portrait: { label: '4:5', width: 1200, height: 1500 },
  story: { label: '9:16', width: 1080, height: 1920 },
} as const;

export type OutputPreset = keyof typeof OUTPUT_PRESETS;
export type BackgroundStyle = 'solid' | 'gradient' | 'warm' | 'pattern';
export type DeviceStyle = 'none' | 'phone' | 'browser';
export type LayoutStyle = 'center' | 'overlap' | 'row';

export interface MockupImage {
  image: HTMLImageElement;
  width: number;
  height: number;
}

export interface MockupSettings {
  preset: OutputPreset;
  background: BackgroundStyle;
  device: DeviceStyle;
  layout: LayoutStyle;
  count: 1 | 2 | 3;
  padding: number;
  radius: number;
  shadow: number;
  rotation: number;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function renderMockup(canvas: HTMLCanvasElement, images: MockupImage[], settings: MockupSettings) {
  const preset = OUTPUT_PRESETS[settings.preset];
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = preset.width;
  canvas.height = preset.height;
  ctx.clearRect(0, 0, preset.width, preset.height);
  drawBackground(ctx, preset.width, preset.height, settings.background);

  const selected = images.slice(0, settings.count);
  if (!selected.length) {
    drawEmptyState(ctx, preset.width, preset.height);
    return;
  }

  const scale = Math.min(preset.width, preset.height) / 1200;
  const inset = settings.padding * scale;
  const stage: Rect = {
    x: inset,
    y: inset,
    width: preset.width - inset * 2,
    height: preset.height - inset * 2,
  };
  const slots = getSlots(stage, selected.length, settings.layout, preset.width / preset.height);

  selected.forEach((item, index) => {
    const rotation = getRotation(index, selected.length, settings.layout, settings.rotation);
    drawDevice(ctx, item, slots[index], settings, rotation, scale);
  });
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, background: BackgroundStyle) {
  if (background === 'solid') {
    ctx.fillStyle = '#e8f5f8';
    ctx.fillRect(0, 0, width, height);
    return;
  }

  if (background === 'gradient') {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#41b8dc');
    gradient.addColorStop(0.48, '#20a9c7');
    gradient.addColorStop(1, '#08758a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    drawWavePattern(ctx, width, height, 'rgba(255,255,255,0.14)');
    return;
  }

  if (background === 'pattern') {
    const gradient = ctx.createLinearGradient(0, height, width, 0);
    gradient.addColorStop(0, '#f1dccb');
    gradient.addColorStop(0.5, '#c9855d');
    gradient.addColorStop(1, '#74442f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    drawNoiseDots(ctx, width, height);
    return;
  }

  ctx.fillStyle = '#f8f5ef';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(22,17,15,0.06)';
  ctx.lineWidth = 1;
  const step = Math.max(24, Math.round(Math.min(width, height) / 34));
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
}

function drawWavePattern(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, width / 900);
  const amplitude = Math.max(5, height / 150);
  const spacing = Math.max(18, height / 42);
  for (let y = -spacing; y < height + spacing; y += spacing) {
    ctx.beginPath();
    for (let x = 0; x <= width; x += 18) {
      const waveY = y + Math.sin(x / 34) * amplitude;
      if (x === 0) ctx.moveTo(x, waveY);
      else ctx.lineTo(x, waveY);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawNoiseDots(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let y = 0; y < height; y += 26) {
    for (let x = 0; x < width; x += 26) {
      if ((x + y) % 78 === 0) ctx.fillRect(x, y, 2, 2);
    }
  }
  ctx.restore();
}

function drawEmptyState(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.68)';
  roundRect(ctx, width * 0.26, height * 0.36, width * 0.48, height * 0.28, 32);
  ctx.fill();
  ctx.fillStyle = '#16110f';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${Math.max(30, width * 0.03)}px Outfit, sans-serif`;
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
) {
  ctx.save();
  ctx.translate(slot.x + slot.width / 2, slot.y + slot.height / 2);
  ctx.rotate((degrees * Math.PI) / 180);

  if (settings.device === 'phone') drawPhone(ctx, item, slot.width, slot.height, settings, scale);
  else if (settings.device === 'browser') drawBrowser(ctx, item, slot.width, slot.height, settings, scale);
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
