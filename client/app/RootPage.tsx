import style from './global.module.css';
import {
	RouterProvider,
} from "react-router-dom";
import { RecoilRoot } from 'recoil'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import BaseLayout from "@/ui/layouts/BaseLayout"
import CheckoutLayout from "@/ui/layouts/CheckoutLayout"
import ProductLayout from "@/ui/layouts/ProductsLayout"
import NonProtectedRoute from "@/ui/layouts/wrapper/NonProtectedRoute"
import ProtectedRoute from "@/ui/layouts/wrapper/ProtectedRoute"
import NotFoundPage from "@/ui/pages/404"
import CheckoutForm from "@/ui/pages/CheckoutForm"
import CollaboratorsPage from "@/ui/pages/Collaborators"
import Home from "@/ui/pages/Home"
import ProductsDetailsPage from "@/ui/pages/ProductDetailsPage"
import ProductsHomePage from "@/ui/pages/ProductsHomePage"
import ProfileCheckoutPage from "@/ui/pages/ProfileCheckoutPage"
import ProfileHomePage from "@/ui/pages/ProfileHomePage"
import SignInPage from "@/ui/pages/SignInPage"
import SignUpPage from "@/ui/pages/SignUpPage"
import SuggestionsPage from "@/ui/pages/Suggestions"
import { Outlet } from "react-router"
import { allProductsFetcherProps, collabsProductFetcherProps, getProfileProductsFetcherProps, getProfileStatusProps, getSingleProfileProductFetcherProps, singleProductFetcherProps } from "@/react-query/query"
import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loader from '@/ui/components/loader';

const ProductEditPageLayout = lazy(() => import('@/ui/layouts/ProductEditPageLayout'))
const ProductEditContentPage = lazy(() => import('@/ui/pages/ProductEditContentPage'))
const ProductEditHomePage = lazy(() => import('@/ui/pages/ProductEditHomePage'))

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

		lazy: async () => {
			const BaseLayout = (await import('@/ui/layouts/BaseLayout')).default
			return {
				element: < BaseLayout>
					<Outlet />
				</BaseLayout>
			}
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
				lazy: async () => {
					const ProfileHomePage = (await import('@/ui/pages/ProfileHomePage')).default
					return { element: < ProfileHomePage /> }
				},
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
				lazy: async () => {
					const ProductsDetailsPage = (await import('@/ui/pages/ProductDetailsPage')).default
					return { element: < ProductsDetailsPage /> }
				},
			},
			{
				path: 'profile/:id/checkout',
				lazy: async () => {
					const ProfileCheckoutPage = (await import('@/ui/pages/ProfileCheckoutPage')).default
					return { element: < ProfileCheckoutPage /> }
				},
			},
			{
				element: <NonProtectedRoute />,
				children: [
					{
						path: 'signin',
						lazy: async () => {
							const SignInPage = (await import('@/ui/pages/SignInPage')).default
							return { element: < SignInPage /> }
						},
					},
					{
						path: 'signup',
						lazy: async () => {
							const SignUpPage = (await import('@/ui/pages/SignUpPage')).default
							return { element: < SignUpPage /> }
						},
					},
				]
			},
			{
				element: <ProtectedRoute />,
				children: [
					{
						path: '/',
						lazy: async () => {
							const Home = (await import('@/ui/pages/Home')).default
							return { element: < Home /> }
						},
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
								< ProductEditPageLayout >
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
						lazy: async () => {
							const ProductLayout = (await import('@/ui/layouts/ProductsLayout')).default
							return {
								element: < ProductLayout >
									<Outlet />
								</ProductLayout>
							}
						},
						children: [
							{
								path: "products/home",
								id: 'products_home',
								loader: async () => {
									const allProducts = await queryClient.ensureQueryData(allProductsFetcherProps)
									return allProducts as ProductTypePayload
								},
								lazy: async () => {
									const ProductsHomePage = (await import('@/ui/pages/ProductsHomePage')).default
									return {
										element: <ProductsHomePage />
									}
								},
							},
							{
								path: "products/collaborators",
								id: 'collaborators_page',
								lazy: async () => {
									const CollaboratorsPage = (await import('@/ui/pages/Collaborators')).default
									return {
										element: <CollaboratorsPage />
									}
								},
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
						lazy: async () => {
							const CheckoutLayout = (await import('@/ui/layouts/CheckoutLayout')).default
							return {
								element: <CheckoutLayout>
									<Outlet />
								</CheckoutLayout>
							}
						},
						children: [
							{
								path: 'checkout/form',
								id: 'checkout_form',
								lazy: async () => {
									const CheckoutForm = (await import('@/ui/pages/CheckoutForm')).default
									return {
										element: <CheckoutForm />
									}
								},
								loader: async () => {
									const profileDataQuery = getProfileStatusProps({ userId: (queryClient.getQueryData(['loginStatus']) as authSchema).user_id })
									const profileData = await queryClient.ensureQueryData(profileDataQuery)
									return profileData as CheckoutFormSchemaType
								}
							},
							{
								path: 'checkout/suggestions',
								element: <SuggestionsPage />,
								lazy: async () => {
									const SuggestionsPage = (await import('@/ui/pages/Suggestions')).default
									return {
										element: <SuggestionsPage />
									}
								},
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
				<Suspense fallback={<Loader />}>
					<RouterProvider router={router} />
				</Suspense>
			</PersistQueryClientProvider>
		</RecoilRoot>
	);
};

export default RootPage;
