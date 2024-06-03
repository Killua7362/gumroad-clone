import style from './global.module.css';
import "nprogress/nprogress.css";

import {
	RouterProvider,
} from "react-router-dom";
import { RecoilRoot } from 'recoil'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import NonProtectedRoute from "@/ui/layouts/wrapper/NonProtectedRoute"
import ProtectedRoute from "@/ui/layouts/wrapper/ProtectedRoute"

import { Outlet } from "react-router"
import { allProductsFetcherProps, collabsProductFetcherProps, getProfileProductsFetcherProps, getProfileStatusProps, getSingleProfileProductFetcherProps, loginStatusFetcherProps, singleProductFetcherProps } from "@/react-query/query"
import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import BaseLayout from '@/ui/layouts/BaseLayout';
import Loader from '@/ui/components/loader';
import { AnimatePresence } from 'framer-motion';
import Bar from '@/ui/components/loader/Bar';
const CheckoutLayout = lazy(() => import("@/ui/layouts/CheckoutLayout"))
const ProductEditPageLayout = lazy(() => import("@/ui/layouts/ProductEditPageLayout"))
const ProductLayout = lazy(() => import("@/ui/layouts/ProductsLayout"))
const NotFoundPage = lazy(() => import("@/ui/pages/404"))
const CheckoutForm = lazy(() => import("@/ui/pages/CheckoutForm"))
const CollaboratorsPage = lazy(() => import('@/ui/pages/Collaborators'));
const Home = lazy(() => import('@/ui/pages/Home'));
const ProductsDetailsPage = lazy(() => import('@/ui/pages/ProductDetailsPage'));
const ProductEditContentPage = lazy(() => import('@/ui/pages/ProductEditContentPage'));
const ProductEditHomePage = lazy(() => import('@/ui/pages/ProductEditHomePage'));
const ProductsHomePage = lazy(() => import('@/ui/pages/ProductsHomePage'));
const ProfileCheckoutPage = lazy(() => import('@/ui/pages/ProfileCheckoutPage'));
const ProfileHomePage = lazy(() => import('@/ui/pages/ProfileHomePage'));
const SignInPage = lazy(() => import('@/ui/pages/SignInPage'));
const SignUpPage = lazy(() => import('@/ui/pages/SignUpPage'));
const SuggestionsPage = lazy(() => import('@/ui/pages/Suggestions'));


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

const router = createBrowserRouter([
	{
		Component: () => {
			return (
				<BaseLayout>
					<Outlet />
				</BaseLayout>
			)
		},
		id: 'root',
		loader: async () => {
			const loginStatus = await queryClient.ensureQueryData(loginStatusFetcherProps)
			return loginStatus as authSchema
		},
		errorElement: <NotFoundPage />,
		children: [
			{
				path: 'profile/:id',
				id: 'profile_home',
				loader: async ({ params }) => {
					const productDataQuery = getProfileProductsFetcherProps({ userId: params.id })
					const productData = await queryClient.ensureQueryData(productDataQuery)

					const profileDataQuery = getProfileStatusProps({ userId: params.id })
					const profileData = await queryClient.ensureQueryData(profileDataQuery)

					return {
						productData,
						profileData
					} as {
						productData: ProductTypePayload,
						profileData: CheckoutFormSchemaType
					}
				},
				element: <ProfileHomePage />
			},
			{
				loader: async ({ params }) => {
					const singleProfileProductDataQuery = getSingleProfileProductFetcherProps({ userId: params.id, productId: params.productid })

					const singleProductData = await queryClient.ensureQueryData(singleProfileProductDataQuery)

					return {
						singleProductData,
					} as {
						singleProductData: ProductType,
					}
				},
				path: 'profile/:id/product/:productid',
				id: 'profile_single_product',
				element: <ProductsDetailsPage />
			},
			{
				path: 'profile/:id/checkout',
				element: <ProfileCheckoutPage />
			},
			{
				element: <NonProtectedRoute />,
				children: [
					{
						path: 'signin',
						element: <SignInPage />
					},
					{
						path: 'signup',
						element: <SignUpPage />
					},
				]
			},
			{
				element: <ProtectedRoute />,
				children: [
					{
						path: '/',
						element: <Home />,
					},
					{
						path: 'products/edit/:id',
						id: 'product_edit_page',
						loader: async ({ params }) => {
							const singleProductDataQuery = singleProductFetcherProps({ productId: params.id })
							const singleProductData = await queryClient.ensureQueryData(singleProductDataQuery)
							return singleProductData as ProductType
						},
						Component: () => {
							return (
								<ProductEditPageLayout>
									<Outlet />
								</ProductEditPageLayout>
							)
						},
						children: [
							{
								path: 'home',
								element: <ProductEditHomePage />
							},
							{
								path: 'content',
								element: <ProductEditContentPage />
							},

						]
					},
					{
						Component: () => {
							return (
								<ProductLayout>
									<Outlet />
								</ProductLayout >
							)
						},
						children: [
							{
								path: "products/home",
								id: 'products_home',
								loader: async () => {
									const allProducts = await queryClient.ensureQueryData(allProductsFetcherProps)
									return allProducts as ProductTypePayload
								},
								element: <ProductsHomePage />
							},
							{
								path: "products/collaborators",
								id: 'collaborators_page',
								element: <CollaboratorsPage />,
								loader: async () => {
									const allProducts = await queryClient.ensureQueryData(allProductsFetcherProps)
									const collabProducts = await queryClient.ensureQueryData(collabsProductFetcherProps)
									return {
										allProducts,
										collabProducts
									} as {
										allProducts: ProductTypePayload,
										collabProducts: ProductTypePayload
									}
								}
							},
						]
					},
					{
						Component: () => {
							return (
								<CheckoutLayout>
									<Outlet />
								</CheckoutLayout>
							)
						},
						children: [
							{
								path: 'checkout/form',
								id: 'checkout_form',
								element: <CheckoutForm />,
								loader: async () => {
									const profileDataQuery = getProfileStatusProps({ userId: (queryClient.getQueryData(['loginStatus']) as authSchema).user_id })
									const profileData = await queryClient.ensureQueryData(profileDataQuery)
									return profileData as CheckoutFormSchemaType
								}
							},
							{
								path: 'checkout/suggestions',
								element: <SuggestionsPage />
							},
						]
					},
				]
			},
		]
	},
])

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
				</Suspense>
			</PersistQueryClientProvider>
		</RecoilRoot>
	);
};

export default RootPage;
