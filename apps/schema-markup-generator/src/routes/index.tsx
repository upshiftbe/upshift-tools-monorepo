import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SchemaTypeSelector } from "~/components/SchemaTypeSelector";
import { SchemaForm } from "~/components/SchemaForm";
import { JSONLDPreview } from "~/components/JSONLDPreview";
import type { SchemaType } from "~/types/schema";
import { Card, CardContent } from "@upshift-tools/shared-ui";

export const Route = createFileRoute("/")({ component: SchemaMarkupPage });

function SchemaMarkupPage() {
  const [selectedSchema, setSelectedSchema] =
    useState<SchemaType>("Organization");
  const [jsonldData, setJsonldData] = useState<object | null>(null);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-3">
              Schema Markup Generator
            </h1>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Generate JSON-LD structured data for your website
            </p>
          </header>
          <Card className="mb-8 shadow-[var(--shadow-sm)]">
            <CardContent className="pt-6 pb-6">
              <div className="space-y-2">
                <label htmlFor="schema-select" className="text-sm font-medium text-foreground">
                  Select Schema Type
                </label>
                <SchemaTypeSelector
                  id="schema-select"
                  value={selectedSchema}
                  onValueChange={setSelectedSchema}
                />
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
            <div className="space-y-6">
              <SchemaForm
                key={selectedSchema}
                schemaType={selectedSchema}
                onDataChange={setJsonldData}
              />
            </div>
            <div className="lg:sticky lg:top-8">
              <JSONLDPreview data={jsonldData} />
            </div>
          </div>
          <div className="mt-10 sm:mt-12 text-center text-sm text-muted-foreground">
            <p>
              Generated JSON-LD follows the{" "}
              <a
                href="https://schema.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                schema.org
              </a>{" "}
              vocabulary
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
