import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ProfilePageLayout from "@/ui/layouts/ProfilePageLayout"
import ProfilePageProductCard from "@/ui/components/cards/ProfilePageProductCard"

const ProfileHomePage = ({ preview = false }: { preview?: boolean }) => {
	const [rendered, setRendered] = useState(false)
	const navigate = useNavigate()
	const params = useParams()

	document.title = "Profile"

	useEffect(() => {
		const checkId = async () => {
			setRendered(true)
		}
		checkId()
	}, [])

	return rendered && (
		<ProfilePageLayout preview={preview}>
			<div className={`w-full flex flex-col gap-y-6 h-full scrollbar-thin scrollbar-thumb-white scrollbar-track-background ${preview ? "pt-[6rem]" : "pt-[10rem] md:pt-[6.2rem]"}`}>
				<div className="min-h-[5rem] w-[100%] flex justify-center items-center bg-accent/30 shadow-xl shadow-black/60">
					<div className="w-10/12 xl:w-8/12 text-xl">
						<span className="w-full">
							This is the awesome bio we are talking about yayyy
						</span>
					</div>
				</div>
				<div className="w-10/12 xl:w-8/12 mx-auto h-full flex flex-col mt-2 gap-y-8">
					<ProfilePageProductCard />
					<ProfilePageProductCard />
				</div>
			</div>
		</ProfilePageLayout>
	)
}

export default ProfileHomePage
