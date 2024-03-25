import { Fragment } from "react"
import SideBar from "@/ui/components/sidebar"

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="min-h-screen w-screen flex flex-col sm:flex-row">
			<SideBar />
			<div className="min-h-screen w-screen px-2 sm:px-10 sm:pt-6 pt-[6rem]">
				{children}
			</div>
		</div>
	)
}

export default BaseLayout
