/** @jsxImportSource @emotion/react */
import '@/ui/styles/ProductEditContentPage'
import { Fragment } from "react/jsx-runtime"
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { RefObject, createRef, useEffect, useRef, useState } from "react";

import { PlaceholderExtension } from 'remirror/extensions';
import { EditorComponent, Remirror, Toolbar, useRemirror } from '@remirror/react';
import { MarkdownToolbar } from '@remirror/react'
import { css } from '@emotion/css';
import { MarkdownEditor } from '@/ui/misc/markdown-editor';
import { IonItem, IonLabel, IonList, IonReorder, IonReorderGroup, IonRow, ItemReorderEventDetail } from '@ionic/react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRecoilState } from 'recoil';
import { productsEditContentContextMenu } from '@/atoms/states';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';

const markDownStyle = css`
		width:100%;
		.remirror-theme{
			.ProseMirror{
				min-height:60vh !important;
				overflow-y:hidden !important;
			}
			.ProseMirror:focus{
				box-shadow:none;
			}
			.MuiStack-root{
				background-color:#09090B;
				border:rgba(255,255,255,0.6) 0.3px solid;
				padding:4px;
				border-radius:0.375rem;
				display:flex;
				gap:8px;
				width:fit-content;
				.MuiDivider-root{
					border-color:rgba(255,255,255,0.6);
				}
				.MuiBox-root{
					display:flex;
					gap:5px;
					background-color:#09090B;
					.MuiButtonBase-root{
						background-color:#09090B;
						svg{
							color:white;
							height:1.2rem;
							width:1.2rem;
						}
					}
					.Mui-selected{
						background-color:white;
						svg{
							color:black;
							height:1.2rem;
							width:1.2rem;
						}
					}
				}
			}

		}
		`
interface PageSchema {
	name: string;
	content: string;
}

const ProductEditContentPage = () => {
	const [reviewScore, setReviewScore] = useState(1)
	const [tempReviewScore, setTempReviewScore] = useState(1)
	const [reviewEdit, setReviewEdit] = useState(false)

	const [tempReviewDescription, setTempReviewDescription] = useState('')
	const [reviewDescription, setReviewDescripition] = useState('')

	const [value, setValue] = useState('<p></p>')
	const [searchParams, setSearchParams] = useSearchParams()

	const { manager, state } = useRemirror({
		extensions: () => [new PlaceholderExtension({ placeholder: `Start Typing here` })],
		content: "",
		selection: "end",
		stringHandler: "html"
	});

	const [pages, setPages] = useState<PageSchema[]>([
		{
			name: "page 1",
			content: ""
		}])

	const [contextMenu, setContextMenu] = useRecoilState<productsEditContentContextMenu>(productsEditContentContextMenu)
	const [renaming, setRenaming] = useState(false)

	const [inputRefs, setInputRefs] = useState<RefObject<HTMLInputElement>[]>([])
	const [rendered, setRendered] = useState(false)

	const navigate = useNavigate()

	useEffect(() => {
		if (!searchParams.get('page') || Number(searchParams.get('page')!) > pages.length) {
			setSearchParams({ page: '1' })
		}
		setRendered(true)
	}, [])

	useEffect(() => {
		let temp: RefObject<HTMLInputElement>[] = [];
		for (let i = 0; i < pages.length; i++) {
			temp = [...temp, createRef()]
		}
		setInputRefs(temp)
	}, [pages])

	return rendered && (
		<Fragment>
			<div className="flex flex-col gap-y-3">
				<div className="border-white/30 border-[0.1px] rounded-md flex flex-col gap-y-4">
					<div className="flex flex-col">
						<IonList>
							<IonReorderGroup disabled={contextMenu.active} onIonItemReorder={(event) => { event.detail.complete() }} className='flex flex-col gap-2'>
								{
									pages.map((e, i) => {
										return e && (
											<IonItem >
												<IonRow className={`justify-between flex-nowrap items-center p-2 overflow-none ${Number(searchParams.get('page')) === i + 1 && "bg-accent/80 text-white"}`}
													onClick={() => {
														if (inputRefs[i].current?.readOnly) {
															setSearchParams({ page: `${i + 1}` })
														}
													}}
												>
													<IonReorder className='mt-[0.35rem] mr-[0.3rem]'>
													</IonReorder>
													<IonLabel>
														<input className={`text-lg outline-none ${inputRefs[i]?.current?.readOnly === false ? "cursor-text" : 'cursor-pointer'} ${Number(searchParams.get('page')) === i + 1 ? "bg-accent/80 text-white" : "bg-background text-white"}`} placeholder='Untitled...' ref={inputRefs[i]} readOnly={true} onBlur={(event) => {
															event.currentTarget.readOnly = true
														}} />
													</IonLabel>
													<BsThreeDotsVertical className='cursor-pointer hover:text-accent/50' onClick={(event) => {
														event.stopPropagation();
														!contextMenu.active ?
															setContextMenu({ active: true, points: [event.clientX, event.clientY], pageId: i.toString() }) :
															setContextMenu(prev => {
																return {
																	...prev,
																	active: false,
																}
															})
													}} />
													<AnimatePresence>
														{
															contextMenu?.active && contextMenu.pageId === i.toString() &&
															<motion.div
																initial={{
																	opacity: 0,
																}}
																animate={{
																	opacity: contextMenu.active ? 1 : 0,
																	transition: {
																		duration: 0.1
																	}
																}}
																exit={{
																	opacity: 0,
																}}
																className='absolute bg-background text-white flex flex-col mt-[6.5rem] left-[12.5rem] rounded-md text-base border-white/30 border-[0.1px]'
																onClick={(event) => {
																	event.stopPropagation()
																}}
															>
																<div className='hover:text-white/80 cursor-pointer px-5 py-2 hover:bg-accent/50' onClick={() => {
																	inputRefs[i].current!.readOnly = false
																	inputRefs[i].current?.focus()
																	setContextMenu(prev => {
																		return {
																			...prev,
																			active: false,
																		}
																	})

																}}>
																	Rename
																</div>
																<div className='hover:text-white/80 cursor-pointer px-5 py-2 hover:bg-accent/50'>
																	Delete
																</div>
															</motion.div>
														}
													</AnimatePresence>
												</IonRow>
											</IonItem>
										)
									})
								}
							</IonReorderGroup>
						</IonList>
					</div>
					<div className={`border-white/30 border-[0.1px] w-full text-center py-2 rounded-md text-lg bg-white text-black hover:bg-white/80 cursor-pointer`}
						onClick={() => {
							setPages(prev => {
								return [...prev, {
									name: "",
									content: ''
								}]
							})
						}}
					>
						Add page
					</div>
				</div>
				<div className="flex flex-col border-white/30 border-[0.1px] h-fit rounded-md min-w-[18rem] p-5 justify-center items-center gap-y-3">
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
			<div className={markDownStyle}>
				<MarkdownEditor placeholder="start typing..."
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
