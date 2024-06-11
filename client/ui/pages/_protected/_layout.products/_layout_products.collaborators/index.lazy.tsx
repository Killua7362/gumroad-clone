import { createLazyFileRoute } from '@tanstack/react-router'
import CollabCard from "@/ui/components/cards/CollabCard"
import { Fragment } from "react/jsx-runtime"
import Button from "@/ui/components/button"
import { allProductsFetcher, collabsProductFetcher } from "@/react-query/query"
import { queryClient } from  '@/app/RouteComponent'
import { getCollabApprover } from "@/react-query/mutations"
import Loader from "@/ui/components/loader"

export const Route = createLazyFileRoute('/_protected/_layout/products/_layout_products/collaborators/')({
	component: () => {
		return <CollaboratorsPage />
	}
})

const CollaboratorsPage = () => {
	const initialData = Route.useLoaderData()

	const { data: allProducts, isSuccess: productIsSuccess, isPending: productsIsLoading } = allProductsFetcher({ initialData: initialData?.allProducts })
	const { data: collabProducts, isSuccess: collabIsSuccess, isPending: collabProductsIsLoading } = collabsProductFetcher({ initialData: initialData?.collabProducts })

	if (productsIsLoading || collabProductsIsLoading) return <Loader />

	const params = Route.useSearch()
	const navigate = Route.useNavigate()

	const { mutate: collabProductSetter } = getCollabApprover()

	const productsCollection = () => {
		if (params.type == 'outgoing') {
			return allProducts;
		}
		else {
			return collabProducts
		}
	}

	const collabApproved = () => {
		let result: { [id: string]: boolean; } = {}
		const productsCollectionData: ProductTypePayload = productsCollection()

		Object.keys(productsCollectionData).filter(key => !(key in allProducts)).map((key, i) => {
			result[key] = productsCollectionData![key].collab_active &&
				Object.keys(productsCollectionData![key].collabs!).length !== 0 &&
				(collabProducts![key]?.collabs || []).filter(e => e.email === (queryClient.getQueryData(['loginStatus']) as authSchema)?.email)[0]?.approved || false
		})
		return result;
	}

	return collabIsSuccess && productIsSuccess && (
		<Fragment>
			<div className="flex gap-x-3 items-center">
				<Button
					buttonName="Outgoing"
					extraClasses={['rounded-xl']}
					isActive={(params.type === 'outgoing')}
					onClickHandler={() => {
						navigate({
							search:()=>({type:'outgoing'})
						})
					}} />
				<Button
					buttonName="Incoming"
					extraClasses={['rounded-xl']}
					isActive={(!params.type || params.type === 'incoming')}
					onClickHandler={() => {
						navigate({
							search:()=>({type:'incoming'})
						})						
					}} />
			</div>
			<div className="w-full mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
				{Object.keys(productsCollection()!).map((key, i) => {
					return productsCollection()![key].collab_active && Object.keys(productsCollection()![key].collabs!).length !== 0 && (
						<CollabCard key={key} productData={{ ...productsCollection()![key] }}>
							<div className="w-full flex justify-end">
								{
									!(key in allProducts!) &&
									<Button buttonName={collabApproved()[key] ? 'Disapprove' : 'Approve'} onClickHandler={async () => {
										collabProductSetter(key)
									}} />
								}
							</div>
						</CollabCard>
					)
				})
				}
			</div>
		</Fragment>
	)
}
