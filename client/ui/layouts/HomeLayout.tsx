const HomeLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full w-full">
			<div className="border-b-[1px] border-white/30 text-white/90 sm:mx-10 pb-5 pt-3 sm:pb-10 sm:pt-6 mb-4">
				<div className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide">
					Welcome to Gumroad lite
				</div>
			</div>
			{children}
		</div>
	)
}
export default HomeLayout
