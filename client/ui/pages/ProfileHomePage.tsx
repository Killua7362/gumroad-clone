import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ProfilePageLayout from "@/ui/layouts/ProfilePageLayout"
import ProfilePageProductCard from "@/ui/components/cards/ProfilePageProductCard"
import { useQuery, useQueryClient } from "@tanstack/react-query"

const ProfileHomePage = ({ preview = false, name, bio, productCategories }: { preview?: boolean, name?: string, bio?: string, productCategories?: productCategories[] }) => {
	const [rendered, setRendered] = useState(false)
	const navigate = useNavigate()
	const params = useParams()
	const queryClient = useQueryClient()

	document.title = "Profile"

	const { data: profileProductsData, error: productErrors, isPending: productsIsLoading, isSuccess: productIsSuccess, status } = useQuery({
		queryKey: ['profileProducts', params.id!],
		queryFn: () => fetch(`${window.location.origin}/api/profiles/${params.id!}`).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json().then(data => {
				let result: ProductTypePayload = {}
				for (let i = 0; i < data.data.length; i++) {
					result[data.data[i].id] = { ...data.data[i].attributes }
				}
				return result;
			})
		}),
		meta: {
			persist: false
		},
		enabled: !!params.id && !preview,
	})

	const profileProducts = useMemo(() => {
		return { ...profileProductsData as ProductTypePayload }
	}, [profileProductsData])

	useEffect(() => {
		if (preview) {
			setRendered(true)
		} else {
			if (!params.id) {
				navigate('/notfound')
			}
		}

		if (!productsIsLoading) {
			if (productIsSuccess) {
				setRendered(true)
			} else {
				navigate('/notfound')
			}
		}
	}, [params, productsIsLoading, productIsSuccess])

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
						preview && productCategories &&
						productCategories.map((e, i) => {
							return !e.hide && (
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
