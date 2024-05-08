import { Fragment, useEffect, useMemo, useState } from "react"
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
		queryFn: () => fetch(`${window.location.origin}/api/sessions/logged_in`).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json()
		}),
		retry: false,
		refetchOnWindowFocus: false,
	})

	const { data: loginStatusData, isSuccess: isLoginSuccess, isLoading: isLoginStatusLoading, fetchStatus, isRefetching, isFetched, isFetchedAfterMount } = useQuery({
		queryKey: ['loginStatus'],
	});

	const loginStatus = useMemo(() => {
		return { ...loginStatusData as authSchema }
	}, [loginStatusData])

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
