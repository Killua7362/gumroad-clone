interface ProfileCheckoutPageLayoutPros {
	children: React.ReactNode;
	preview?: boolean;
}
const ProfileCheckoutPageLayout = ({ children, preview = false }: ProfileCheckoutPageLayoutPros) => {
	return (
		<div className="w-full h-full">
			<div className="h-[7rem] w-full border-b-[0.1px] border-white/30 text-5xl flex items-center justify-center text-white/90">
				<div className="w-6/12">
					Checkout
				</div>
			</div>
			<div className="mt-4">
				{children}
			</div>
		</div>
	)
}
export default ProfileCheckoutPageLayout
