import browserHistory from "@/lib/history"
import { Link, LinkProps } from "@tanstack/react-router"
import { AnimatePresence, motion } from "framer-motion"
import { cx } from '@emotion/css'


const SideBarCard = ({ title, url, sideBarProps, icon, isOpen, extraClasses = '', closeSideBar = true, onClickHandler, windowWidth, disableLink = false, ...props }: SideBarCardProps & LinkProps & React.RefAttributes<HTMLAnchorElement>) => {
	return (
		<Link
			onClick={(event) => {
				if (disableLink)
					event.preventDefault()
				if (closeSideBar && windowWidth < 640)
					sideBarProps.setSideBarOpen(false)
				onClickHandler && onClickHandler()
			}}
			style={{
				textDecoration: 'none',
				color: 'white'
			}}
			{...props}
		>
			<motion.div
				className={cx(`flex flex-row-reverse items-center p-4 border-white/30 gap-x-4 ${browserHistory.isActive(url) ? "!bg-white text-gray-800" : "cursor-pointer hover:text-white/80 "}`, extraClasses)}
				whileHover={{
					backgroundColor: browserHistory.isActive(url) ? 'white' : '#2c2c31',
				}}
			>
				<div className='text-lg'>
					{icon}
				</div>
				<AnimatePresence>
					{
						isOpen &&
						<motion.div
							className='overflow-hidden'>
							{title}
						</motion.div>
					}
				</AnimatePresence>
			</motion.div>
		</Link>
	)
}

export default SideBarCard
