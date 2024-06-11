import "nprogress/nprogress.css";

import NProgress from "nprogress";
import { useEffect } from "react"

const Bar = () => {
	useEffect(() => {
		NProgress.configure({ showSpinner: false })
		NProgress.start();
		return () => NProgress.done();
	}, [])
	return ""
}
export default Bar
