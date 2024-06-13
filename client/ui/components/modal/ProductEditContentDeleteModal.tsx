import * as Modal from '@/ui/components/modal'
import Button from '@/ui/components/button'
import { UseFieldArrayRemove } from 'react-hook-form'

const ProductEditContentDeleteModal = ({ i, remove }: { i: number, remove: UseFieldArrayRemove }) => {
	return (
		<Modal.Root key={i}>
			<Modal.Base>
				<div className="bg-background z-50 border-white/30 rounded-xl min-w-[15rem] border-[0.1px] p-6 text-lg flex flex-col gap-y-6 items-center">
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
									remove(i)
								}}
								extraClasses={['!border-red-400/70 !text-red-400 hover:text-red-400/70']} />
						</Modal.Close>
					</div>
				</div>
			</Modal.Base>
			<Modal.Open>
				<div className='p-4 py-3 bg-white text-black w-full cursor-pointer hover:bg-white/90'>
					Delete
				</div>
			</Modal.Open>
		</Modal.Root>
	)
}

export default ProductEditContentDeleteModal
