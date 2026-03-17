import { zipSync } from 'fflate';

export async function downloadAsZip(
  files: Array<{ name: string; blob: Blob }>,
  zipFilename = 'optimized-images.zip',
): Promise<void> {
  const entries = await Promise.all(
    files.map(async (f) => {
      const buffer = await f.blob.arrayBuffer();
      return { name: f.name, data: new Uint8Array(buffer) };
    }),
  );

  const zipInput: Record<string, Uint8Array> = {};
  for (const entry of entries) {
    zipInput[entry.name] = entry.data;
  }

  const zipped = zipSync(zipInput);
  const blob = new Blob([zipped.buffer as ArrayBuffer], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = zipFilename;
  a.click();

  URL.revokeObjectURL(url);
}
