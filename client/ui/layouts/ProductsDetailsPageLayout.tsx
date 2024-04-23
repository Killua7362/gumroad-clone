import ProfileNavbar from "@/ui/components/profile/navbar"

interface ProductDetailsPageLayoutProps {
	children: React.ReactNode,
	preview?: boolean
}

const ProductsDetailsPageLayout = ({ children, preview }: ProductDetailsPageLayoutProps) => {
	return (
		<div className="w-full mb-20">
			<ProfileNavbar />
			{children}
		</div>
	)
}
export default ProductsDetailsPageLayout
