import { modalBaseActive } from "@/atoms/states"
import { useRecoilState } from "recoil"
import NewProductModal from "@/ui/components/modal/NewProduct"
import { AnimatePresence, motion } from 'framer-motion'
import DeleteProduct from "@/ui/components/modal/DeleteProduct"

const ModalBase = () => {
	const [modalActive, setModalActive] = useRecoilState(modalBaseActive)

	return (
		<AnimatePresence>
			{
				modalActive.active && <motion.div
					initial={{
						opacity: 0
					}}
					exit={{
						opacity: 0
					}}
					animate={{
						opacity: 1,
						transition: {
							duration: 0.2
						}
					}}
					className="fixed z-50 w-screen min-h-screen bg-background/30 backdrop-blur-sm flex items-center justify-center" onClick={(e) => {
						e.stopPropagation()
						e.preventDefault()
						setModalActive({
							active: modalActive.active ? false : true,
							type: ""
						})
					}}>
					<div onClick={(e) => {
						e.stopPropagation()
					}}>
						{
							{
								"new_product": <NewProductModal />,
								"delete_product": <DeleteProduct />
							}[modalActive.type]
						}
					</div>
				</motion.div>
			}
		</AnimatePresence>
	)
}
export default ModalBase
