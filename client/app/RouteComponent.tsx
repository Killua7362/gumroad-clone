import { createBrowserHistory } from '@/lib/history';
import NotFoundPage from '@/ui/_NotFound';
import { routeTree } from '@/ui/routeTree.gen';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { CableProvider } from './ActionCableContext';

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
        <CableProvider>
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
                <ReactQueryDevtools initialIsOpen={false} />
                <RouterProvider router={router} />
            </PersistQueryClientProvider>
        </CableProvider>
    );
};

export default RouteComponent;
