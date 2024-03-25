import { AnimatePresence, motion } from "framer-motion"
import { Fragment, useState } from "react"
import { FaArrowDownWideShort, FaArrowUpShortWide } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const ProductLayout = ({ children }: { children: React.ReactNode }) => {
	const [sortConfig, setSortConfig] = useState<sortConfig>({
		active: false,
		byType: "date",
		reverse: true
	})

	const [searchConfig, setSearchConfig] = useState<searchConfig>({
		active: false
	})

	return (
		<div className="h-full w-full">
			<div className="h-full px-3 sm:mx-10">
				<div className="flex flex-col border-b-[1px] border-white/30 text-white/90 pb-5 pt-3 sm:pb-10 sm:pt-6 mb-4">
					<div className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide">
						Products
					</div>
				</div>
				<div className="flex gap-x-3 items-center">
					<div className={`px-4 py-2 w-fit text-black rounded-xl hover:bg-white/70 cursor-pointer bg-white hover:text-gray-800`}
						onClick={() => {
						}}
					>
						Filter
					</div>
					<div className={`px-4 py-2 w-fit rounded-xl hover:bg-white/80 hover:text-gray-800 cursor-pointer ${sortConfig.active ? "bg-white/90 text-gray-800" : "bg-white text-black"}`}
						onClick={() => {
							!sortConfig.active ?
								setSortConfig(prev => {
									return { ...prev, active: true }
								})
								:
								setSortConfig(prev => {
									return { ...prev, active: false }
								})
						}}
					>
						Sort
					</div>
					<AnimatePresence>
						{sortConfig.active &&
							<motion.div
								initial={{
									left: '-5rem',
									opacity: 0
								}}
								animate={{
									left: 0,
									opacity: 1,
								}}
								exit={{
									left: '-5rem',
									opacity: 0
								}}
								transition={{ duration: 0.2 }}
								className="relative flex gap-x-3 items-center"
							>
								<motion.select
									className="rounded-xl p-2" onChange={(e) => {

									}}>
									<option value="" >Sort By</option>
								</motion.select>
								<motion.div className="text-black text-base bg-white rounded-xl p-1 px-4 cursor-pointer" onClick={() => {
									sortConfig.reverse ? setSortConfig(prev => {
										return {
											...prev, reverse: false
										}
									}) : setSortConfig(prev => {
										return {
											...prev, reverse: true
										}
									})
								}}>
									{
										sortConfig.reverse ?
											<FaArrowUpShortWide />
											:
											<FaArrowDownWideShort />

									}
								</motion.div>
							</motion.div>
						}
					</AnimatePresence>
					<motion.div
						initial={{
							width: '0rem',
							background: '#09090B'
						}}
						animate={{
							width: searchConfig.active ? '20rem' : '2rem',
							background: searchConfig.active ? 'white' : '#09090B',
							color: searchConfig.active ? 'black' : 'white'

						}}
						exit={{
							width: '0rem',
							background: '#09090B'

						}}

						transition={{
							duration: 1.2
						}}

						className={`h-[2.35rem] flex items-center p-2 rounded-xl focus-within:border-[2px] border-primary gap-x-2`}>
						<div className="w-fit h-fit">
							<FaSearch className="cursor-pointer" onClick={() => {
								searchConfig.active ? setSearchConfig(prev => {
									return { ...prev, active: false }
								}) :
									setSearchConfig(prev => {
										return { ...prev, active: true }
									})
							}} />
						</div>
						<AnimatePresence>
							{searchConfig.active &&
								<motion.input className="w-full h-full rounded-xl focus:outline-none text-base" />
							}
						</AnimatePresence>
					</motion.div>
				</div>
				{children}
			</div>
		</div >
	)
}
export default ProductLayout
