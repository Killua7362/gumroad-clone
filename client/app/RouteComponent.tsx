import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import { createBrowserHistory } from '@/lib/history';
import NotFoundPage from '@/ui/_NotFound';
import { routeTree } from '@/ui/routeTree.gen';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
      retry: false,
      refetchOnWindowFocus: false,
      retryOnMount: false,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const history = createBrowserHistory({
  layoutUrls: ['/_protected/_layout/products/edit/$id/_layout_edit'],
});

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    sidebaractive: false,
  },
  defaultNotFoundComponent: () => {
    return <NotFoundPage />;
  },
  history,
  notFoundMode: 'root',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
const RouteComponent = () => {
  return (
    <PersistQueryClientProvider
      persistOptions={{
        persister,
        dehydrateOptions: {
          // persist only offlineFirst queries
          shouldDehydrateQuery: (query) => {
            return query?.meta?.persist === true;
          },
        },
      }}
      client={queryClient}>
      <RouterProvider router={router} />
      <TanStackRouterDevtools router={router} />
    </PersistQueryClientProvider>
  );
};

export default RouteComponent;
