import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SchemaTypeSelector } from "~/components/SchemaTypeSelector";
import { SchemaForm } from "~/components/SchemaForm";
import { JSONLDPreview } from "~/components/JSONLDPreview";
import type { SchemaType } from "~/types/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@upshift-tools/shared-ui";
import { Code2 } from "lucide-react";

export const Route = createFileRoute("/")({ component: SchemaMarkupPage });

function SchemaMarkupPage() {
  const [selectedSchema, setSelectedSchema] =
    useState<SchemaType>("Organization");
  const [jsonldData, setJsonldData] = useState<object | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <header className="mb-6 border-b border-border pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Schema Markup Generator</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Build structured data without hand-editing JSON
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Choose a schema type, fill the fields that matter, and copy valid JSON-LD for your page.
            </p>
          </header>

          <Card className="mb-5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Code2 className="h-4 w-4 text-[var(--brand-accent-strong)]" />
                Schema type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label htmlFor="schema-select" className="text-sm font-medium text-foreground">
                  Select schema type
                </label>
                <SchemaTypeSelector
                  id="schema-select"
                  value={selectedSchema}
                  onValueChange={setSelectedSchema}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
            <div className="space-y-6">
              <SchemaForm
                key={selectedSchema}
                schemaType={selectedSchema}
                onDataChange={setJsonldData}
              />
            </div>
            <div className="lg:sticky lg:top-20">
              <JSONLDPreview data={jsonldData} />
            </div>
          </div>
          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              Generated JSON-LD follows the{" "}
              <a
                href="https://schema.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--brand-accent-strong)] hover:underline"
              >
                schema.org
              </a>{" "}
              vocabulary
            </p>
          </div>
      </div>
    </div>
  );
}
