export type OutputFormat = 'webp' | 'avif';

export interface ProcessedImage {
  originalSize: number;
  blob: Blob;
  outputSize: number;
  format: OutputFormat;
  objectUrl: string;
}

export function processImage(
  file: File,
  format: OutputFormat,
  /** 0–1 quality value passed to canvas.toBlob */
  quality: number,
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const srcUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(srcUrl);

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error(`${format.toUpperCase()} encoding is not supported in this browser`));
            return;
          }
          resolve({
            originalSize: file.size,
            blob,
            outputSize: blob.size,
            format,
            objectUrl: URL.createObjectURL(blob),
          });
        },
        `image/${format}`,
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(srcUrl);
      reject(new Error('Failed to decode image'));
    };

    img.src = srcUrl;
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function getOutputFilename(originalName: string, format: OutputFormat): string {
  const base = originalName.replace(/\.[^.]+$/, '');
  return `${base}.${format}`;
}
