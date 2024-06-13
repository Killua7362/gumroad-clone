import { loginStatusFetcher } from "@/react-query/query"
import Loader from "@/ui/components/loader"
import { Navigate, Outlet } from "@tanstack/react-router"

const NonProtectedRoute = () => {
	const { data: loginStatus, isSuccess: isLoginSuccess, isPending: isLoginStatusLoading } = loginStatusFetcher()

	if (isLoginStatusLoading) return (
		<Loader />
	)

	if (!isLoginSuccess || (isLoginSuccess && loginStatus.logged_in === false)) return <Outlet />

	return <Navigate to='/home' />
}

export default NonProtectedRoute
