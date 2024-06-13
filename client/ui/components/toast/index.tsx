import { hideToastState } from "@/atoms/states"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { createPortal } from "react-dom"
import { useRecoilState } from "recoil"

const mountElement = document.getElementById('toasts')

const Toast = () => {
	const [toastRender, setToastRender] = useRecoilState(hideToastState)

	useEffect(() => {
		if (!toastRender.active) {
			setTimeout(() => {
				setToastRender({ active: true, message: '' })
			}, 2500)
		}
	}, [toastRender.active])

	return (
		createPortal(
			<AnimatePresence>
				{
					!toastRender.active && <motion.div
						initial={{
							opacity: 0,
						}}
						exit={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
							transition: {
								duration: 0.2
							}
						}}
						className="fixed z-50 top-0 w-full mt-5 flex justify-center"
					>
						<div className="bg-background border-white border-[0.1px] px-4 py-2 w-fit">
							{toastRender.message}
						</div>
					</motion.div>
				}
			</AnimatePresence>,
			mountElement!
		)
	)
}

export default Toast
