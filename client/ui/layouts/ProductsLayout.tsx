import { AnimatePresence, motion } from "framer-motion"
import { Fragment, useState } from "react"
import { FaArrowDownWideShort, FaArrowUpShortWide } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

const ProductLayout = ({ children }: { children: React.ReactNode }) => {
	const [sortConfig, setSortConfig] = useState<sortConfig>({
		active: false,
		byType: "date",
		reverse: true
	})

	const [searchConfig, setSearchConfig] = useState<searchConfig>({
		active: false
	})

	const params = useParams()

	return (
		<div className="h-full w-full mb-14">
			<div className="h-full px-3 sm:mx-10">
				<div className="flex flex-col text-white/90 pb-5 pt-3 sm:pb-6 sm:pt-6 mb-6 gap-y-10">
					<div className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide">
						Products
					</div>
					<div className="border-b-[1px] h-3 border-white/30 flex gap-x-4">
						<Link to='/products/home' className={`no-underline ${params.page && params.page === 'home' && 'cursor-default pointer-events-none'}`}>
							<span className={`border-white/30 border-[0.1px] rounded-2xl px-3 py-2 w-fit h-fit ${params.page && params.page === 'home' ? 'bg-white text-black' : 'bg-background text-white hover:bg-accent'} `}>
								Home
							</span>
						</Link>
						<Link to='/products/collaborators' className={`no-underline ${params.page && params.page === 'collaborators' && 'cursor-default pointer-events-none'}`}>
							<span className={`border-white/30 border-[0.1px] rounded-2xl px-3 py-2 w-fit h-fit ${params.page && params.page === 'collaborators' ? 'bg-white text-black' : 'bg-background text-white hover:bg-accent'} `}>
								Collab
							</span>
						</Link>
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
					<AnimatePresence>
						<motion.div
							initial={{
								width: '0rem',
								padding: '0rem'
							}}
							animate={{
								width: searchConfig.active ? '20rem' : '0rem',
								paddingLeft: '0.5rem',
								transition: {
									duration: 0.2
								}
							}}
							exit={{
								width: '0rem',
								padding: '0rem'
							}}
							layout={false}
							className={`h-[2.4rem] w-full focus-within:border-[2px] border-primary flex gap-x-2 rounded-xl items-center ${searchConfig.active && "bg-white text-black"}`}>
							<div
								className="w-fit h-fit text-base mt-1">
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
									<motion.input
										initial={{
											width: 0
										}}
										animate={{
											width: '100%',
											transition: {
												duration: 0.2
											}
										}}
										exit={{
											width: 0
										}}
										className="h-full rounded-xl focus:outline-none text-lg leading-0" />
								}
							</AnimatePresence>
						</motion.div>
					</AnimatePresence>
				</div>

				<div className="w-full mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
					{children}
				</div>
			</div>
		</div >
	)
}
export default ProductLayout
