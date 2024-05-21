import { productsCardContextMenu } from "@/atoms/states"
import { useRecoilValue, useSetRecoilState } from "recoil"
import Button from "@/ui/components/button"
import { queryClient } from "@/app/RootPage"
import { getProductDeleter } from "@/react-query/mutations"

const DeleteProduct = () => {
	const contextMenuValue = useRecoilValue(productsCardContextMenu)

	const { mutate: productDeleter, isPending: productIsDeleting } = getProductDeleter()

	return (
		<div className="bg-background border-white/30 rounded-xl min-w-[15rem] border-[0.1px] p-6 text-lg flex flex-col gap-y-6 items-center">
			<div className="text-xl">
				Confirm Delete?
			</div>
			<div className="flex gap-x-4">
				<Button
					buttonName="Cancel"
					type="button" onClickHandler={() => {
					}}
				/>
				<Button buttonName="Confirm"
					isLoading={productIsDeleting}
					type="button" onClickHandler={() => {
						// productDeleter()
					}} extraClasses={['!border-red-500/70 !text-red-500 hover:text-red-500/70']} />
			</div>
		</div>
	)
}

export default DeleteProduct
