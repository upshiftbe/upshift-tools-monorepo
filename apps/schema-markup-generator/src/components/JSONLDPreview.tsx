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
          <CardTitle>JSON-LD Output</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <Copy className="h-5 w-5 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">Fill out the form to generate JSON-LD markup</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>JSON-LD Output</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2 transition-all duration-150 active:scale-95"
          >
            {status === 'copied' ? (
              <>
                <Check className="h-4 w-4 text-[var(--brand-accent)]" />
                <span className="text-[var(--brand-accent)]">Copied!</span>
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
        <pre className="bg-muted p-4 rounded-md overflow-auto text-sm schema-code-block">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
        <div className="mt-4 p-4 bg-[var(--brand-accent)]/5 border border-[var(--brand-accent)]/15 rounded-md">
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
