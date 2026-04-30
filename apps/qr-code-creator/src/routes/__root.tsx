import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { APP_URLS, AppShell } from "@upshift-tools/shared-ui";
import { QrCode } from "lucide-react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <AppShell
        navbar={{
          logo: (
            <>
              <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius)] bg-primary text-primary-foreground">
                <QrCode className="h-4 w-4" />
              </span>
              <span className="font-display text-base font-semibold tracking-tight">
                QR Creator
              </span>
            </>
          ),
          logoHref: "/",
          links: [
            {
              label: "All Tools",
              href: import.meta.env.DEV
                ? "http://localhost:3000"
                : APP_URLS.TOOLS_OVERVIEW,
            },
          ],
        }}
        footer={true}
        mainClassName="flex flex-col page-bg brand-grid-bg"
        dataShellVariant="soft"
      >
        <Outlet />
      </AppShell>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
