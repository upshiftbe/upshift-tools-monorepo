import { Card, CardContent, CardHeader, CardTitle, Button } from '@upshift-tools/shared-ui';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface JSONLDPreviewProps {
  data: object | null;
}

export const JSONLDPreview = ({ data }: JSONLDPreviewProps) => {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => {
    if (status === 'idle') return;
    const id = setTimeout(() => setStatus('idle'), 2500);
    return () => clearTimeout(id);
  }, [status]);

  const handleCopy = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setStatus('copied');
    } catch {
      setStatus('error');
    }
  };

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display">JSON-LD output</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-[var(--radius)] border border-dashed border-input bg-muted/40 px-6 py-8 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius)] bg-accent">
              <Copy className="h-5 w-5 text-[var(--brand-accent-strong)]" />
            </div>
            <p className="text-sm font-medium text-foreground">Your markup will appear here</p>
            <p className="max-w-xs text-sm text-muted-foreground">Fill the required fields to generate copy-ready JSON-LD.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display">JSON-LD output</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2 transition-all duration-150 active:scale-95"
          >
            {status === 'copied' ? (
              <>
                <Check className="h-4 w-4 text-[var(--brand-accent-strong)]" />
                <span className="text-[var(--brand-accent-strong)]">Copied</span>
              </>
            ) : status === 'error' ? (
              <>
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-destructive">Failed</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="max-h-[520px] overflow-auto rounded-[var(--radius)] border border-border bg-muted p-4 text-sm schema-code-block">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
        <div className="mt-4 rounded-[var(--radius)] border border-[var(--brand-accent-strong)]/20 bg-accent p-4">
          <p className="text-sm text-foreground/80">
            <strong>How to use:</strong> Copy the JSON-LD code above and paste it into a{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
              &lt;script type=&quot;application/ld+json&quot;&gt;
            </code>{' '}
            tag in your HTML page.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
