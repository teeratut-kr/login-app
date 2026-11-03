import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Toaster } from "@/components/ui/toast"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Providers } from "@/components/providers"

import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <Providers>
      <Outlet />
      <Toaster />
      <SonnerToaster />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </Providers>
  )
}
