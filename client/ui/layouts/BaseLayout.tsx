import { Fragment, useEffect, useState } from "react"
import SideBar from "@/ui/components/sidebar"
import Footer from "@/ui/components/Footer"
import { useLocation, useNavigate } from "react-router"
import ModalBase from "@/ui/components/modal"
import { useRecoilValue } from "recoil"
import { loginStatuState } from "@/atoms/states"
import Toast from "@/ui/components/toast"

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation()
	const [sidebarActive, setSideBarActive] = useState(false)

	const siderbarActivePaths = new Set(["profile", "notfound", "signin", "signup"])
	const authPaths = new Set(['signin', 'signup'])

	const loginValue = useRecoilValue(loginStatuState)
	const navigate = useNavigate()

	useEffect(() => {
		if (loginValue.logged_in) {
			if (authPaths.has(location.pathname.split('/')[1])) {
				navigate('/')
			}
		} else {
			if (!authPaths.has(location.pathname.split('/')[1])) {
				navigate('/signin')
			}
		}

		setSideBarActive(!siderbarActivePaths.has(location.pathname.split('/')[1]))
	}, [location.pathname])


	return (
		<div className="min-h-screen w-screen flex flex-col sm:flex-row">
			<ModalBase />
			<Toast />
			{
				sidebarActive
				&&
				<SideBar />
			}
			<div className="min-h-screen w-screen flex flex-col justify-between">
				<div className={`px-2 h-full w-full ${sidebarActive && "sm:pt-6 pt-[6rem]"}`}>
					{children}
				</div>
				<Footer />
			</div>
		</div>
	)
}

export default BaseLayout
