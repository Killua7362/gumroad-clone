import { Fragment, useEffect, useState } from "react"
import SideBar from "@/ui/components/sidebar"
import Footer from "@/ui/components/Footer"
import { Navigate, useLocation, useNavigate } from "react-router"
import ModalBase from "@/ui/components/modal"
import { useRecoilValue } from "recoil"
import Toast from "@/ui/components/toast"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { isError } from "remirror"

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation()
	const [sidebarActive, setSideBarActive] = useState(false)

	const siderbarActivePaths = new Set(["profile", "notfound", "signin", "signup"])
	const authPaths = new Set(['signin', 'signup', 'profile'])

	const navigate = useNavigate()
	const queryClient = useQueryClient()

	queryClient.setQueryDefaults(['loginStatus'], {
		queryFn: () => fetch(`${window.location.origin}/api/sessions/logged_in`).then(res => res.json()),
	})

	const { data: loginStatusData, isSuccess: isLoginSuccess, isError: isLoginError } = useQuery({
		queryKey: ['loginStatus'],
	});

	useEffect(() => {
		setSideBarActive(!siderbarActivePaths.has(location.pathname.split('/')[1]))
	}, [location.pathname])

	if (!authPaths.has(location.pathname.split('/')[1]) && (isLoginError || (loginStatusData as authSchema)?.logged_in === false)) {
		return <Navigate to='/signin' replace />
	}

	if ((isLoginSuccess && (loginStatusData as authSchema)?.logged_in) && new Set(['signin', 'signup']).has(location.pathname.split('/')[1])) {
		return <Navigate to='/' replace />
	}

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
