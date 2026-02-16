import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface JSONLDPreviewProps {
  data: object | null
}

export const JSONLDPreview = ({ data }: JSONLDPreviewProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!data) return
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>JSON-LD Output</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Fill out the form to generate JSON-LD markup</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>JSON-LD Output</CardTitle>
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
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
        <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-md">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>How to use:</strong> Copy the JSON-LD code above and paste it into a{' '}
            <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">&lt;script type=&quot;application/ld+json&quot;&gt;</code> tag in your HTML page.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
