import { AnimatePresence, motion } from "framer-motion"
import { Fragment, useState } from "react"
import { FaArrowDownWideShort, FaArrowUpShortWide } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Link, NavLink, useParams } from "react-router-dom";
import Button from "../components/button";

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
	const [sortConfig, setSortConfig] = useState<sortConfig>({
		active: false,
		byType: "date",
		reverse: true
	})

	const [searchConfig, setSearchConfig] = useState<searchConfig>({
		active: false,
		startsWith: ""
	})

	const params = useParams()

	return (
		<div className="h-full w-full">
			<div className="h-full px-3 sm:mx-10">
				<div className="flex flex-col text-white/90 pb-5 pt-3 sm:pb-0 sm:pt-6 mb-0 gap-y-10">
					<div className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide">
						Checkout
					</div>
					<div className="border-b-[1px] h-3 border-white/30 flex gap-x-4 z-20">
						<NavLink to='/checkout/form'
							style={{
								textDecoration: 'none'
							}}
							className={({ isActive }) => {
								return (isActive ? "cursor-default pointer-events-none" : "")
							}} >
							{({ isActive }) => (
								<Button buttonName="Form" isActive={isActive} extraClasses={[`!text-base !rounded-2xl`]} />
							)}
						</NavLink>
						<NavLink to='/checkout/suggestions'
							style={{
								textDecoration: 'none'
							}}
							className={({ isActive }) => {
								return (isActive ? "cursor-default pointer-events-none" : "")
							}} >
							{({ isActive }) => (
								<Button buttonName="Suggest" isActive={isActive} extraClasses={[`!text-base !rounded-2xl`]} />
							)}
						</NavLink>
					</div>
				</div>
				<div className="w-full flex flex-col gap-6">
					{children}
				</div>
			</div>
		</div >
	)
}
export default CheckoutLayout
