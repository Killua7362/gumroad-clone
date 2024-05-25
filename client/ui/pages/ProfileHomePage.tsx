import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ProfilePageLayout from "@/ui/layouts/ProfilePageLayout"
import ProfilePageProductCard from "@/ui/components/cards/ProfilePageProductCard"
import { getProfileProductsFetcher, getProfileStatus } from "@/react-query/query"

interface ProfilePageProps extends Partial<CheckoutFormSchemaType> {
	preview?: boolean;
}

const ProfileHomePage = ({ preview = false, ...profilePageProps }: ProfilePageProps) => {
	const [rendered, setRendered] = useState(false)
	const navigate = useNavigate()
	const params = useParams()

	document.title = "Profile"

	const { data: profileProducts, isPending: productsIsLoading, isSuccess: productIsSuccess } = getProfileProductsFetcher({ userId: params.id, preview: preview })

	const { data: profileStatus, isPending: profileIsLoading, isSuccess: profileIsSuccess } = getProfileStatus({ userId: params.id, preview: preview })

	useEffect(() => {
		if (preview) {
			setRendered(true)
		} else {
			if (!params.id) {
				navigate('/notfound')
			}
		}

		if (!productsIsLoading && !profileIsLoading) {
			if (productIsSuccess && profileIsSuccess) {
				setRendered(true)
			} else {
				navigate('/notfound')
			}
		}
	}, [params, productsIsLoading, profileIsLoading, productIsSuccess, profileIsSuccess])

	return rendered && (
		<ProfilePageLayout preview={preview} name={preview ? profilePageProps.name! : profileStatus.name}>
			<div className={`w-full flex flex-col gap-y-6 h-full scrollbar-thin scrollbar-thumb-white scrollbar-track-background ${preview ? "pt-[6rem]" : "pt-[10rem] md:pt-[6.2rem]"}`}>
				<div className="min-h-[5rem] w-[100%] flex justify-center items-center bg-accent/30 shadow-xl shadow-black/60">
					<div className="w-10/12 xl:w-8/12 text-xl">
						<span className="w-full">
							{preview ? profilePageProps.bio! : profileStatus.bio}
						</span>
					</div>
				</div>
				<div className="w-10/12 xl:w-8/12 mx-auto h-full flex flex-col mt-2 gap-y-8">
					{
						preview && profilePageProps.category &&
						profilePageProps.category.map((e, i) => {
							return !e.hidden && (
								<ProfilePageProductCard key={`profile_page_product_${i}`} name={e.name} />
							)
						})
					}
					{
						!preview &&
						Object.keys(profileProducts).map((key, i) => {
							return <></>
						})
					}
				</div>
			</div>
		</ProfilePageLayout>
	)
}

export default ProfileHomePage
