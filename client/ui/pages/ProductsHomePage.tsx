import ProductCard from "@/ui/components/cards/ProductCard"
import { Fragment } from "react/jsx-runtime"
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { AllProdctsForUser, modalBaseActive, productsCardContextMenu } from "@/atoms/states";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router";
import { FaArrowDownWideShort, FaArrowUpShortWide } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const ProductsHomePage = () => {
	const [contextMenuConfig, setContextMenuConfig] = useRecoilState(productsCardContextMenu)
	const setModalActive = useSetRecoilState(modalBaseActive)

	const allProducts = useRecoilValue(AllProdctsForUser)
	const navigate = useNavigate()

	const [searchConfig, setSearchConfig] = useState<searchConfig>({
		active: false,
		startsWith: ""
	})

	const [sortConfig, setSortConfig] = useState<sortConfig>({
		active: false,
		byType: "date",
		reverse: true
	})

	useEffect(() => {
		const closeContextMenu = () => {
			setContextMenuConfig({
				active: false,
				activeIdx: 0,
				id: ''
			})
		}
		document.body.addEventListener('click', closeContextMenu)
		return () => document.body.removeEventListener('click', closeContextMenu)
	}, [])

	return (
		<Fragment>
			<div className="flex gap-x-3 items-center">
				<div className={`px-4 py-2 w-fit text-black rounded-xl hover:bg-white/70 cursor-pointer bg-white hover:text-gray-800`}
					onClick={() => {
						setModalActive({
							active: true,
							type: "new_product"
						})
					}}
				>
					New Product
				</div>
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
				{Object.keys(allProducts).map((key, i) => {
					return (
						<ProductCard productData={{
							...allProducts[key]
						}} >
							<Fragment>
								<div className="absolute right-[1rem] top-[1rem] cursor-pointer hover:text-white/70 text-xl" onClick={(event) => {
									event.preventDefault()
									event.stopPropagation()
									console.log(key)
									contextMenuConfig.active ? setContextMenuConfig({
										active: false,
										activeIdx: i,
										id: key
									}) :
										setContextMenuConfig({
											active: true,
											activeIdx: i,
											id: key
										})
								}}>
									<IoMdSettings />
								</div>
								<AnimatePresence>
									{
										contextMenuConfig.active && contextMenuConfig.activeIdx === i &&
										<motion.div
											initial={{
												height: 0,
												opacity: 0,
											}}
											animate={{
												height: contextMenuConfig.active ? 'fit-content' : 0,
												opacity: contextMenuConfig.active ? 1 : 0,
												transition: {
													duration: 0.2
												}
											}}
											exit={{
												height: 0,
												opacity: 0,
											}}
											className="flex min-w-[10rem] overflow-hidden bg-background flex-col border-white/30 border-[0.1px] absolute rounded-md right-[1.5rem] top-[2.5rem] "
											onClick={(e) => {
												e.preventDefault()
												e.stopPropagation()
											}}>
											<div className="px-4 py-3 hover:bg-accent/50 cursor-pointer"
												onClick={() => {
													setContextMenuConfig({
														active: false,
														activeIdx: i,
														id: key
													})
													navigate(`/products/edit/${key}/home`)
												}}
											>Edit</div>
											<div className="px-4 py-3 hover:bg-accent/50 cursor-pointer"
												onClick={() => {
													setContextMenuConfig({
														active: false,
														activeIdx: i,
														id: key
													})
													setModalActive({
														active: true,
														type: 'delete_product'
													})
												}}
											>Delete</div>
										</motion.div>
									}
								</AnimatePresence>
							</Fragment>
						</ProductCard>
					)
				})}
			</div>
		</Fragment>
	)
}

export default ProductsHomePage
