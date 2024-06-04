import { Fragment, useEffect, useState } from "react"
import SideBar from "@/ui/components/sidebar"
import Footer from "@/ui/components/Footer"
import { useRouteLoaderData } from "react-router"
import { useRecoilValue } from "recoil"
import Toast from "@/ui/components/toast"
import { isError } from "remirror"
import { queryClient } from "@/app/RootPage"
import { loginStatusFetcher } from "@/react-query/query"
import { AnimatePresence, motion } from 'framer-motion'

const getSideBarProps = () => {
	const [sideBarOpen, setSideBarOpen] = useState(false)
	const [windowWidth, setWindowWidth] = useState<number>(700);

	return { sideBarOpen, windowWidth, setSideBarOpen, setWindowWidth } as SideBarProps
}

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	const authRouteProps = useRouteLoaderData('auth_route') as {
		sideBarActive: boolean;
		footerActive: boolean;
	}

	const sideBarProps: SideBarProps = getSideBarProps()

	return (
		<div className="min-h-screen min-w-screen flex flex-col sm:flex-row flex-wrap relative">
			<Toast />
			<AnimatePresence mode='wait' initial={false}>
				{
					(authRouteProps?.sideBarActive || false)
					&&
					<SideBar {...sideBarProps} />
				}
			</AnimatePresence>
			<motion.div
				layout
				className={`absolute h-full w-full sm:w-auto flex flex-col justify-between overflow-y-auto overflow-x-auto sm:ml-8 sm:right-0 px-2 sm:px-0 scrollbar-thin scrollbar-thumb-white scrollbar-track-background top-[6rem] sm:top-0`}
				transition={{
					x: { type: "spring", bounce: 0 },
				}}
				style={{
					left: ((authRouteProps?.sideBarActive || false) && sideBarProps.windowWidth > 640) ? (sideBarProps.sideBarOpen ? '18rem' : '5rem') : 0,
				}}
			>
				<div>
					{children}
				</div>
				<Footer />
			</motion.div>
		</div>
	)
}

export default BaseLayout
