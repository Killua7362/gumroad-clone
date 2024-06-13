import { Link, useParams } from "@tanstack/react-router";
import { IoMdCart } from "react-icons/io";

const ProfileNavbar = ({ name, preview }: { name: string, preview: boolean }) => {
	const params = preview ? undefined : useParams({ from: '/profile/$id/' });

	return (
		<div className="fixed border-b-[0.1px] border-white/30 min-h-[6rem] w-full top-0 bg-background z-30">
			<div className="w-10/12 xl:w-8/12 h-full mx-auto flex items-center justify-between md:flex-row flex-col gap-y-6 my-6">
				<Link
					disabled={preview}
					to={preview ? `/` : `/profile/$id`}
					className="no-underline text-white"
					{...(!preview && { params: { id: params?.id! } })}
				>
					<div className="text-3xl w-full cursor-pointer">
						{name}
					</div>
				</Link>
				<div className="flex gap-x-3 items-center justify-between md:justify-start w-full md:w-fit">
					<div className="flex gap-x-2">
						<input className="p-2 text-lg bg-background text-white border-white/30 border-[0.1px] rounded-md overflow-hidden focus-within:outline-none focus-within:border-white/70" placeholder="Enter your email" />
						<div className="border-white/30 border-[0.1px] p-2 text-lg rounded-md">
							Subscribe
						</div>
					</div>
					<Link
						disabled={preview}
						to={preview ? `/` : `/profile/$id/checkout`}
						className="no-underline text-white"
						{...(!preview && { params: { id: params?.id! } })}
					>
						<div className="text-lg ml-2 p-2 flex gap-x-2 items-center border-white/30 border-[0.1px] rounded-md cursor-pointer hover:text-white/70">
							<IoMdCart />
							<span className="text-xl">
								1
							</span>
						</div>
					</Link>
				</div>
			</div>
		</div>
	)
}
export default ProfileNavbar
