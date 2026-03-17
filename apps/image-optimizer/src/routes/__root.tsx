import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { APP_URLS, AppShell } from '@upshift-tools/shared-ui';
import { ImageDown } from 'lucide-react';

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
              <ImageDown className='h-6 w-6 text-primary' />
              <span className='font-bold text-lg tracking-tight'>Image Optimizer</span>
            </>
          ),
          logoHref: '/',
          links: [
            {
              label: 'All Tools',
              href: import.meta.env.DEV ? 'http://localhost:3000' : APP_URLS.TOOLS_OVERVIEW,
            },
          ],
        }}
        footer={true}
      >
        <Outlet />
      </AppShell>
      <TanStackRouterDevtools position='bottom-right' />
    </>
  );
}
