import ProductCard from "@/ui/components/cards/ProductCard"
import { Fragment } from "react/jsx-runtime"
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { AllProdctsForUser, modalBaseActive, productsCardContextMenu } from "@/atoms/states";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router";

const ProductsHomePage = () => {
	const [contextMenuConfig, setContextMenuConfig] = useRecoilState(productsCardContextMenu)
	const setModalActive = useSetRecoilState(modalBaseActive)

	const allProducts = useRecoilValue(AllProdctsForUser)
	const navigate = useNavigate()

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
		</Fragment>
	)
}

export default ProductsHomePage
