import { useParams, useRouteLoaderData } from "react-router"
import { Link, NavLink } from "react-router-dom"
import { useRecoilState, useSetRecoilState } from "recoil"
import Button from "@/ui/components/button"
import { EditProductSchema } from "@/forms/schema/edit_product_schema"
import { z } from "zod"
import { hideToastState } from "@/atoms/states"
import { queryClient } from "@/app/RootPage"
import { createContext, useEffect, useState } from "react"
import { getProductEditor } from "@/react-query/mutations";
import _ from 'lodash';
import { singleProductFetcher } from "@/react-query/query"
import { getEditProductFormProps } from "@/forms"
import Loader from "../components/loader"

export const productEditContext = createContext<ReactFormProps<EditProductSchemaType> | null>(null)

const ProductEditPageLayout = ({ children }: { children: React.ReactNode }) => {

	const setToastRender = useSetRecoilState(hideToastState)

	const params = useParams()

	const initialData = useRouteLoaderData('product_edit_page') as ProductType

	const { data: currentProduct, isPending: productsIsLoading, isSuccess: productIsSuccess } = singleProductFetcher({ productId: params.id, initialData })

	if (productsIsLoading) return <Loader />

	if (productIsSuccess) {
		const productEditProps = getEditProductFormProps({ ...currentProduct })
		const { reset, setError, handleSubmit, errors, trigger } = productEditProps!

		const { mutate: collabChecker, isPending: productIsLoading } = getProductEditor({ setError })

		return (
			<productEditContext.Provider value={productEditProps}>
				<div className="h-full w-full mb-14">
					<div className="h-full w-full">
						<div className="flex flex-col text-white/90 pb-5 pt-3 sm:pb-6 sm:pt-6 gap-y-7">
							<div className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide">
								Edit Product
							</div>
							<div className="border-b-[1px] h-5 border-white/30 flex gap-x-4 w-full">
								<NavLink to={`/products/edit/${params.id}/home`}
									style={{
										textDecoration: 'none'
									}}
									className={({ isActive }) => {
										return (isActive ? "cursor-default pointer-events-none" : "")
									}} >
									{({ isActive }) => (
										<Button buttonName="Product" isActive={isActive} extraClasses={[`!text-base !rounded-2xl`]} />
									)}
								</NavLink>
								<NavLink to={`/products/edit/${params.id}/content?page=1`}
									style={{
										textDecoration: 'none'
									}}
									className={({ isActive }) => {
										return (isActive ? "cursor-default pointer-events-none" : "")
									}} >
									{({ isActive }) => (
										<Button buttonName="Content" isActive={isActive} extraClasses={[`!text-base !rounded-2xl`]} />
									)}
								</NavLink>
							</div>
						</div>
						<div className="flex gap-x-4 border-b-[0.1px] border-white/30 p-5">
							<Button type='button' buttonName="Revert" extraClasses={['!text-lg !rounded-xl']} onClickHandler={() => {
								reset({ ...queryClient.getQueryData(['allProducts', params.id!]) as ProductType })
							}} />
							<Button type='submit' buttonName="Save" isLoading={productIsLoading} extraClasses={['!text-lg !rounded-xl']} form={'edit_product_form'}
								onClickHandler={async () => {
									const result = await trigger()
									if (!result) {
										setToastRender({
											active: false,
											message: 'Some fields are empty move to main edit page to fix it'
										})
									}
								}}
							/>
						</div>
						<form className="w-full mt-4 text-xl flex flex-col md:flex-row gap-4 relative left-0" id="edit_product_form" onSubmit={handleSubmit((data) => {
							collabChecker({ payload: { ...queryClient.getQueryData(['allProducts', params.id!]) as ProductType, ...data }, id: params.id! })
						})}>
							{children}
						</form>
					</div>
				</div>
			</productEditContext.Provider>
		)
	}
}

export default ProductEditPageLayout
