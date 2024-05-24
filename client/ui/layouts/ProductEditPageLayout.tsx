import { useParams } from "react-router"
import { Link } from "react-router-dom"
import { useRecoilState, useSetRecoilState } from "recoil"
import Button from "@/ui/components/button"
import { EditProductSchema } from "@/forms/schema/edit_product_schema"
import { z } from "zod"
import { hideToastState } from "@/atoms/states"
import { queryClient } from "@/app/RootPage"
import { useContext } from "react"
import { productEditContext } from "../pages/ProductEditPage"
import { getProductEditor } from "@/react-query/mutations";
import _ from 'lodash';

const ProductEditPageLayout = ({ children }: { children: React.ReactNode }) => {
	const localProductEditContext = useContext(productEditContext)
	const { reset, setError, handleSubmit, errors, trigger } = localProductEditContext!

	const setToastRender = useSetRecoilState(hideToastState)
	const params = useParams()

	const { mutate: collabChecker, isPending: productIsLoading } = getProductEditor({ setError })

	return (
		<div className="h-full w-full mb-14">
			<div className="h-full w-full">
				<div className="flex flex-col text-white/90 pb-5 pt-3 sm:pb-6 sm:pt-6 mb-5 gap-y-7">
					<div className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide">
						Edit Product
					</div>
					<div className="border-b-[1px] h-5 border-white/30 flex gap-x-4 w-full">
						<Link to={`/products/edit/${params.id}/home`} className={`no-underline ${params.page && params.page === 'home' && 'cursor-default pointer-events-none'}`}>
							<Button type='button' buttonName="Product" extraClasses={[`!text-base !rounded-2xl ${!_.isEmpty(errors) && '!border-red-400'} ${params.page && params.page === 'home' && _.isEmpty(errors) && '!border-white'}`]} />
						</Link>
						<Link to={`/products/edit/${params.id}/content?page=1`} className={`no-underline ${params.page && params.page === 'content' && 'cursor-default pointer-events-none'}`}>
							<Button type='button' buttonName="Content" extraClasses={[`!text-base !rounded-2xl ${params.page && params.page === 'content' && '!border-white'}`]} />
						</Link>
					</div>
				</div>
				<div className="flex gap-x-4">
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
	)
}

export default ProductEditPageLayout
