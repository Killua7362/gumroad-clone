import '@/ui/styles/sidebar.css'
import { SideBarTopItems } from '@/ui/components/sidebar/items';
import { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, Variants, motion } from 'framer-motion'
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MdAccountCircle } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { SiAboutdotme } from "react-icons/si";
import { CgLogOut } from "react-icons/cg";
import { useSetRecoilState } from 'recoil';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/app/RootPage';
import { loginStatusFetcher } from '@/query';

const SideBar = () => {
	const [activeItem, setActiveItem] = useState(0)
	const [isOpen, setIsOpen] = useState(false)
	const [isAccountOpen, setIsAccountOpen] = useState(false)
	const location = useLocation();

	const navigate = useNavigate();
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


	const { data: loginStatus, isSuccess: isLoginSuccess, isPending: isLoginStatusLoading } = loginStatusFetcher()

	const { mutate: loginStatusSetter } = useMutation({
		mutationFn: () => fetch(`${window.location.origin}/api/sessions/logout`, {
			method: 'DELETE',
			credentials: 'include',
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json()
		}),
		onSuccess: () => {
			navigate('/signin')
			return queryClient.clear()
		},
		onError: (err) => {

		}
	})

	return (
		<motion.div className={`p-4 sm:bg-background fixed sm:relative bg-background`}
			layout
			style={{
				zIndex: '30'
			}}
			initial='initial'
			animate='animate'
			exit='initial'
			onClick={(e) => {
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
									<Link to={e.linkUrl} key={`sidebar_items_${i}`} className='no-underline text-white'>
										<motion.div
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
									<Link to='/account/settings' className='no-underline text-white'>
										<motion.div
											whileHover={{
												scale: activeItem === -1 && (location.pathname.split('/')[2] || "") === 'settings' ? 1 : 1.03,
												transition: {
													duration: 0.2
												}
											}}
											className={`flex px-6 items-center py-4 border-white/30 gap-x-4 ${activeItem === -1 && (location.pathname.split('/')[2] || "") === 'settings' ? "bg-white text-gray-800" : "bg-background cursor-pointer hover:text-white/80"}`}>
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
											whileHover={{
												scale: activeItem === -1 && (location.pathname.split('/')[2] || "") === 'profile' ? 1 : 1.03,
												transition: {
													duration: 0.2
												}
											}}
											className={`flex px-6 items-center py-4 border-white/30 gap-x-4 ${activeItem === -1 && (location.pathname.split('/')[2] || "") === 'profile' ? "bg-white text-gray-800" : "bg-background cursor-pointer hover:text-white/80"}`}>
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
										whileHover={{
											scale: activeItem === -1 && (location.pathname.split('/')[2] || "") === 'logout' ? 1 : 1.03,
											transition: {
												duration: 0.2
											}
										}}
										className={`flex px-6 items-center py-4 border-white/30 gap-x-4 ${activeItem === -1 && (location.pathname.split('/')[2] || "") === 'logout' ? "bg-white text-gray-800" : "bg-background cursor-pointer hover:text-white/80"}`}>
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

								</motion.div>
							}
						</AnimatePresence>
						<motion.div
							layout
							onClick={() => {
								isAccountOpen ? setIsAccountOpen(false) : setIsAccountOpen(true)
							}}
							className={
								`flex ${isAccountOpen ? "py-4 px-6" : "p-4 m-2 border-[1px]"} ${-1 === activeItem && !isAccountOpen ? "bg-white text-gray-800" : "bg-background text-white hover:text-white/80 "} items-center justify-center rounded-xl border-white/30 gap-x-4 cursor-pointer`
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
					</div>
				</div>
			</motion.div >
		</motion.div>
	)
}

export default SideBar
