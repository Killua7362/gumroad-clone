import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_protected/_layout/home/')({
	component: () => {
		return <Home />
	}
})

const Home = () => {
	return (
		<div className="h-full w-full">
			<div className="border-b-[1px] border-white/30 text-white/90 sm:mx-10 pb-5 pt-3 sm:pb-10 sm:pt-6 mb-4">
				<div className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide">
					Welcome to Gumroad lite
				</div>
			</div>

			<div className="flex flex-col w-full items-center pt-10 gap-y-4">
				<div className="text-2xl uppercase tracking-wider w-[98%] md:w-10/12 base:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12 text-white/90">
					Activity
				</div>
				<div className="bg-background shadow-lg shadow-black border-[0.1px] border-white/30 rounded-xl w-[98%] md:w-10/12 base:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12 min-h-[15rem]">
				</div>
			</div>
		</div>

	)
}
