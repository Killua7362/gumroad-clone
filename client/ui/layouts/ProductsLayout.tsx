import { AnimatePresence, motion } from "framer-motion"
import { Fragment, useState } from "react"
import { Link, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { modalBaseActive } from "@/atoms/states";
import Button from "@/ui/components/button";

const ProductLayout = ({ children }: { children: React.ReactNode }) => {
	const params = useParams()

	const [modalActive, setModalActive] = useRecoilState(modalBaseActive)

	return (
		<div className="h-full w-full mb-14">
			<div className="h-full px-3 sm:mx-10 flex flex-col">
				<div className="flex flex-col text-white/90 pb-5 pt-3 sm:pb-6 sm:pt-6 mb-5 gap-y-7">
					<div className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide">
						Products
					</div>
					<div className="border-b-[1px] h-5 border-white/30 flex gap-x-4">
						<Link to='/products/home' className={`no-underline ${params.page && params.page === 'home' && 'cursor-default pointer-events-none'}`}>
							<Button buttonName="Home" extraClasses={[`!text-base !rounded-2xl ${params.page && params.page === 'home' && '!border-white'}`]} />
						</Link>
						<Link to='/products/collaborators' className={`no-underline ${params.page && params.page === 'collaborators' && 'cursor-default pointer-events-none'}`}>
							<Button buttonName="Collab" extraClasses={[`!text-base !rounded-2xl ${params.page && params.page === 'collaborators' && '!border-white'}`]} />
						</Link>
					</div>
				</div>
				{children}
			</div>
		</div >
	)
}
export default ProductLayout
