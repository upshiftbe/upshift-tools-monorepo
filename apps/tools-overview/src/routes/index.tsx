import { createFileRoute } from "@tanstack/react-router";
import {
  AppShell,
  Card,
  CardContent,
  CardHeader,
} from "@upshift-tools/shared-ui";
import { Code2, ExternalLink, Mail, QrCode } from "lucide-react";
import { TOOLS, getToolHref, type Tool } from "~/config/tools";

const ICONS = { QrCode, Mail, Code2 } as const;

export const Route = createFileRoute("/")({ component: OverviewPage });

function OverviewPage() {
  return (
    <AppShell
      navbar={{
        logo: (
          <>
            <QrCode className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">
              Upshift Tools
            </span>
          </>
        ),
        logoHref: "/",
        links: TOOLS.map((t) => ({ label: t.name, href: getToolHref(t) })),
      }}
      footer={true}
      mainClassName="flex flex-col page-gradient-bg grain"
      dataShellVariant="soft"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-14 sm:py-20">
        <div className="glass-panel p-6 sm:p-8 md:p-10">
          <header className="mb-16 text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-[2.5rem]">
              Upshift Tools
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Free, open-source utilities for developers and teams
            </p>
          </header>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const Icon = ICONS[tool.icon as keyof typeof ICONS] ?? Code2;
  const href = getToolHref(tool);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <Card
        className="tools-card-reveal group relative flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-(--shadow-lg) active:scale-[0.98] focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        <CardHeader>
          <div
            className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${tool.color} text-white shadow-sm`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold group-hover:text-foreground">
            {tool.name}
          </h2>
        </CardHeader>
        <CardContent className="flex-1 pt-0">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {tool.description}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
            Open tool
            <ExternalLink className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </CardContent>
      </Card>
    </a>
  );
}
