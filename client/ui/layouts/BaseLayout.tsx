import { Fragment, useEffect, useState } from "react"
import SideBar from "@/ui/components/sidebar"
import Footer from "@/ui/components/Footer"
import { Navigate, useLocation, useNavigate } from "react-router"
import { useRecoilValue } from "recoil"
import Toast from "@/ui/components/toast"
import { isError } from "remirror"
import { queryClient } from "@/app/RootPage"
import { loginStatusFetcher } from "@/react-query/query"
import { motion } from 'framer-motion'

const getSideBarProps = () => {
	const [sideBarOpen, setSideBarOpen] = useState(false)
	const [windowWidth, setWindowWidth] = useState<number>(0);

	return { sideBarOpen, windowWidth, setSideBarOpen, setWindowWidth } as SideBarProps
}

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation()
	const [sidebarActive, setSideBarActive] = useState(false)

	const sideBarProps: SideBarProps = getSideBarProps()

	const siderbarActivePaths = new Set(["profile", "notfound", "signin", "signup"])
	const navigate = useNavigate()

	useEffect(() => {
		setSideBarActive(!siderbarActivePaths.has(location.pathname.split('/')[1]))
	}, [location.pathname,])

	return (
		<div className="min-h-screen w-screen flex flex-col sm:flex-row">
			<Toast />
			{
				sidebarActive
				&&
				<SideBar {...sideBarProps} />
			}
			<motion.div
				initial={{
					left: 0,
				}}
				animate={{
					left: sideBarProps.windowWidth > 640 ? (sideBarProps.sideBarOpen ? '18.5rem' : '3.8rem') : 0,
					transition: {
						duration: 0.2
					}
				}}
				exit={{
					left: 0
				}}
				className={`relative min-h-screen w-full flex flex-col justify-between mx-3 sm:mx-8 mr-6 left-0 `}>
				<div className={`px-2 h-full w-full ${sidebarActive && "sm:pt-6 pt-[6rem]"}`}>
					{children}
				</div>
				<Footer />
			</motion.div>
		</div>
	)
}

export default BaseLayout
