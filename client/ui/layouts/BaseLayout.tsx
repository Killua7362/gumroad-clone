import { Fragment, useEffect, useState } from "react"
import SideBar from "@/ui/components/sidebar"
import Footer from "@/ui/components/Footer"
import { useLocation } from "react-router"

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation()
	const [sidebarActive, setSideBarActive] = useState(false)
	const siderbarActivePaths = new Set(["profile", "notfound"])

	useEffect(() => {
		setSideBarActive(!siderbarActivePaths.has(location.pathname.split('/')[1]))
	}, [location.pathname])

	return (
		<div className="min-h-screen w-screen flex flex-col sm:flex-row">
			{
				sidebarActive
				&&
				<SideBar />
			}
			<div className="min-h-screen w-screen flex flex-col justify-between">
				<div className={`px-2 h-full w-full  ${sidebarActive && "sm:pt-6 pt-[6rem]"}`}>
					{children}
				</div>
				<Footer />
			</div>
		</div>
	)
}

export default BaseLayout
