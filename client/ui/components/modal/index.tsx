import { modalBaseActive } from "@/atoms/states"
import { useRecoilState } from "recoil"
import NewProductModal from "@/ui/components/modal/NewProduct"
import { AnimatePresence, motion } from 'framer-motion'
import DeleteProduct from "@/ui/components/modal/DeleteProduct"
import { createPortal } from "react-dom"
import { RefObject, createContext, createRef, useContext, useRef } from "react"
import { cx, css } from "@emotion/css"

const mountElement = document.getElementById('modals')

interface ModalContextContent {
	ref?: RefObject<HTMLDialogElement>
}

export const modalContext = createContext<ModalContextContent>({});

const ModalRoot = ({ children }: { children: React.ReactNode }) => {
	const modalRef = useRef<HTMLDialogElement>(null)

	return (
		<modalContext.Provider value={{ ref: modalRef }}>
			{children}
		</modalContext.Provider>
	)
}

const ModalBase = ({ children }: { children: React.ReactNode }) => {
	const localContext = useContext(modalContext)

	return (
		createPortal(
			<dialog
				ref={localContext.ref}
				onClick={(e) => {
					e.preventDefault()
					e.stopPropagation()
					localContext.ref?.current?.close()
				}}

				className={cx("top-0 z-50 w-screen min-h-screen bg-background/30 backdrop-blur-sm text-white", css`
						&[open]{
							display:flex;
							align-items: center;
							justify-content: center;
						}	
						`)}>
				{
					children
				}
			</dialog>,
			mountElement!
		)
	)
}

const ModalClose = ({ children }: { children: React.ReactNode }) => {
	const localContext = useContext(modalContext)

	return <div
		className="w-full h-full"
		onClick={(e) => {
			e.preventDefault()
			localContext.ref?.current?.close()
		}}>
		{children}
	</div>
}

const ModalOpen = ({ children }: { children: React.ReactNode }) => {
	const localContext = useContext(modalContext)

	return localContext.ref?.current && <div className="w-full h-full" onClick={(e) => {
		e.preventDefault()
		localContext.ref?.current?.showModal();
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
