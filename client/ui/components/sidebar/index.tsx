import '@/ui/styles/sidebar.css'
import { SideBarItems } from '@/ui/components/sidebar/items';
import { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, Variants, motion } from 'framer-motion'
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const SideBar = () => {
	const [activeItem, setActiveItem] = useState(0)
	const [isOpen, setIsOpen] = useState(true)
	document.title = SideBarItems[activeItem].title

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

	return (
		<AnimatePresence>
			<motion.div className={`z-50 p-4 sm:bg-background fixed sm:relative bg-background`}
				initial='initial'
				animate='animate'
				exit='initial'
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
									{SideBarItems[activeItem].title}
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
					<div className='flex flex-col overflow-y-auto overflow-x-hidden h-full scrollbar-thin scrollbar-thumb-white scrollbar-track-background'
					>
						{
							SideBarItems.map((e, i) => {
								return (
									<motion.div
										whileHover={{ scale: i === activeItem ? 1 : 1.1, transition: { duration: 0.2 } }}
										className={`flex px-6 items-center py-4 border-white/30 gap-x-4 ${i === activeItem ? "bg-white text-gray-800" : "cursor-pointer hover:bg-background hover:text-white/80 "}`}
										id={`$sidebaritems_${i}`}
										onClick={() => { setActiveItem(i) }}>
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
								)
							})
						}
					</div>
				</motion.div >
			</motion.div>
		</AnimatePresence>
	)
}

export default SideBar
