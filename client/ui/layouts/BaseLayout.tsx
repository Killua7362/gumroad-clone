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

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation()
	const [sidebarActive, setSideBarActive] = useState(false)
	const [sideBarOpen, setSideBarOpen] = useState(false)
	const [windowWidth, setWindowWidth] = useState<number>(0);


	const siderbarActivePaths = new Set(["profile", "notfound", "signin", "signup"])
	const authPaths = new Set(['signin', 'signup', 'profile'])

	const navigate = useNavigate()

	const { data: loginStatus, isSuccess: isLoginSuccess, isPending: isLoginStatusLoading } = loginStatusFetcher()

	useEffect(() => {
		if (!isLoginStatusLoading) {
			if (!authPaths.has(location.pathname.split('/')[1]) && (!isLoginSuccess || loginStatus?.logged_in === false)) {
				navigate('/signin')
			}

			if ((isLoginSuccess && loginStatus?.logged_in) && new Set(['signin', 'signup']).has(location.pathname.split('/')[1])) {
				navigate('/')
			}
		}
		setSideBarActive(!siderbarActivePaths.has(location.pathname.split('/')[1]))
	}, [location.pathname, isLoginStatusLoading, isLoginSuccess, loginStatus?.logged_in!])


	return !isLoginStatusLoading && (
		<div className="min-h-screen w-screen flex flex-col sm:flex-row">
			<Toast />
			{
				sidebarActive
				&&
				<SideBar isOpen={sideBarOpen} setIsOpen={setSideBarOpen} windowWidth={windowWidth} setWindowWidth={setWindowWidth} />
			}
			<motion.div
				initial={{
					left: 0,
				}}
				animate={{
					left: windowWidth > 640 ? (sideBarOpen ? '18.5rem' : '3.8rem') : 0,
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
