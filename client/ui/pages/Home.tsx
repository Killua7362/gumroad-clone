import HomeLayout from "@/ui/layouts/HomeLayout"

const Home = () => {
	return (
		<HomeLayout>
			<div className="flex flex-col h-full w-full items-center pt-10 gap-y-4">
				<div className="text-2xl uppercase tracking-wider w-[98%] md:w-10/12 base:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12 text-white/90">
					Activity
				</div>
				<div className="bg-background shadow-lg shadow-black border-[0.1px] border-white/30 rounded-xl w-[98%] md:w-10/12 base:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12 min-h-[15rem]">
				</div>
			</div>
		</HomeLayout>
	)
}
export default Home
