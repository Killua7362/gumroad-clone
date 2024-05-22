import ProductCard from "@/ui/components/cards/ProductCard"
import { Fragment } from "react/jsx-runtime"
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { hideToastState } from "@/atoms/states";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router";
import { FaArrowDownWideShort, FaArrowUpShortWide } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { EditProductSchema } from "@/forms/schema/edit_product_schema";
import Button from "@/ui/components/button";
import { queryClient } from "@/app/RootPage";
import { z } from "zod";
import { allProductsFetcher } from "@/react-query/query"
import debounce from 'lodash.debounce'
import { useSearchParams } from "react-router-dom";
import { getProductCreater, getProductDeleter, getProductLiveToggle } from "@/react-query/mutations";
import { NewProductSchema } from "@/forms/schema/new_product_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import NewProductModal from "@/ui/components/modal/NewProductModal";
import DeleteProductModal from "../components/modal/DeleteProductModal";

const ProductsHomePage = () => {
	const [contextMenuConfig, setContextMenuConfig] = useState<ProductsCardContextMenu>({
		active: false,
		activeIdx: -1
	})

	const setToastRender = useSetRecoilState(hideToastState)

	const navigate = useNavigate()

	const [searchBarActive, setSearchBarActive] = useState<boolean>(false)
	const [searchParams, setSearchParams] = useSearchParams()

	const debounceSearchInput = useCallback(debounce((value: string) => {
		searchParams.set('search_word', value)
		setSearchParams(searchParams)
	}, 300), [])

	const [sortBarActive, setSortBarActive] = useState(false)

	useEffect(() => {
		const closeContextMenu = () => {
			setContextMenuConfig({
				active: false,
				activeIdx: 0,
			})
		}
		document.body.addEventListener('click', closeContextMenu)
		return () => document.body.removeEventListener('click', closeContextMenu)
	}, [])

	useEffect(() => {
		if (!searchParams.get('search_word')) {
			searchParams.delete('search_word')
			setSearchParams(searchParams)
		}
	}, [searchParams.get('search_word')])

	const { data: allProducts, isSuccess: productIsSuccess, isPending: productsIsLoading } = allProductsFetcher()

	const sortFunction = ([keyA, valueA]: [keyA: string, valueA: ProductType], [keyB, valueB]: [keyB: string, valueB: ProductType]) => {
		switch (searchParams.get('sort_by')) {
			case 'title':
				return (((valueA.title as any) - (valueB.title as any)))
			default:
				return (valueA.price - valueB.price)
		}
	}

	const searchFunction = ({ products }: { products: Entries<ProductTypePayload> }) => {
		return products.filter(([key, value], id) => (value.title.toLowerCase().includes(searchParams.get('search_word') || "")))
	}

	const processProducts = ({ allProducts }: { allProducts: ProductTypePayload }) => {
		const products: Entries<ProductTypePayload> = Object.entries(allProducts)
		return searchFunction({ products }).sort((a, b) => {
			return sortFunction(a, b) * (searchParams.get('sort_reverse') === 'true' ? -1 : 1)
		})
	}

	const { mutate: liveSetter } = getProductLiveToggle()


	return !productsIsLoading && (
		<div className="w-full h-full flex flex-col gap-y-4">
			<div className="flex gap-x-3 items-center">
				<NewProductModal />
				<Button
					extraClasses={['rounded-xl']}
					buttonName="Filter"
					onClickHandler={() => {
					}} />
				<Button
					extraClasses={['rounded-xl', `${sortBarActive && "!border-white"}`]}
					buttonName="Sort"
					isActive={sortBarActive}
					onClickHandler={() => {
						setSortBarActive(!sortBarActive)
					}} >

				</Button>
				<AnimatePresence>
					<motion.div
						layout={true}
						transition={{ duration: 0.1 }}
						className={`min-h-[2.4rem] w-fit border-white/30 flex rounded-xl items-center ${searchBarActive && "focus-within:border-white border-[0.1px] bg-background text-white"}`}>
						<Button buttonName=""
							isActive={searchBarActive}
							extraClasses={["!text-lg !py-[0.82rem] !rounded-xl !cursor-pointer", `${searchBarActive && "!border-0"}`]}
							onClickHandler={() => {
								setSearchBarActive(!searchBarActive)
							}}
						>
							<FaSearch />
						</Button>
						<AnimatePresence>
							{searchBarActive &&
								<motion.input
									initial={{
										width: 0
									}}
									animate={{
										width: '20rem',
										transition: {
											duration: 0.2,
											delay: 0.2
										}
									}}
									exit={{
										width: 0
									}}
									onChange={(e) => {
										e.preventDefault()
										debounceSearchInput(e.target.value)

									}}
									placeholder="Enter title..."
									className="h-full left-0 rounded-xl outline-none text-lg bg-background text-white" />
							}
						</AnimatePresence>
					</motion.div>
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{sortBarActive &&
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
							className="rounded-xl text-base p-2 bg-background text-white border-white/30 border-[0.1px]"
							defaultValue={searchParams.get('sort_by') || 'title'}
							onChange={(e) => {
								e.preventDefault()
								searchParams.set('sort_by', e.target.value)
								setSearchParams(searchParams)
							}}
						>
							<option value="title" >Title</option>
							<option value="price" >Price</option>
							<option value="created_date" >Created Date</option>
							<option value="modified_date" >Modified Date</option>
						</motion.select>

						<Button buttonName=""
							extraClasses={['!text-lg !rounded-xl']}
							onClickHandler={() => {
								searchParams.get('sort_reverse') === 'true' ? searchParams.set('sort_reverse', 'false') : searchParams.set('sort_reverse', 'true')
								setSearchParams(searchParams)
							}} >
							{
								searchParams.get('sort_reverse') === 'true' ?
									<FaArrowUpShortWide />
									:
									<FaArrowDownWideShort />

							}
						</Button>
					</motion.div>
				}
			</AnimatePresence>
			<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
				{processProducts({ allProducts }).map(([key, value], i) => {
					return (
						<ProductCard key={key} productData={{
							...value
						}} >
							<Fragment>
								<div className="absolute right-[1rem] top-[1rem] cursor-pointer hover:text-white/70 text-xl" onClick={(event) => {
									event.preventDefault()
									event.stopPropagation()
									contextMenuConfig.active ? setContextMenuConfig({
										active: false,
										activeIdx: i,
									}) :
										setContextMenuConfig({
											active: true,
											activeIdx: i,
										})
								}}>
									<IoMdSettings />
								</div>
								<AnimatePresence>
									{
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
											className={` ${(contextMenuConfig.active && contextMenuConfig.activeIdx === i) ? "flex" : "hidden"} min-w-[10rem] overflow-hidden bg-background flex-col border-white/30 border-[0.1px] absolute rounded-md right-[1.5rem] top-[2.5rem]`}
											onClick={(e) => {
												e.preventDefault()
												e.stopPropagation()
											}}
										>
											<div className="px-4 py-3 hover:bg-accent/50 cursor-pointer"
												onClick={async () => {
													try {
														EditProductSchema.parse({
															title: value.title,
															price: value.price,
															summary: value.summary,
															description: value.description,
															collabs: value.collabs || [],
															contents: value.contents || []
														})
														await liveSetter({ key: key, live: !value.live })
													} catch (e) {
														if (e instanceof z.ZodError) {
															setToastRender({
																active: false,
																message: 'Some fields are empty'
															})
														}
													}

													setContextMenuConfig(prev => {
														return { ...prev, active: false }
													})
												}}
											>
												Go Live
											</div>
											<div className="px-4 py-3 hover:bg-accent/50 cursor-pointer"
												onClick={() => {
													navigate(`/products/edit/${key}/home`)
												}}
											>
												Edit
											</div>
											<DeleteProductModal idx={key} setContextMenuConfig={setContextMenuConfig} />
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
