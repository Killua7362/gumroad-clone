import style from './global.module.css';
import "nprogress/nprogress.css";

import { RecoilRoot } from 'recoil'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import NonProtectedRoute from "@/ui/layouts/wrapper/NonProtectedRoute"
import ProtectedRoute from "@/ui/layouts/wrapper/ProtectedRoute"

import { allProductsFetcherProps, collabsProductFetcherProps, getProfileProductsFetcherProps, getProfileStatusProps, getSingleProfileProductFetcherProps, loginStatusFetcherProps, singleProductFetcherProps } from "@/react-query/query"
import { Suspense, lazy } from 'react';

import Loader from '@/ui/components/loader';
import { AnimatePresence } from 'framer-motion';
import Bar from '@/ui/components/loader/Bar';
import { NotFoundRoute, RouterProvider, createRouter } from '@tanstack/react-router';

import { routeTree } from '@/ui/routeTree.gen';
import NotFoundPage from '@/ui/_NotFound';
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
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

export const router = createRouter({
	routeTree,
	context: {
		queryClient,
		sidebaractive: false,
	},
	defaultNotFoundComponent: () => {
		return <NotFoundPage />
	},
	notFoundMode: 'root'
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

const RootPage = () => {
	return (
		<RecoilRoot>
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
				<Suspense fallback={<Bar />}>
					<RouterProvider router={router} />
					<TanStackRouterDevtools router={router} />
				</Suspense>
			</PersistQueryClientProvider>
		</RecoilRoot>
	);
};

export default RootPage;
