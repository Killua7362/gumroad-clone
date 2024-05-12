import ProductCard from "@/ui/components/cards/ProductCard"
import { Fragment } from "react/jsx-runtime"
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { hideToastState, modalBaseActive, productsCardContextMenu } from "@/atoms/states";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router";
import { FaArrowDownWideShort, FaArrowUpShortWide } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { EditProductSchema } from "@/schema/edit_product_schema";
import Button from "@/ui/components/button";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/RootPage";
import { z } from "zod";
import { allProductsFetcher } from "@/query";

const ProductsHomePage = () => {
	const [contextMenuConfig, setContextMenuConfig] = useRecoilState(productsCardContextMenu)
	const setModalActive = useSetRecoilState(modalBaseActive)

	const navigate = useNavigate()

	const setToastRender = useSetRecoilState(hideToastState)

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

	const { data: allProductsData, isSuccess:productIsSuccess , isPending: productsIsLoading } = allProductsFetcher()

	const allProducts = useMemo(() => {
		return { ...allProductsData as ProductTypePayload }
	}, [allProductsData])

	const { mutateAsync: liveSetter } = useMutation({
		mutationFn: (payload: { key: string, live: boolean }) => fetch(`${window.location.origin}/api/products/${payload.key}`, {
			method: 'PATCH',
			credentials: 'include',
			body: JSON.stringify({ live: payload.live }),
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json()
		}),
		onSuccess: () => {
			setModalActive({
				active: false,
				type: ""
			})
			return queryClient.invalidateQueries({ queryKey: ['allProducts'] })
		},
		onError: (err) => {
			setToastRender({
				active: false,
				message: err.message
			})
		}
	})

	return !productsIsLoading && (
		<div className="w-full h-full flex flex-col gap-y-4">
			<div className="flex gap-x-3 items-center">
				<Button
					extraClasses={['rounded-xl']}
					buttonName="New Product"
					onClickHandler={() => {
						setModalActive({
							active: true,
							type: "new_product"
						})
					}} />
				<Button
					extraClasses={['rounded-xl']}
					buttonName="Filter"
					onClickHandler={() => {
					}} />
				<Button
					extraClasses={['rounded-xl', `${sortConfig.active && "!border-white"}`]}
					buttonName="Sort"
					isActive={sortConfig.active}
					onClickHandler={() => {
						!sortConfig.active ?
							setSortConfig(prev => {
								return { ...prev, active: true }
							})
							:
							setSortConfig(prev => {
								return { ...prev, active: false }
							})
					}} >

				</Button>
				<AnimatePresence>
					<motion.div
						initial={{
							width: '0rem',
						}}
						animate={{
							width: searchConfig.active ? '20rem' : '0rem',
							transition: {
								duration: 0.2
							}
						}}
						exit={{
							width: '0rem',
						}}
						layout={true}
						className={`min-h-[2.4rem] w-fit border-white/30 flex rounded-xl items-center ${searchConfig.active && "focus-within:border-white border-[0.1px] bg-background text-white"}`}>
						<Button buttonName=""
							isActive={searchConfig.active}
							extraClasses={["!text-lg !py-[0.82rem] !rounded-xl !border-0 !cursor-pointer", `${!searchConfig.active && "!border-[0.1px]"}`]}
							onClickHandler={() => {
								searchConfig.active ? setSearchConfig(prev => {
									return { ...prev, active: false }
								}) :
									setSearchConfig(prev => {
										return { ...prev, active: true }
									})
							}}
						>
							<FaSearch />
						</Button>
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
									onChange={(e) => {
										e.preventDefault()
										setSearchConfig(prev => {
											return { ...prev, startsWith: e.target.value }
										})
									}}
									placeholder="Enter title or summary..."
									className="h-full left-0 rounded-xl outline-none text-lg bg-background text-white" />
							}
						</AnimatePresence>
					</motion.div>
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{sortConfig.active &&
					<motion.div
						initial={{
							opacity: 0
						}}
						animate={{
							opacity: 1,
						}}
						exit={{
							opacity: 0
						}}
						transition={{ duration: 0.2 }}
						className="relative flex gap-x-3 items-center"
						onClick={(e) => {
							e.stopPropagation()
						}}
					>
						<motion.select
							className="rounded-xl text-base p-2 bg-background text-white border-white/30 border-[0.1px]" onChange={(e) => {

							}}>
							<option value="" >Sort By</option>
						</motion.select>
						<Button buttonName=""
							extraClasses={['!text-lg !rounded-xl']}
							onClickHandler={() => {
								sortConfig.reverse ? setSortConfig(prev => {
									return {
										...prev, reverse: false
									}
								}) : setSortConfig(prev => {
									return {
										...prev, reverse: true
									}
								})
							}} >
							{
								sortConfig.reverse ?
									<FaArrowUpShortWide />
									:
									<FaArrowDownWideShort />

							}
						</Button>
					</motion.div>
				}
			</AnimatePresence>
			<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
				{Object.keys(allProducts!).map((key, i) => {
					return (
						<ProductCard key={key} productData={{
							...allProducts![key]
						}} >
							<Fragment>
								<div className="absolute right-[1rem] top-[1rem] cursor-pointer hover:text-white/70 text-xl" onClick={(event) => {
									event.preventDefault()
									event.stopPropagation()
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
												onClick={async () => {
													setContextMenuConfig({
														active: false,
														activeIdx: i,
														id: key
													})
													try {
														EditProductSchema.parse({
															title: allProducts![key].title,
															price: allProducts![key].price,
															summary: allProducts![key].summary,
															description: allProducts![key].description,
															collabs: allProducts![key].collabs || [],
														})
														await liveSetter({ key: key, live: !allProducts![key].live })
													} catch (e) {
														if (e instanceof z.ZodError) {
															setToastRender({
																active: false,
																message: 'Some fields are empty'
															})
														}
													}
												}}
											>
												Go Live
											</div>
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
		</div >
	)
}

export default ProductsHomePage
