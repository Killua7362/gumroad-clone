import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from "react-dom"
import { RefObject, createContext, useContext, useEffect, useState } from "react"
import { cx, css } from "@emotion/css"

const mountElement = document.getElementById('modals')

interface ModalContextContent {
	active?: boolean,
	setActive?: React.Dispatch<React.SetStateAction<boolean>>
}

export const modalContext = createContext<ModalContextContent>({});

const ModalRoot = ({ children }: { children: React.ReactNode }) => {
	const [active, setActive] = useState(false)

	return (
		<modalContext.Provider value={{ active, setActive }}>
			{children}
		</modalContext.Provider>
	)
}

const ModalBase = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
	const { active, setActive } = useContext(modalContext)

	useEffect(() => {
		if (active) {
			document.body.classList.add("do-not-scroll")
		} else {
			document.body.classList.remove("do-not-scroll")
		}
	}, [active])

	return (
		createPortal(
			<AnimatePresence>
				{
					active && <motion.div
						initial={{
							opacity: 0
						}}
						exit={{
							opacity: 0
						}}
						animate={{
							opacity: 1,
							transition: {
								duration: 0.3
							}
						}}
						onClick={(e) => {
							e.stopPropagation()
							setActive!(false)

							onClick && onClick()
						}}

						className={cx("top-0 fixed flex justify-center items-center z-50 w-screen min-h-screen bg-background/30 backdrop-blur-sm text-white")}>
						{
							children
						}
					</motion.div>
				}
			</AnimatePresence>,
			mountElement!
		)
	)
}

const ModalClose = ({ children, onClickHandler }: { children: React.ReactNode, onClickHandler?: () => Promise<boolean> }) => {
	const { active, setActive } = useContext(modalContext)
	return <div
		className="h-full"
		onClick={async (e) => {
			if (onClickHandler) {
				const status = await onClickHandler()
				if (status) {
					setActive!(false)
				}
			} else {
				setActive!(false)
			}
		}}>
		{children}
	</div>
}

const ModalOpen = ({ children }: { children: React.ReactNode }) => {
	const { active, setActive } = useContext(modalContext)

	return <div className="h-full" onClick={(e) => {

		setActive!(true)
	}}>
		{children}
	</div>
}

export {
	ModalRoot as Root,
	ModalBase as Base,
	ModalClose as Close,
	ModalOpen as Open
}
