import { Fragment, useEffect, useState } from "react"
import SideBar from "@/ui/components/sidebar"
import Footer from "@/ui/components/Footer"
import { useLocation } from "react-router"
import { useRecoilValue } from "recoil"
import Toast from "@/ui/components/toast"
import { isError } from "remirror"
import { queryClient } from "@/app/RootPage"
import { loginStatusFetcher } from "@/react-query/query"
import { motion } from 'framer-motion'

const getSideBarProps = () => {
	const [sideBarOpen, setSideBarOpen] = useState(false)
	const [windowWidth, setWindowWidth] = useState<number>(700);

	return { sideBarOpen, windowWidth, setSideBarOpen, setWindowWidth } as SideBarProps
}

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation()
	const [sidebarActive, setSideBarActive] = useState(false)

	const sideBarProps: SideBarProps = getSideBarProps()

	const siderbarActivePaths = new Set(["profile", "notfound", "signin", "signup"])

	useEffect(() => {
		setSideBarActive(!siderbarActivePaths.has(location.pathname.split('/')[1]))
	}, [location.pathname,])

	return (
		<div className="min-h-screen w-screen flex flex-col sm:flex-row flex-wrap relative">
			<Toast />
			{
				sidebarActive
				&&
				<SideBar {...sideBarProps} />
			}
			<motion.div
				layout
				className={`absolute h-full flex flex-col justify-between overflow-y-auto overflow-x-auto mx-3 sm:mx-8 sm:mr-0 mr-0 right-0 scrollbar-thin scrollbar-thumb-white scrollbar-track-background`}
				transition={{
					x: { type: "spring", bounce: 0 },
				}}
				style={{
					left: sideBarProps.windowWidth > 640 ? (sideBarProps.sideBarOpen ? '18rem' : '5rem') : 0,
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
