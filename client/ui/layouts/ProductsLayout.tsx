import { AnimatePresence, motion } from "framer-motion"
import { Fragment, useState } from "react"
import { Link, NavLink } from "react-router-dom";
import { useRecoilState } from "recoil";
import Button from "@/ui/components/button";

const ProductLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full w-full mb-14">
			<div className="h-full px-3 sm:mx-10 flex flex-col">
				<div className="flex flex-col text-white/90 pb-5 pt-3 sm:pb-6 sm:pt-6 mb-5 gap-y-7">
					<div className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide">
						Products
					</div>
					<div className="border-b-[1px] h-5 border-white/30 flex gap-x-4">
						<NavLink to='/products/home'
							style={{
								textDecoration: 'none'
							}}
							className={({ isActive }) => {
								return (isActive ? "cursor-default pointer-events-none" : "")
							}} >
							{({ isActive }) => (
								<Button buttonName="Home" isActive={isActive} extraClasses={[`!text-base !rounded-2xl`]} />
							)}
						</NavLink>
						<NavLink
							to='/products/collaborators'
							className={({ isActive }) => {
								return (isActive ? "cursor-default pointer-events-none" : "")
							}}
							style={{
								textDecoration: 'none'
							}}
						>
							{({ isActive }) => (
								<Button buttonName="Collab" isActive={isActive} extraClasses={[`!text-base !rounded-2xl`]} />
							)}
						</NavLink>
					</div>
				</div>
				{children}
			</div>
		</div >
	)
}
export default ProductLayout
