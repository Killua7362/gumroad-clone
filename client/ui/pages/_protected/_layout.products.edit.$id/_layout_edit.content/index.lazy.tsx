import { createContext, createRef, Fragment, RefObject, useContext, useEffect, useRef, useState } from "react";

import { PlaceholderExtension } from 'remirror/extensions';
import { EditorComponent, Remirror, Toolbar, useRemirror } from '@remirror/react';
import { MarkdownToolbar } from '@remirror/react'
import { cx, css } from '@emotion/css';
import { MarkdownEditor } from '@/ui/misc/markdown-editor';
import { IonItem, IonLabel, IonList, IonReorder, IonReorderGroup, IonRow, ItemReorderEventDetail } from '@ionic/react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRecoilState } from 'recoil';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@/ui/components/button';
import ProductEditContentDeleteModal from '@/ui/components/modal/ProductEditContentDeleteModal';
import { productEditContext } from "../_layout_edit";
import { useFieldArray } from 'react-hook-form';
import { createLazyFileRoute } from '@tanstack/react-router';
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { ProductContentSearchType } from ".";

export const Route = createLazyFileRoute('/_protected/_layout/products/edit/$id/_layout_edit/content/')({
	component: () => {
		return <ProductEditContentPage />
	},
})

const markDownStyle = css`
	.remirror-theme{
			@media (min-width: 1280px){
			width: 96% !important;
			}

			@media (min-width: 1024px) and (max-width: 1280px){
			width: 94% !important;
			}

			@media (min-width: 768px)  and (max-width:1024px) {
				width: 92% !important;
			}

			@media (min-width: 640px) and (max-width:768px) {
				width: 85% !important;
			}

			width: 97% !important;

			.ProseMirror{
				padding:0 !important;
				min-height:60vh !important;
				overflow:hidden !important;
				box-shadow:none !important;
			}
			.ProseMirror:focus{
				box-shadow:none;
				overflow:hidden !important;
			}
			.MuiStack-root{
				background-color:#09090B;
				border:rgba(255,255,255,0.6) 0.3px solid;
				padding:8px;
				border-radius:0.375rem;
				display:flex;
				flex-wrap:wrap;
				gap:8px;
				@media (min-width: 768px){
					width:fit-content;
				}
				width:100%;
				.MuiBox-root{
					display:flex;
					gap:5px;
					background-color:#09090B;
					margin:0;
					.MuiButtonBase-root{
						background-color:#09090B;
						svg{
							color:white;
							height:1rem;
							width:1rem;
						}
					}
					.Mui-selected{
						background-color:white;
						svg{
							color:black;
							height:1rem;
							width:1rem;
						}
					}
				}
			}

		}
		`

const ProductEditContentPage = () => {
	const localProductEditContext = useContext(productEditContext)
	const { control, watch, setValue, getValues } = localProductEditContext!

	const { append, remove, fields } = useFieldArray({
		name: 'contents',
		control
	})

	const pages = watch('contents') || []

	const [reviewScore, setReviewScore] = useState(1)
	const [tempReviewScore, setTempReviewScore] = useState(1)
	const [reviewEdit, setReviewEdit] = useState(false)

	const [tempReviewDescription, setTempReviewDescription] = useState('')
	const [reviewDescription, setReviewDescripition] = useState('')

	const searchParams = Route.useSearch()
	const navigate = Route.useNavigate()

	const [renaming, setRenaming] = useState(false)

	const [inputRefs, setInputRefs] = useState<RefObject<HTMLInputElement>[]>([])
	const [contextActive, setContextActive] = useState<boolean[]>([])

	const [rendered, setRendered] = useState(false)

	useEffect(() => {
		if (searchParams.page! > pages.length) {
			navigate({
				search: (prev: ProductContentSearchType) => ({ ...prev, page: 1 }),
				state: {
					...getValues()
				},
				replace: true
			})
		}
		setRendered(true)
	}, [])

	useEffect(() => {
		let temp1: RefObject<HTMLInputElement>[] = [];
		let temp2: boolean[] = [];
		for (let i = 0; i < pages.length; i++) {
			temp1 = [...temp1, createRef()]
			temp2 = [...temp2, false]
		}
		setInputRefs(temp1)
		setContextActive(temp2)
	}, [pages.length])

	return rendered && (
		<Fragment>
			<div className="flex justify-between md:justify-start md:flex-col gap-y-3 gap-x-6">
				<div className="border-white/30 border-[0.1px] rounded-md flex flex-col gap-y-4 justify-between">
					<div className="flex flex-col">
						<IonList>
							<IonReorderGroup
								disabled={false}
								onIonItemReorder={(event) => {
									setValue('contents', event.detail.complete(pages),{shouldDirty:true,shouldValidate:true})
									navigate({
										search: (prev: ProductContentSearchType) => ({ ...prev, page: (event.detail.to + 1 as number) }),
										state: {
											...getValues()
										},
										replace: true
									})
								}}
								className='flex flex-col gap-2'>
								{
									fields.map((e, i) => {
										return (
											<IonItem key={e.id}>
												<IonRow className={`justify-between flex-nowrap items-center px-2 py-0 overflow-none ${searchParams.page === i + 1 && "bg-accent/80 text-white"} `}
													onClick={() => {
														if (inputRefs[i].current?.readOnly) {
															navigate({
																search: (prev: ProductContentSearchType) => ({ ...prev, page: i + 1 }),
																state: {
																	...getValues()
																},
																replace: true
															})
														}
													}}
													onKeyDown={(e) => {
														if (e.key === 'Enter' && inputRefs[i].current?.readOnly === false) {
															inputRefs[i].current!.readOnly = true
														}
													}}
												>
													<IonReorder className='mt-[0.35rem] mr-[0.3rem]' />
													<IonLabel>
														<input
															className={`text-lg outline-none py-2 px-2 my-1 ${searchParams.page === i + 1 ? "bg-accent/80 text-white" : "bg-background text-white"}`}
															placeholder='Untitled...'
															ref={inputRefs[i]}
															readOnly={true}
															value={pages[i].name}
															onChange={(e) => {
																setValue(`contents.${i}.name`, e.target.value,{shouldDirty:true,shouldValidate:true})
															}}
															onBlur={() => {
																inputRefs[i].current!.readOnly = true
															}} />
													</IonLabel>
													<BsThreeDotsVertical className='cursor-pointer hover:text-accent/50' onClick={(event) => {
														event.stopPropagation();
														setContextActive(prev => {
															let temp: boolean[] = [...prev]
															temp[i] = !temp[i]
															return temp
														})
													}} />
												</IonRow>
												<motion.div
													layout
													style={{
														display: contextActive[i] ? 'block' : 'none',
														position: 'relative',
														height: contextActive[i] ? 'fit-content' : '0',
														opacity: contextActive[i] ? '1' : '0',
														originX: '0px',
														originY: '0px',
														originZ: '0px',
													}}
													transition={{
														layout: { duration: 0.2 },
													}}

												>
													<div
														className='p-4 py-3 bg-white text-black cursor-pointer hover:bg-white/90'
														onClick={() => {
															inputRefs[i].current!.readOnly = false
															inputRefs[i].current?.focus()
														}}>
														Rename
													</div>
													{
														pages.length > 1 &&
														<ProductEditContentDeleteModal i={i} remove={remove} />
													}
												</motion.div>
											</IonItem>
										)
									})
								}
							</IonReorderGroup>
						</IonList>
					</div>
					<Button buttonName='Add page' extraClasses={[`!w-full`]} onClickHandler={() => {
						append({ name: '', content: '' })
					}} />
				</div>
				<div className="flex flex-col w-fit md:w-full border-white/30 border-[0.1px] h-fit rounded-md p-5 justify-center items-center gap-y-3">
					<div className="p-2 text-2xl">
						Review
					</div>
					<div className="flex gap-x-4 px-1 justify-between w-full">
						<div className="text-lg">
							Your Rating:
						</div>
						<div className="flex my-[0.1rem]">
							{
								new Array(5).fill(0).map((e, i) => {
									return (
										<div key={`review_star_${i}`} className="cursor-pointer"
											onMouseEnter={() => {
												reviewEdit && setTempReviewScore(i + 1)
											}}
											onMouseLeave={() => { reviewEdit && setTempReviewScore(reviewScore) }}
											onClick={() => { reviewEdit && setReviewScore(i + 1) }}>
											{
												i < tempReviewScore ?
													<FaStar />
													:
													<CiStar />

											}
										</div>
									)
								})
							}
						</div>
					</div>
					{
						reviewEdit ?
							<div>
								<fieldset className="border-white/30 border-[0.1px] rounded-md focus-within:border-white">
									<textarea className="bg-background text-white outline-none text-base resize-y" value={tempReviewDescription} onChange={(e) => {
										setTempReviewDescription(e.currentTarget.value)
									}} />
								</fieldset>
							</div> :
							<div className="text-base w-full">
								{
									reviewDescription === "" ? "No Review" : reviewDescription
								}
							</div>
					}
					<Button extraClasses={[`!w-full`]} buttonName={reviewEdit ? 'Save Changes' : 'Edit Review'} onClickHandler={() => {
						reviewEdit ? setReviewEdit(false) : setReviewEdit(true)
						if (reviewEdit) {
							setReviewDescripition(tempReviewDescription)
						}
					}} />
				</div>
			</div>
			<div className={cx(
				markDownStyle,
				'w-full left-0 overflow-hidden mr-14'
			)}>
				<MarkdownEditor
					pageContent={pages[(searchParams.page || 1) as number - 1]?.content as string}
					key={searchParams.page}
					placeholder="start typing..."
					theme={{
						color: {
							outline: '#09090B',
							text: 'white'
						},
					}}>
				</MarkdownEditor>
			</div>
		</Fragment >
	)
}


export default ProductEditContentPage
