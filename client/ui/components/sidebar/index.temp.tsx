import '@/ui/styles/sidebar.css'
import { SideBarTopItems } from '@/ui/components/sidebar/items';
import { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, Variants, motion } from 'framer-motion'
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Link, NavLink, useLocation, useRouteLoaderData } from 'react-router-dom'
import { MdAccountCircle } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { SiAboutdotme } from "react-icons/si";
import { CgLogOut } from "react-icons/cg";
import { useSetRecoilState } from 'recoil';
import { queryClient } from '@/app/RootPage';
import { setLogOut } from '@/react-query/mutations';
import browserHistory from '@/lib/history';

const SideBar = ({ ...sideBarProps }: SideBarProps) => {

	const { sideBarOpen: isOpen, windowWidth, setSideBarOpen: setIsOpen, setWindowWidth } = sideBarProps

	const [activeItem, setActiveItem] = useState(0)
	const [isAccountOpen, setIsAccountOpen] = useState(false)
	const location = useLocation();

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
			height: "auto",
			transition: {
				duration: 0.2
			}

		}
	}

	const divDesktopVariants = {
		initial: {
			width: "4rem",
			height: '100%',
			transition: {
				duration: 0
			}
		},
		animate: {
			width: isOpen ? "18rem" : '4rem',
			height: '100%',
			transition: {
				duration: 0.2
			}
		}
	}

	const divMobileVariants = {
		initial: {
			width: "100%",
			height: '4rem',
			transition: {
				duration: 0
			}
		},
		animate: {
			width: "100%",
			height: isOpen ? "calc(100% - 2rem)" : "4rem",
			transition: {
				duration: 0.2
			}
		}
	}


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
		browserHistory.setURL(location.pathname)
	}, [location.pathname])

	useEffect(() => {
		const path = location.pathname.split('/')[1]
		if (path === 'account') {
			setActiveItem(-1)
		} else {
			for (let i = 0; i < SideBarTopItems.length; i++) {
				if (SideBarTopItems[i].title.toLowerCase() === path) {
					setActiveItem(i);
					break;
				}
			}
		}
	}, [location])

	const loginStatus = useRouteLoaderData('root') as authSchema
	const { mutate: loginStatusSetter, isPending } = setLogOut()

	return (
		<motion.div className={`absolute sm:relative bg-background p-4`}
			layout
			style={{
				zIndex: '30'
			}}
			initial='initial'
			animate='animate'
			exit='initial'
			variants={windowWidth! < 640 ? {
				...divMobileVariants,
				animate: {
					...divMobileVariants.animate,
					width: '100%',
					height: isOpen ? "100%" : "auto",
				}
			} :
				{
					...divDesktopVariants,
					animate: {
						...divDesktopVariants.animate,
						width: isOpen ? "21rem" : '4rem',
						height: '100%'
					}
				}}
		>
			<motion.div
				initial='initial'
				animate='animate'
				exit='initial'
				variants={windowWidth! < 640 ? divMobileVariants : divDesktopVariants}
				className="flex bg-background flex-col font-medium rounded-xl border-[0.1px] border-white/30 gap-y-2">
				<div className='uppercase flex items-center text-xl sm:text-2xl py-8 sm:py-10 px-5 justify-between border-white/30 border-b-[0.1px] overflow-hidden'>
					<AnimatePresence>
						<motion.div
							initial="initial"
							animate="animate"
							exit="initial"
							variants={eleDesktopVariants}
							className=''>
							{isOpen &&
								<div className='hidden sm:block'>
									Gumroad
								</div>
							}
							<div className='block sm:hidden'>
								{SideBarTopItems[activeItem]?.title || "Account"}
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
									<NavLink to={browserHistory.getURL(e.linkUrl) || e.linkUrl}
										key={`sidebar_items_${i}`}
										style={{
											textDecoration: 'none',
											color: 'white'
										}}
									>
										<motion.div
											className={`flex px-6 items-center py-4 border-white/30 gap-x-4 ${browserHistory.isActive(e.linkUrl) ? "bg-white text-gray-800" : "cursor-pointer hover:text-white/80 "}`}
											id={`$sidebarTopitems_${i}`}
										>
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
									</NavLink>
								)
							})
						}
					</div>
					<div
						className={`pb-1 ${isAccountOpen && "border-[0.1px]"} border-white/30 overflow-auto rounded-xl overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-background`}>
						<AnimatePresence>
							<motion.div
								initial={{
									height: '0',
									opacity: 0
								}}
								animate={{
									height: isAccountOpen ? '15.5rem' : '5rem',
									opacity: 1,
									transition: {
										duration: 0.1
									}
								}}
								exit={{
									height: '0',
									opacity: 0
								}}
								className='overflow-hidden relative'>
								{isAccountOpen && <>
									<Link to='/account/settings' className='no-underline text-white'>
										<motion.div
											className={`flex px-6 items-center py-4 border-white/30 gap-x-4 bg-background cursor-pointer hover:text-white/80`}>
											<div className='text-lg'>
												<IoSettingsSharp />
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
														Settings
													</motion.div>
												}
											</AnimatePresence>
										</motion.div>

									</Link>
									<Link to={`/profile/${loginStatus.user_id!}`} className='no-underline text-white' target='_blank'
										rel='noopener noreferrer'>
										<motion.div
											className={`flex px-6 items-center py-4 border-white/30 gap-x-4 bg-background cursor-pointer hover:text-white/80`}>
											<div className='text-lg'>
												<SiAboutdotme />
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
														Profile
													</motion.div>
												}
											</AnimatePresence>
										</motion.div>

									</Link>
									<motion.div
										onClick={() => {
											loginStatusSetter()
										}}
										className={`flex px-6 items-center py-4 border-white/30 gap-x-4 bg-background cursor-pointer hover:text-white/80`}>
										<div className='text-lg'>
											<CgLogOut />
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
													Logout
												</motion.div>
											}
										</AnimatePresence>
									</motion.div>
								</>
								}
								<motion.div
									onClick={() => {
										isAccountOpen ? setIsAccountOpen(false) : setIsAccountOpen(true)
									}}
									className={
										`flex ${!isAccountOpen && "border-[1px]"} m-2 p-4 bg-background text-white hover:text-white/80 items-center justify-center rounded-xl border-white/30 gap-x-4 cursor-pointer`
									}>
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
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</motion.div >
		</motion.div>
	)
}

export default SideBar
