import {
  Outlet,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppShell } from "@upshift-tools/shared-ui";
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
              <QrCode className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg tracking-tight">
                QR Creator
              </span>
            </>
          ),
          logoHref: "/",
          links: [
            {
              label: "All Tools",
              href: import.meta.env.VITE_OVERVIEW_URL || (import.meta.env.DEV ? "http://localhost:3000" : "https://tools.upshift.be"),
            },
          ],
        }}
        footer={true}
      >
        <Outlet />
      </AppShell>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
