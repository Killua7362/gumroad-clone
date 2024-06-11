import { getRouterContext } from "@tanstack/react-router"
import { useContext, useEffect } from "react"
import { AsyncSubject } from 'rxjs'

export const getCustomRouteContext = new AsyncSubject()

const SharedStore = () => {
	const routeContext = useContext(getRouterContext())

	useEffect(() => {
		getCustomRouteContext.next(routeContext)
		getCustomRouteContext.complete()

		getCustomRouteContext.subscribe({
			next: (v: any) => v
		})

	}, [])

	return null;
}

export default SharedStore
