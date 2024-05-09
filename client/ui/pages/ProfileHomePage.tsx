import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ProfilePageLayout from "@/ui/layouts/ProfilePageLayout"
import ProfilePageProductCard from "@/ui/components/cards/ProfilePageProductCard"
import { useQueryClient } from "@tanstack/react-query"

const ProfileHomePage = ({ preview = false, name, bio, productCategories }: { preview?: boolean, name?: string, bio?: string, productCategories?: productCategories[] }) => {
	const [rendered, setRendered] = useState(false)
	const navigate = useNavigate()
	const params = useParams()
	const queryClient = useQueryClient()

	document.title = "Profile"

	useEffect(() => {
		console.log(queryClient.getQueryData(['allProducts']))
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
							{bio}
						</span>
					</div>
				</div>
				<div className="w-10/12 xl:w-8/12 mx-auto h-full flex flex-col mt-2 gap-y-8">
					{
						productCategories &&
						productCategories.map((e, i) => {
							return !e.hide && (
								<ProfilePageProductCard key={`profile_page_product_${i}`} name={e.name} />
							)
						})
					}
				</div>
			</div>
		</ProfilePageLayout>
	)
}

export default ProfileHomePage
