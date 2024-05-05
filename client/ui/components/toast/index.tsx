import { hideToastState } from "@/atoms/states"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"

const Toast = () => {
	const [toastRender, setToastRender] = useRecoilState(hideToastState)

	useEffect(() => {
		if (!toastRender.active) {
			setTimeout(() => {
				setToastRender({ active: true, message: '' })
			}, 2000)
		}
	}, [toastRender.active])

	return (
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
					className="fixed z-50 bg-background text-center left-[47%] mt-5 border-white border-[0.1px] px-4 py-2"
				>
					{toastRender.message}
				</motion.div>
			}
		</AnimatePresence>
	)
}

export default Toast
