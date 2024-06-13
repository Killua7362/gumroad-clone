import Button from "@/ui/components/button";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute('/_protected/_layout/checkout/_layout_checkout')({
	component: () => {
		return (
			<CheckoutLayout>
				<Outlet />
			</CheckoutLayout>
		)
	}
})

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
	const [sortConfig, setSortConfig] = useState<sortConfig>({
		active: false,
		byType: "date",
		reverse: true
	})

	const [searchConfig, setSearchConfig] = useState<searchConfig>({
		active: false,
		startsWith: ""
	})

	return (
		<div className="h-full w-full">
			<div className="h-full px-3 sm:mx-10">
				<div className="flex flex-col text-white/90 pb-5 pt-3 sm:pb-0 sm:pt-6 mb-0 gap-y-10">
					<div className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide">
						Checkout
					</div>
					<div className="border-b-[1px] h-3 border-white/30 flex gap-x-4 z-20">
						<Link to='/checkout/form'
							style={{
								textDecoration: 'none'
							}}
							activeProps={{
								className: 'cursor-default pointer-events-none'
							}}>
							{({ isActive }) => (
								<Button buttonName="Form" isActive={isActive} extraClasses={[`!text-base !rounded-2xl`]} />
							)}
						</Link>
						<Link to='/checkout/suggestions'
							style={{
								textDecoration: 'none'
							}}
							activeProps={{
								className: 'cursor-default pointer-events-none'
							}}>
							{({ isActive }) => (
								<Button buttonName="Suggest" isActive={isActive} extraClasses={[`!text-base !rounded-2xl`]} />
							)}
						</Link>
					</div>
				</div>
				<div className="w-full flex flex-col gap-6">
					{children}
				</div>
			</div>
		</div >
	)
}
