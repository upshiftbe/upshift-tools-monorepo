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
    <div className="bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Schema Markup Generator</h1>
            <p className="text-muted-foreground">
              Generate JSON-LD structured data for your website
            </p>
          </div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <label htmlFor="schema-select" className="text-sm font-medium">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <SchemaForm
                key={selectedSchema}
                schemaType={selectedSchema}
                onDataChange={setJsonldData}
              />
            </div>
            <div>
              <JSONLDPreview data={jsonldData} />
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Generated JSON-LD follows the{" "}
              <a
                href="https://schema.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
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
