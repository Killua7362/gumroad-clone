import '@/ui/styles/sidebar.css'
import { SideBarBottomItems, SideBarTopItems } from '@/ui/components/sidebar/items';
import { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, Variants, motion } from 'framer-motion'
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom'
import { MdAccountCircle } from "react-icons/md";

const SideBar = () => {
	const [activeItem, setActiveItem] = useState(0)
	const [isOpen, setIsOpen] = useState(false)
	const [isAccountOpen, setIsAccountOpen] = useState(false)

	const location = useLocation();

	document.title = (SideBarTopItems[activeItem]?.title || "Account")

	const eleDesktopVariants = {
		initial: {
			width: 0,
		},
		animate: {
			width: "100%",
			transition: {
				duration: 0.2
			}
		}
	}

	const accountEleVariants = {
		initial: {
			height: 0,
		},
		animate: {
			height: "90%",
			transition: {
				duration: 0.2
			}

		}
	}

	const divDesktopVariants = {
		initial: {
			width: "0rem",
			height: '0rem',
			transition: {
				duration: 0
			}
		},
		animate: {
			width: isOpen ? "18rem" : '4rem',
			height: '96%',
			transition: {
				duration: 0.2
			}
		}
	}

	const divMobileVariants = {
		initial: {
			width: "0rem",
			height: '0rem',
			transition: {
				duration: 0
			}
		},
		animate: {
			width: "100%",
			height: isOpen ? "100%" : "4rem",
			transition: {
				duration: 0.2
			}
		}
	}

	const [windowWidth, setWindowWidth] = useState<number | null>(null);

	useEffect(() => {
		const width = window.innerWidth;
		const onResize = () => {
			if (width != window.innerWidth) {
				setWindowWidth(window.innerWidth)
			}
		}
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [])

	useLayoutEffect(() => {
		setWindowWidth(window.innerWidth)
	}, [])


	useEffect(() => {
		for (let i = 0; i < SideBarTopItems.length; i++) {
			if (SideBarTopItems[i].linkUrl === location.pathname) {
				setActiveItem(i);
				break;
			}
		}
	}, [location])
	return (
		<motion.div className={`p-4 sm:bg-background fixed sm:relative bg-background`}
			style={{
				zIndex: '50'
			}}
			initial='initial'
			animate='animate'
			exit='initial'
			onClick={(e) => {
				e.stopPropagation()
				e.preventDefault()
			}}
			variants={windowWidth! < 640 ? {
				...divMobileVariants,
				animate: {
					...divMobileVariants.animate,
					width: '100%',
					height: isOpen ? "100%" : "fit-content",
				}
			} :
				{
					...divDesktopVariants,
					animate: {
						...divDesktopVariants.animate,
						width: isOpen ? "21rem" : '4rem',
					}
				}}
		>
			<motion.div
				initial='initial'
				animate='animate'
				exit='initial'
				variants={windowWidth! < 640 ? divMobileVariants : divDesktopVariants}
				className="flex sm:fixed bg-background flex-col font-medium rounded-xl overflow-hidden border-[0.1px] border-white/30">
				<div className='uppercase flex items-center text-xl sm:text-2xl py-8 sm:py-10 px-5 justify-between border-white/30 border-b-[0.1px] overflow-hidden'>
					<AnimatePresence>
						<motion.div
							initial="initial"
							animate="animate"
							exit="initial"
							variants={eleDesktopVariants}
							className='overflow-hidden'>
							{isOpen &&
								<div className='hidden sm:block'>
									Gumroad
								</div>
							}
							<div className='block sm:hidden'>
								{SideBarTopItems[activeItem].title}
							</div>
						</motion.div>
					</AnimatePresence>
					<div className='relative top-0 sm:top-1 cursor-pointer' onClick={() => { isOpen ? setIsOpen(false) : setIsOpen(true) }}>
						<AnimatePresence>
							<motion.div
								animate={{
									rotate: isOpen ? 0 : 180,
									transition: {
										duration: 0.1,
										delay: 0.1
									}
								}}
							>
								<div className='rotate-[90deg] sm:rotate-0'>
									<MdOutlineKeyboardArrowLeft />
								</div>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
				<div className='flex flex-col justify-between h-full w-full'>
					<div className='flex flex-col overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white scrollbar-track-background'
					>
						{
							SideBarTopItems.map((e, i) => {
								return (
									<Link to={e.linkUrl} className='no-underline text-white'>
										<motion.div
											whileHover={{ scale: i === activeItem ? 1 : 1.1, transition: { duration: 0.2 } }}
											className={`flex px-6 items-center py-4 border-white/30 gap-x-4 ${i === activeItem ? "bg-white text-gray-800" : "cursor-pointer hover:text-white/80 "}`}
											id={`$sidebarTopitems_${i}`}
											onClick={() => {
												if (i !== activeItem) {
													setActiveItem(i)
												}
												if (windowWidth! < 640) {
													setIsOpen(false)
												}
											}}>
											<div className='text-lg'>
												{e.icon}
											</div>
											<AnimatePresence>
												{
													isOpen &&
													<motion.div
														initial="initial"
														animate="animate"
														exit="initial"
														variants={eleDesktopVariants}
														className='overflow-hidden'>
														{e.title}
													</motion.div>
												}
											</AnimatePresence>
										</motion.div>
									</Link>
								)
							})
						}
					</div>
					<div
						className={`pb-1 ${isAccountOpen && "border-[0.1px]"} border-white/30 overflow-auto rounded-xl`}>
						<AnimatePresence>
							{
								isAccountOpen && <motion.div
									initial={{
										height: '0rem',
										opacity: 0
									}}
									animate={{
										height: '11rem',
										opacity: 1,
										transition: {
											duration: 0.1
										}
									}}
									exit={{
										height: '0rem',
										opacity: 0
									}}
									className='overflow-hidden relative'>
									{
										SideBarBottomItems.map((e, i) => {
											return (
												<Link to={e.linkUrl} className='no-underline text-white'>
													<motion.div whileHover={{ scale: 1.1, transition: { duration: 0.2 } }} className='flex px-6 hover:text-white/80 items-center py-4 border-white/30 gap-x-4 cursor-pointer'>
														<div className='text-lg'>
															{e.icon}
														</div>
														<AnimatePresence>
															{
																isOpen &&
																<motion.div
																	initial="initial"
																	animate="animate"
																	exit="initial"
																	variants={eleDesktopVariants}
																	className='overflow-hidden'>
																	{e.title}
																</motion.div>
															}
														</AnimatePresence>
													</motion.div>

												</Link>
											)
										})
									}
								</motion.div>
							}
						</AnimatePresence>
						<motion.div
							layout
							onClick={() => {
								isAccountOpen ? setIsAccountOpen(false) : setIsAccountOpen(true)
							}}
							className={`flex ${isAccountOpen ? "py-4 px-6" : "py-4 px-2 m-2 border-[1px]"} items-center justify-center rounded-xl hover:text-white/80 bg-background items-center border-white gap-x-4 cursor-pointer`}>
							<div className='text-lg'>
								<MdAccountCircle />
							</div>
							<AnimatePresence>
								{
									isOpen &&
									<motion.div
										initial="initial"
										animate="animate"
										exit="initial"
										variants={eleDesktopVariants}
										className='overflow-hidden'>
										Account
									</motion.div>
								}
							</AnimatePresence>
						</motion.div>
					</div>
				</div>
			</motion.div >
		</motion.div>
	)
}

export default SideBar
