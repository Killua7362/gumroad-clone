import { useEffect, useState } from "react"
import ProfilePageLayout from "@/ui/layouts/ProfilePageLayout"
import ProfilePageProductCard from "@/ui/components/cards/ProfilePageProductCard"
import { getProfileProductsFetcher, getProfileStatus } from "@/react-query/query"
import Loader from "@/ui/components/loader"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute('/profile/$id/')({
	component: () => {
		return <ProfileHomePage />
	}
})

interface ProfilePageProps extends Partial<CheckoutFormSchemaType> {
	preview?: boolean;
	userId?: string;
}

export const ProfileHomePage = ({ preview = false, userId, ...profilePageProps }: ProfilePageProps) => {
	const params = Route.useParams()

	const initialData = Route.useLoaderData()

	document.title = "Profile"

	const { data: profileProducts, isPending: productsIsLoading, isSuccess: productIsSuccess } = getProfileProductsFetcher({ userId: preview ? userId : params.id, initialData: initialData?.productData })

	const { data: profileStatus, isPending: profileIsLoading, isSuccess: profileIsSuccess } = getProfileStatus({ userId: params.id, preview: preview, initialData: initialData?.profileData })

	if ((preview ? false : profileIsLoading) || productsIsLoading) return <Loader />

	if ((preview ? true : profileIsSuccess) && productIsSuccess) {
		return (
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
									<ProfilePageProductCard key={`profile_page_product_${i}`} name={e.name} url={e.url} profileProducts={Object.entries(profileProducts)} />
								)
							})
						}
						{
							!preview && profileStatus.category &&
							profileStatus.category.map((e, i) => {
								return !e.hidden && (
									<ProfilePageProductCard key={`profile_page_product_${i}`} name={e.name} url={e.url} profileProducts={Object.entries(profileProducts)} />
								)
							})
						}
					</div>
				</div>
			</ProfilePageLayout>
		)
	}
}
