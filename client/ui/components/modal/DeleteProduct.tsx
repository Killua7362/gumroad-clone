import { AllProdctsForUser, AllProdctsForUserFetcher, modalBaseActive, productsCardContextMenu } from "@/atoms/states"
import axios from "axios"
import { useRecoilValue, useSetRecoilState } from "recoil"
import Button from "@/ui/components/button"

const DeleteProduct = () => {
	const setModalActive = useSetRecoilState(modalBaseActive)
	const contextMenuValue = useRecoilValue(productsCardContextMenu)

	const setAllProducts = useSetRecoilState(AllProdctsForUserFetcher)
	const allProductsValue = useRecoilValue(AllProdctsForUser)

	const confirmOnClickHandler = () => {
		return async () => {
			axios.delete(`${window.location.origin}/api/products/${contextMenuValue.id}`).then(res => {
				let tempAllProducts: ProductTypePayload = { ...allProductsValue }
				delete tempAllProducts[contextMenuValue.id!]
				setAllProducts(tempAllProducts)
				setModalActive({
					active: false,
					type: ""
				})
			}).catch(err => console.log(err))
		}
	}

	return (
		<div className="bg-background border-white/30 rounded-xl min-w-[15rem] border-[0.1px] p-6 text-lg flex flex-col gap-y-6 items-center">
			<div className="text-xl">
				Confirm Delete?
			</div>
			<div className="flex gap-x-4">
				<Button buttonName="Cancel" type="button" onClickHandler={() => {
					setModalActive({
						active: false,
						type: ""
					})
				}}
				/>
				<Button buttonName="Confirm" type="button" onClickHandler={confirmOnClickHandler} extraClasses={['!border-red-500/70 !text-red-500 hover:text-red-500/70']} />
			</div>
		</div>
	)
}

export default DeleteProduct
