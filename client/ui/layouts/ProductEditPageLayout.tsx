import { useParams } from "react-router"
import { Link } from "react-router-dom"
import { useRecoilState } from "recoil"
import Button from "@/ui/components/button"


const ProductEditPageLayout = ({ children, productState }: { children: React.ReactNode, productState: productEditPageProps }) => {
	const { editProductState, setEditProductState } = productState

	const params = useParams()

	return (
		<div className="h-full w-full mb-14">
			<div className="h-full w-full">
				<div className="flex flex-col text-white/90 pb-5 pt-3 sm:pb-6 sm:pt-6 mb-5 gap-y-7">
					<div className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide">
						Edit Product
					</div>
					<div className="border-b-[1px] h-5 border-white/30 flex gap-x-4 w-full">
						<Link to={`/products/edit/${params.id}/home`} className={`no-underline ${params.page && params.page === 'home' && 'cursor-default pointer-events-none'}`}>
							<Button type='button' buttonName="Product" extraClasses={[`!text-base !rounded-2xl ${params.page && params.page === 'home' && '!border-white'}`]} />
						</Link>
						<Link to={`/products/edit/${params.id}/content?page=1`} className={`no-underline ${params.page && params.page === 'content' && 'cursor-default pointer-events-none'}`}>
							<Button type='button' buttonName="Content" extraClasses={[`!text-base !rounded-2xl ${params.page && params.page === 'content' && '!border-white'}`]} />
						</Link>
					</div>
				</div>
				<div className="flex gap-x-4">
					<Button type='button' buttonName="Revert" extraClasses={['!text-lg !rounded-xl']} />
					<Button type='submit' buttonName="Save" extraClasses={['!text-lg !rounded-xl']} form={'edit_product_form'} />
				</div>
				<div className="w-full mt-4 text-xl flex flex-col md:flex-row gap-4 relative left-0">
					{children}
				</div>
			</div>
		</div>
	)
}

export default ProductEditPageLayout
