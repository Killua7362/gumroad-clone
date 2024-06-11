import { AnimatePresence, motion } from "framer-motion"
import { Fragment, useState } from "react"
import { useRecoilState } from "recoil";
import Button from "@/ui/components/button";
import { Outlet, createFileRoute, Link } from "@tanstack/react-router";
import { ProductHomeRouteType } from "./_layout_products.home";
import { productPageCollaboratorsSchemaType } from "./_layout_products.collaborators";
export const Route = createFileRoute('/_protected/_layout/products/_layout_products')({
	component: () => {
		return (
			<ProductLayout>
				<Outlet />
			</ProductLayout>
		)
	}
})

const ProductLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full w-full mb-14">
			<div className="h-full px-3 sm:mx-10 flex flex-col">
				<div className="flex flex-col text-white/90 pb-5 pt-3 sm:pb-6 sm:pt-6 mb-5 gap-y-7">
					<div className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide">
						Products
					</div>
					<div className="border-b-[1px] h-5 border-white/30 flex gap-x-4">
						<Link to='/products/home'
							search={(prev: ProductHomeRouteType) => ({
								sort_by: prev.sort_by || 'title',
								reverse: prev.reverse || false,
								search_word: prev.search_word || '',
								...prev,
							})}
							style={{
								textDecoration: 'none'
							}}
							activeProps={{
								className: "cursor-default pointer-events-none"
							}}
						>
							<Button buttonName="Home" isActive={location.pathname === '/products/home'} extraClasses={[`!text-base !rounded-2xl`]} />
						</Link>
						<Link
							to='/products/collaborators'
							search={(prev: productPageCollaboratorsSchemaType) => ({
								type: 'outgoing',
								...prev,
							})}
							style={{
								textDecoration: 'none'
							}}
							activeProps={{
								className: "cursor-default pointer-events-none"
							}}
						>
							<Button buttonName="Collab" isActive={location.pathname === '/products/collaborators'} extraClasses={[`!text-base !rounded-2xl`]} />
						</Link>
					</div>
				</div>
				{children}
			</div>
		</div >
	)
}
