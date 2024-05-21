import * as Modal from '@/ui/components/modal'
import Button from '@/ui/components/button'
import { getProductDeleter } from '@/react-query/mutations'

const DeleteProductModal = ({ idx, setContextMenuConfig }: { idx: string, setContextMenuConfig: React.Dispatch<React.SetStateAction<ProductsCardContextMenu>> }) => {
	const { mutate: productDeleter, isPending: productIsDeleting } = getProductDeleter()

	return (
		<Modal.Root key={idx}>
			<Modal.Base>
				<div className="bg-background z-50 border-white/30 rounded-xl min-w-[15rem] border-[0.1px] p-6 text-lg flex flex-col gap-y-6 items-center" onClick={(e) => { e.stopPropagation() }}>
					<div className="text-xl">
						Confirm Delete?
					</div>
					<div className="flex gap-x-4">
						<Modal.Close>
							<Button
								buttonName="Cancel"
								type="button"
							/>
						</Modal.Close>
						<Modal.Close>
							<Button buttonName="Confirm"
								type="button" onClickHandler={() => {
									productDeleter(idx)
								}}
								extraClasses={['!border-red-500/70 !text-red-500 hover:text-red-500/70']} />
						</Modal.Close>
					</div>
				</div>
			</Modal.Base>
			<Modal.Open>
				<div className="px-4 py-3 hover:bg-accent/50 cursor-pointer" onClick={() => {
					setContextMenuConfig(prev => {
						return { ...prev, active: false }
					})
				}}>
					Delete
				</div>
			</Modal.Open>
		</Modal.Root>

	)
}
export default DeleteProductModal
