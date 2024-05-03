import { productsEditContentContextMenu } from "@/atoms/states"
import { useParams } from "react-router"
import { Link } from "react-router-dom"
import { useRecoilState } from "recoil"


const ProductEditPageLayout = ({ children }: { children: React.ReactNode }) => {
	const params = useParams()

	const [contextMenu, setContextMenu] = useRecoilState<productsEditContentContextMenu>(productsEditContentContextMenu)
	return (
		<div className="h-full w-full mb-14" onClick={() => {
			setContextMenu(prev => {
				return {
					...prev,
					active: false,
				}
			})
		}}>
			<div className="h-full px-3 sm:mx-10">
				<div className="flex flex-col text-white/90 pb-5 pt-3 sm:pb-6 sm:pt-6 mb-6 gap-y-10">
					<div className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide">
						Edit Product
					</div>
					<div className="border-b-[1px] h-3 border-white/30 flex gap-x-4">
						<Link to={`/products/edit/${params.id}/home`} className={`no-underline ${params.page && params.page === 'home' && 'cursor-default pointer-events-none'}`}>
							<span className={`border-white/30 border-[0.1px] rounded-2xl px-3 py-2 w-fit h-fit ${params.page && params.page === 'home' ? 'bg-white text-black' : 'bg-background text-white hover:bg-accent'} `}>
								Product
							</span>
						</Link>
						<Link to={`/products/edit/${params.id}/content?page=1`} className={`no-underline ${params.page && params.page === 'content' && 'cursor-default pointer-events-none'}`}>
							<span className={`border-white/30 border-[0.1px] rounded-2xl px-3 py-2 w-fit h-fit ${params.page && params.page === 'content' ? 'bg-white text-black' : 'bg-background text-white hover:bg-accent'} `}>
								Content
							</span>
						</Link>
					</div>
				</div>
				<div className="w-full mt-8 text-xl flex gap-4 relative">
					{children}
				</div>
			</div>
		</div>
	)
}

export default ProductEditPageLayout
