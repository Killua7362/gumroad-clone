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

	const [isAccountOpen, setIsAccountOpen] = useState(false)
	const location = useLocation();

	const divDesktopVariants = {
		initial: {
			width: "4rem",
			height: 'calc(100% - 2rem)',
		},
		animate: {
			width: isOpen ? "18rem" : '5rem',
			height: 'calc(100% - 2rem)',
			transition: {
				duration: 0.2,
			}
		}
	}

	const divMobileVariants = {
		initial: {
			width: 'calc(100% - 3.9rem)',
			height: '3.9rem',
		},
		animate: {
			width: 'calc(100% - 2rem)',
			height: isOpen ? "calc(100% - 2rem)" : "3.9rem",
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


	const loginStatus = useRouteLoaderData('root') as authSchema
	const { mutate: loginStatusSetter, isPending } = setLogOut()

	return (
		<motion.div
			initial='initial'
			animate='animate'
			exit='initial'
			variants={windowWidth! < 640 ? divMobileVariants : divDesktopVariants}
			className="fixed flex bg-background flex-col font-medium rounded-xl border-[0.1px] border-white/30 m-4 overflow-hidden"
			style={{
				zIndex: 30
			}}
		>
			<div className='uppercase flex items-center text-xl sm:text-2xl py-4 sm:py-8 px-6 justify-between border-white/30 border-b-[0.1px]'>
				<div
					className=''>
					{isOpen &&
						<div className='hidden sm:block'>
							Gumroad
						</div>
					}
					<div className='block sm:hidden'>
						{(SideBarTopItems.filter(e => e.linkUrl === location.pathname))[0]?.title || "Account"}
					</div>
				</div>
				<div className='relative top-0 sm:top-1 cursor-pointer' onClick={() => { isOpen ? setIsOpen(false) : setIsOpen(true) }}>
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
				</div>
			</div>
			<div className='flex flex-col overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-white scrollbar-track-[#2c2c31] flex-1'
				style={{
					direction: 'rtl'
				}}
			>
				{
					SideBarTopItems.map((e, i) => {
						return (
							<NavLink to={browserHistory.getURL(e.linkUrl) || e.linkUrl}
								key={`sidebar_items_${i}`}
								onClick={() => {
									sideBarProps.setSideBarOpen(false)
								}}
								style={{
									textDecoration: 'none',
									color: 'white'
								}}
							>
								<motion.div
									className={`flex flex-row-reverse px-6 items-center py-4 border-white/30 gap-x-4 ${browserHistory.isActive(e.linkUrl) ? "!bg-white text-gray-800" : "cursor-pointer hover:text-white/80 "}`}
									id={`$sidebarTopitems_${i}`}
									whileHover={{
										backgroundColor: browserHistory.isActive(e.linkUrl) ? 'white' : '#2c2c31',
									}}
								>
									<div className='text-lg'>
										{e.icon}
									</div>
									<AnimatePresence>
										{
											isOpen &&
											<motion.div
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
			<motion.div
				initial={{
					height: '0',
					opacity: 0
				}}
				animate={{
					height: isAccountOpen ? '16.1rem' : '5rem',
					opacity: 1,
					transition: {
						duration: 0.2
					}
				}}
				exit={{
					height: '0',
					opacity: 0
				}}
				className={`${isAccountOpen && 'border-[0.1px]'} overflow-hidden relative border-white/30 rounded-xl p-2 flex flex-col overflow-y-scroll scrollbar-thin scrollbar-thumb-white scrollbar-track-[#2c2c31]`}
				style={{
					direction: 'rtl'
				}}
			>
				{isAccountOpen && <>
					<Link to='/account/settings' className='no-underline text-white'>
						<motion.div
							className={`flex flex-row-reverse items-center p-4 border-white/30 gap-x-4 bg-background cursor-pointer hover:text-white/80  rounded-xl`}
							whileHover={{
								backgroundColor: '#2c2c31',
							}}
						>
							<div className='text-lg'>
								<IoSettingsSharp />
							</div>
							<AnimatePresence>
								{
									isOpen &&
									<motion.div
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
							className={`flex flex-row-reverse items-center p-4 border-white/30 gap-x-4 bg-background cursor-pointer hover:text-white/80  rounded-xl`}
							whileHover={{
								backgroundColor: '#2c2c31',
							}}
						>
							<div className='text-lg'>
								<SiAboutdotme />
							</div>
							<AnimatePresence>
								{
									isOpen &&
									<motion.div
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
						className={`flex flex-row-reverse items-center p-4 border-white/30 gap-x-4 bg-background cursor-pointer hover:text-white/80 rounded-xl`}
						whileHover={{
							backgroundColor: '#2c2c31',
						}}
					>
						<div className='text-lg'>
							<CgLogOut />
						</div>
						<AnimatePresence>
							{
								isOpen &&
								<motion.div
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
						`flex ${!isAccountOpen && "border-[1px]"} flex-row-reverse p-4 bg-background text-white hover:text-white/80  items-center w-full rounded-xl border-white/30 gap-x-4 cursor-pointer`
					}
					whileHover={{
						backgroundColor: '#2c2c31',
					}}
				>
					<span className='text-lg'>
						<MdAccountCircle />
					</span>
					<AnimatePresence>
						{
							isOpen &&
							<motion.div
								className='overflow-hidden'>
								Account
							</motion.div>
						}
					</AnimatePresence>
				</motion.div>
			</motion.div>
		</motion.div >
	)
}

export default SideBar
