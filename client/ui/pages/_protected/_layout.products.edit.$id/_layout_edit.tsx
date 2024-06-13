import { useRecoilState, useSetRecoilState } from "recoil"
import Button from "@/ui/components/button"
import { EditProductSchema } from "@/forms/schema/edit_product_schema"
import { z } from "zod"
import { hideToastState } from "@/atoms/states"
import { queryClient } from '@/app/RouteComponent'
import { createContext, useContext, useEffect, useState } from "react"
import { getProductEditor } from "@/react-query/mutations";
import _ from 'lodash';
import { singleProductFetcher, singleProductFetcherProps } from "@/react-query/query"
import { getEditProductFormProps } from "@/forms"
import Loader from "@/ui/components/loader"
import { Outlet, createFileRoute, Link, useMatchRoute, Block, useRouterState, useMatch, getRouterContext } from "@tanstack/react-router"
import { useFormState } from "react-hook-form"
import NavigationBlocker from "@/ui/components/modal/NavigationBlocker"
import { ProductContentSearchType } from "./_layout_edit.content"

export const productEditContext = createContext<ReactFormProps<EditProductSchemaType> | null>(null)

export const Route = createFileRoute('/_protected/_layout/products/edit/$id/_layout_edit')({
	loader: async ({ params }) => {
		const singleProductDataQuery = singleProductFetcherProps({ productId: params.id })
		const singleProductData = await queryClient.ensureQueryData(singleProductDataQuery)
		return singleProductData as ProductType
	},
	component: ({ singleProductData }) => {
		return (
			< ProductEditPageLayout >
				<Outlet />
			</ProductEditPageLayout >
		)
	}
})

const ProductEditPageLayout = ({ children }: { children: React.ReactNode }) => {

	const setToastRender = useSetRecoilState(hideToastState)

	const matchRoute = useMatchRoute()

	const params = Route.useParams()

	const initialData = Route.useLoaderData()

	const { data: currentProduct, isPending: productsIsLoading, isSuccess: productIsSuccess } = singleProductFetcher({ productId: params.id, initialData })

	if (productsIsLoading) return <Loader />

	if (productIsSuccess) {
		const productEditProps = getEditProductFormProps({ ...currentProduct })
		const { reset, setError, handleSubmit, errors, trigger, control, watch, getValues } = productEditProps!
		const { isDirty } = useFormState({ control })

		const { mutate: collabChecker, isPending: productIsLoading, isSuccess } = getProductEditor({ setError })
		const routerState = useRouterState()

		const [rendered, setRendered] = useState(false)

		useEffect(() => {
			if (routerState.location.state) {
				const stateData: ProductType = { ...queryClient.getQueryData(['allProducts', params.id!]) as ProductType, ...(routerState.location.state) }
				reset(_.pick(stateData, Object.keys(getValues())), { keepDefaultValues: true })
			}
			setRendered(true)
		}, [])


		return rendered && (
			<Block condition={isDirty}>
				{({ status, proceed, reset: blockReset }: { status: 'idle' | 'blocked', proceed: () => void, reset: () => void }) => (
					<>
						{
							status === 'blocked' &&
							<NavigationBlocker listeners={false} proceed={proceed} reset={blockReset} />
						}
						<productEditContext.Provider value={productEditProps}>
							<div className="h-full w-full mb-14">
								<div className="h-full w-full">
									<div className="flex flex-col text-white/90 pb-5 pt-3 sm:pb-6 sm:pt-10 gap-y-7">
										<div className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide">
											{watch('title') || 'Untitled'}
										</div>
										<div className="border-b-[1px] h-5 border-white/30 flex gap-x-4 w-full">
											<Link
												to='/products/edit/$id/home'
												params={{ id: params.id }}
												style={{
													textDecoration: 'none'
												}}
												state={{
													...getValues()
												}}
												activeProps={{
													className: "cursor-default pointer-events-none"
												}}>
												<Button buttonName="Product" isActive={location.pathname === `/products/edit/${params.id}/home`} extraClasses={[`!text-base !rounded-2xl`]} />
											</Link>
											<Link to='/products/edit/$id/content'
												params={{ id: params.id }}
												search={(prev: ProductContentSearchType) => ({ page: 1, ...prev })}
												style={{
													textDecoration: 'none'
												}}
												state={{
													...getValues()
												}}
												activeProps={{
													className: "cursor-default pointer-events-none"
												}}>
												<Button buttonName="Content" isActive={location.pathname === `/products/edit/${params.id}/content`} extraClasses={[`!text-base !rounded-2xl`]} />
											</Link>
										</div>
									</div>
									<div className="border-b-[0.1px] border-white/30 p-5 flex w-full items-center">
										<div className="flex gap-x-4 w-full">
											<Button type='button' buttonName="Revert" extraClasses={['!text-lg !rounded-xl']} onClickHandler={() => {
												reset()
											}} />
											<Button type='submit' buttonName="Save" isLoading={productIsLoading} extraClasses={['!text-lg !rounded-xl']} form={'edit_product_form'}
												onClickHandler={async () => {
													const result = await trigger()
													if (!result) {
														setToastRender({
															active: false,
															message: 'Error occured for some fields'
														})
													}
												}}
											/>
										</div>
										<div className={`whitespace-nowrap ${isDirty ? 'text-red-400' : 'text-green-400'} `}>
											{isDirty ? 'Changes detected' : 'No changes'}
										</div>
									</div>
									<form className="w-full mt-4 text-xl flex flex-col md:flex-row gap-4 relative left-0" id="edit_product_form"
										onSubmit={handleSubmit(async (data) => {
											if (isDirty) {
												await collabChecker({ payload: { ...queryClient.getQueryData(['allProducts', params.id!]) as ProductType, ...data }, id: params.id! })
												if (isSuccess) {
													reset(_.pick({ ...queryClient.getQueryData(['allProducts', params.id!]) as ProductType, ...data as ProductType }, Object.keys(getValues())))
												}
											} else {
												setToastRender({
													active: false,
													message: 'No changes detected'
												})
											}
										})}
									>
										{children}
									</form>
								</div>
							</div>
						</productEditContext.Provider>
					</>
				)
				}
			</Block >
		)
	}
}
