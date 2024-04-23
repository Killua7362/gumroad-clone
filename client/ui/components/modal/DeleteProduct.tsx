import { AllProdctsForUser, AllProdctsForUserFetcher, modalBaseActive, productsCardContextMenu } from "@/atoms/states"
import axios from "axios"
import { useRecoilValue, useSetRecoilState } from "recoil"

const DeleteProduct = () => {
	const setModalActive = useSetRecoilState(modalBaseActive)
	const contextMenuValue = useRecoilValue(productsCardContextMenu)

	const setAllProducts = useSetRecoilState(AllProdctsForUserFetcher)
	const allProductsValue = useRecoilValue(AllProdctsForUser)

	return (
		<div className="bg-background border-white/30 rounded-xl w-[15rem] border-[0.1px] p-6 text-lg flex flex-col gap-y-6 items-center">
			<div className="text-xl">
				Confirm Delete?
			</div>
			<div className="flex gap-x-4">
				<div className="cursor-pointer hover:text-white/70 border-white/30 border-[0.1px] rounded-md p-2"
					onClick={() => {
						setModalActive({
							active: false,
							type: ""
						})
					}}
				>
					Cancel
				</div>
				<div className="cursor-pointer hover:text-red-400 text-red-500 border-red-500 border-[0.1px] rounded-md p-2"
					onClick={async () => {
						axios.delete(`${window.location.origin}/api/products/${contextMenuValue.id}`).then(res => {
							let tempAllProducts = allProductsValue.filter((e) => e.id !== contextMenuValue.id)
							setAllProducts(tempAllProducts)
							setModalActive({
								active: false,
								type: ""
							})
						}).catch(err => console.log(err))
					}}
				>
					Confirm
				</div>
			</div>
		</div>
	)
}

export default DeleteProduct
