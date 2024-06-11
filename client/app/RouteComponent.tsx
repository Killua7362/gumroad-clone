import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { BlockerFn, HistoryLocation, NotFoundRoute, Outlet, RouterProvider, createRouter } from '@tanstack/react-router';

import { routeTree } from '@/ui/routeTree.gen';
import NotFoundPage from '@/ui/_NotFound';
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Bar from '@/ui/components/loader/Bar';
import { createBrowserHistory } from '@/lib/history';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			gcTime: Infinity,
			retry: false,
			refetchOnWindowFocus: false,
			retryOnMount: false,
		},

	}
})

const persister = createSyncStoragePersister({
	storage: window.localStorage
})

const history = createBrowserHistory({
	layoutUrls: ['']
})

export const router = createRouter({
	routeTree,
	context: {
		queryClient,
		sidebaractive: false,
	},
	defaultNotFoundComponent: () => {
		return <NotFoundPage />
	},
	history,
	notFoundMode: 'root',
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
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
			}} client={queryClient}>
			<RouterProvider router={router} />
			<TanStackRouterDevtools router={router} />
		</PersistQueryClientProvider>

	)
}

export default RouteComponent
