import { getRouterContext, Router } from "@tanstack/react-router"
import { useContext, useEffect } from "react"
import { AsyncSubject } from 'rxjs'

export const getCustomRouteContext = new AsyncSubject<Router<any,any>>()

const SharedStore = () => {
	const routeContext = useContext(getRouterContext())

	useEffect(() => {
		getCustomRouteContext.next(routeContext)
		getCustomRouteContext.complete()

		getCustomRouteContext.subscribe({
			next: (v: Router<any,any>) => v
		})

	}, [])

	return null;
}

export default SharedStore
