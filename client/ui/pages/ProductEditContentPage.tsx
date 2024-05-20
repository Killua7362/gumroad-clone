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
import * as Modal from '@/ui/components/modal'
import Button from '@/ui/components/button';


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

const ProductEditContentPage = ({ editProductState, setEditProductState }: { editProductState: ProductType, setEditProductState: React.Dispatch<React.SetStateAction<ProductType>> }) => {
	const [reviewScore, setReviewScore] = useState(1)
	const [tempReviewScore, setTempReviewScore] = useState(1)
	const [reviewEdit, setReviewEdit] = useState(false)

	const [tempReviewDescription, setTempReviewDescription] = useState('')
	const [reviewDescription, setReviewDescripition] = useState('')

	const [searchParams, setSearchParams] = useSearchParams()

	const [pages, setPages] = useState<PageSchema[]>([
		{
			name: "page 1",
			content: ""
		}])

	const [renaming, setRenaming] = useState(false)

	const [inputRefs, setInputRefs] = useState<RefObject<HTMLInputElement>[]>([])
	const [contextRefs, setContextRefs] = useState<RefObject<HTMLDivElement>[]>([])

	const [rendered, setRendered] = useState(false)

	const navigate = useNavigate()

	useEffect(() => {
		if (!searchParams.get('page') || Number(searchParams.get('page')!) > pages.length) {
			setSearchParams({ page: '1' })
		}
		setRendered(true)
	}, [])

	useEffect(() => {
		let temp1: RefObject<HTMLInputElement>[] = [];
		let temp2: RefObject<HTMLDivElement>[] = [];
		for (let i = 0; i < pages.length; i++) {
			temp1 = [...temp1, createRef()]
			temp2 = [...temp2, createRef()]
		}
		setInputRefs(temp1)
		setContextRefs(temp2)
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
									setPages(() => {
										return event.detail.complete(pages)
									})
									setSearchParams({ page: `${event.detail.to + 1 as number}` })
								}}
								className='flex flex-col gap-2'>
								{
									pages.map((e, i) => {
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
															value={pages[i].name}
															onChange={(e) => {
																setPages(prev => {
																	let temp = [...prev]
																	temp[i].name = e.target.value
																	return [...temp]
																})
															}}
															onBlur={() => {
																inputRefs[i].current!.readOnly = true
															}} />
													</IonLabel>
													<BsThreeDotsVertical className='cursor-pointer hover:text-accent/50' onClick={(event) => {
														event.stopPropagation();
														if (contextRefs[i].current) {
															contextRefs[i].current!.hidden = !contextRefs[i].current?.hidden
														}
													}} />
												</IonRow>
												<div
													ref={contextRefs[i]}
													hidden={true}
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
														<Modal.Root key={i}>
															<Modal.Base>
																<div className="bg-background z-50 border-white/30 rounded-xl min-w-[15rem] border-[0.1px] p-6 text-lg flex flex-col gap-y-6 items-center">
																	<div className="text-xl">
																		Confirm Delete?
																	</div>
																	<div className="flex gap-x-4">
																		<Modal.Close>
																			<Button
																				buttonName="Cancel"
																				type="button"
																			/>
																		</Modal.Close>
																		<Modal.Close>
																			<Button buttonName="Confirm"
																				type="button" onClickHandler={() => {
																					setPages((prev) => {
																						return prev.filter((_, index) => index !== i)
																					})
																				}}
																				extraClasses={['!border-red-500/70 !text-red-500 hover:text-red-500/70']} />
																		</Modal.Close>
																	</div>
																</div>
															</Modal.Base>
															<Modal.Open>
																<div className='p-4 py-3 bg-white text-black w-full cursor-pointer hover:bg-white/90'>
																	Delete
																</div>
															</Modal.Open>
														</Modal.Root>
													}
												</div>
											</IonItem>
										)
									})
								}
							</IonReorderGroup>
						</IonList>
					</div>
					<Button buttonName='Add page' extraClasses={[`!w-full`]} onClickHandler={() => {
						setPages(prev => {
							return [...prev, {
								name: "",
								content: ''
							}]
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
					<div className={`border-white/30 border-[0.1px] w-full text-center py-2 rounded-md text-lg bg-white text-black hover:bg-white/80 cursor-pointer`}
						onClick={() => {
							reviewEdit ? setReviewEdit(false) : setReviewEdit(true)
							if (reviewEdit) {
								setReviewDescripition(tempReviewDescription)
							}
						}}>
						{
							reviewEdit ? "Save Changes" : "Edit Review"
						}
					</div>
				</div>
			</div>
			<div className={cx(
				markDownStyle,
				'w-full left-0 overflow-hidden mr-14'
			)}>
				<MarkdownEditor
					pageContent={pages[(searchParams.get('page') || 1) as number - 1]?.content as string}
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
