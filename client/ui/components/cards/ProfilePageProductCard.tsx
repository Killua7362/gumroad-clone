import { Link } from "react-router-dom"
import { Fragment } from "react/jsx-runtime"

const ProfilePageProductCard = ({ name }: { name: string }) => {
	return (
		<Fragment>
			<div className="text-xl">
				{name}
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
				{
					new Array(4).fill(0).map((e) => {
						return (
							<Link className="w-[min(100%,23rem)] min-h-[20rem] no-underline text-white" to={`product?id=123`}>
								<div className="flex flex-col w-full h-full items-center justify-center gap-y-5 border-white/30 border-[0.1px] rounded-md p-5 cursor-pointer">
									<div className="h-full w-full bg-accent p-4 relative">
										<div className="absolute right-4">
											Pin
										</div>
									</div>
									<div className="w-full flex justify-between">
										<div>
											Product 1
										</div>
										<div>
											5
										</div>
									</div>
								</div>
							</Link>

						)
					})
				}
			</div>
		</Fragment>

	)
}
export default ProfilePageProductCard
