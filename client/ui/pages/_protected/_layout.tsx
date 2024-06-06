import { queryClient } from "@/app/RootPage";
import { loginStatusFetcherProps } from "@/react-query/query";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute('/_protected/_layout')({
	beforeLoad: async () => {
		try {
			const loginStatus: authSchema = await queryClient.ensureQueryData(loginStatusFetcherProps)
			if (loginStatus.logged_in === false) {
				throw 'Not Logged in'
			}
			return{
				sidebaractive:true
			}
		} catch (err) {
			throw redirect({
				to: '/signin'
			})
		}
	}
})
