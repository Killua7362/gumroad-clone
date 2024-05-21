/** @jsxImportSource @emotion/react */
import '@/ui/styles/ProductEditContentPage'
import { Fragment } from "react/jsx-runtime"
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { RefObject, createRef, useEffect, useRef, useState } from "react";

import { PlaceholderExtension } from 'remirror/extensions';
import { EditorComponent, Remirror, Toolbar, useRemirror } from '@remirror/react';
import { MarkdownToolbar } from '@remirror/react'
import { cx, css } from '@emotion/css';
import { MarkdownEditor } from '@/ui/misc/markdown-editor';
import { IonItem, IonLabel, IonList, IonReorder, IonReorderGroup, IonRow, ItemReorderEventDetail } from '@ionic/react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRecoilState } from 'recoil';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '@/ui/components/button';
import ProductEditContentDeleteModal from '@/ui/components/modal/ProductEditContentDeleteModal';

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

const ProductEditContentPage = ({ productState }: { productState: productEditPageProps }) => {
	const { editProductState, setEditProductState } = productState

	const [reviewScore, setReviewScore] = useState(1)
	const [tempReviewScore, setTempReviewScore] = useState(1)
	const [reviewEdit, setReviewEdit] = useState(false)

	const [tempReviewDescription, setTempReviewDescription] = useState('')
	const [reviewDescription, setReviewDescripition] = useState('')

	const [searchParams, setSearchParams] = useSearchParams()

	const [renaming, setRenaming] = useState(false)

	const [inputRefs, setInputRefs] = useState<RefObject<HTMLInputElement>[]>([])
	const [contextActive, setContextActive] = useState<boolean[]>([])

	const [rendered, setRendered] = useState(false)

	const navigate = useNavigate()

	useEffect(() => {
		if (!searchParams.get('page') || Number(searchParams.get('page')!) > (editProductState.contents || []).length) {
			setSearchParams({ page: '1' })
		}
		setRendered(true)
	}, [])

	useEffect(() => {
		let temp1: RefObject<HTMLInputElement>[] = [];
		let temp2: boolean[] = [];
		for (let i = 0; i < (editProductState.contents || []).length; i++) {
			temp1 = [...temp1, createRef()]
			temp2 = [...temp2, false]
		}
		setInputRefs(temp1)
		setContextActive(temp2)
	}, [(editProductState.contents || []).length])

	return rendered && (
		<Fragment>
			<div className="flex justify-between md:justify-start md:flex-col gap-y-3 gap-x-6">
				<div className="border-white/30 border-[0.1px] rounded-md flex flex-col gap-y-4 justify-between">
					<div className="flex flex-col">
						<IonList>
							<IonReorderGroup
								disabled={false}
								onIonItemReorder={(event) => {
									setEditProductState(prev => {
										return { ...prev, contents: event.detail.complete(prev.contents) }
									})
									setSearchParams({ page: `${event.detail.to + 1 as number}` })
								}}
								className='flex flex-col gap-2'>
								{
									(editProductState.contents || []).map((e, i) => {
										return e && (
											<IonItem>
												<IonRow className={`justify-between flex-nowrap items-center px-2 py-0 overflow-none ${Number(searchParams.get('page')) === i + 1 && "bg-accent/80 text-white"} `}
													onClick={() => {
														if (inputRefs[i].current?.readOnly) {
															setSearchParams({ page: `${i + 1}` })
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
															className={`text-lg outline-none py-2 px-2 my-1 ${Number(searchParams.get('page')) === i + 1 ? "bg-accent/80 text-white" : "bg-background text-white"}`}
															placeholder='Untitled...'
															ref={inputRefs[i]}
															readOnly={true}
															value={(editProductState.contents || [])[i].name}
															onChange={(e) => {
																setEditProductState(prev => {
																	let temp = [...prev.contents || []]
																	temp[i].name = e.target.value
																	return { ...prev, contents: temp }
																})
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
														(editProductState.contents || []).length > 1 &&
														<ProductEditContentDeleteModal i={i} setPages={setPages} />
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
						setEditProductState(prev => {
							return { ...prev, contents: [...(prev.contents || []), { name: '', content: '' }] }
						})
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
										<div className="cursor-pointer"
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
					pageContent={(editProductState.contents || [])[(searchParams.get('page') || 1) as number - 1]?.content as string}
					setPages={setPages}
					key={searchParams.get('page')}
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
