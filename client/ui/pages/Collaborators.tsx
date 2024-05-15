import { GoLink } from "react-icons/go"
import CollabCard from "@/ui/components/cards/CollabCard"
import { Fragment } from "react/jsx-runtime"
import { AnimatePresence, motion } from "framer-motion"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useSearchParams } from "react-router-dom"
import Button from "@/ui/components/button"
import { useMutation } from "@tanstack/react-query"
import { allProductsFetcher, collabsProductFetcher, loginStatusFetcher } from "@/query"
import { queryClient } from "@/app/RootPage"

const CollaboratorsPage = () => {

	const [params, setSearchParams] = useSearchParams()

	const { data: loginStatus, isSuccess: isLoginSuccess, isPending: isLoginStatusLoading } = loginStatusFetcher()

	const { data: collabProducts, isSuccess: collabIsSuccess, isPending: collabProductsIsLoading } = collabsProductFetcher()

	const { mutate: collabProductSetter } = useMutation({
		mutationFn: (key: string) => fetch(`${window.location.origin}/api/collabs/${key}/approve`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({}),
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json()
		}),
		onSuccess: () => {
			return queryClient.invalidateQueries({ queryKey: ['collabProducts'] })
		},
		onError: (err) => { },
	})

	const { data: allProducts, isSuccess: productIsSuccess, isPending: productsIsLoading } = allProductsFetcher()

	const productsCollection = () => {
		if (params.get('type') == 'outgoing') {
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
				(collabProducts![key]?.collabs || []).filter(e => e.email === loginStatus?.email)[0]?.approved || false
		})
		return result;
	}

	return !collabProductsIsLoading && (
		<Fragment>
			<div className="flex gap-x-3 items-center">
				<Button
					buttonName="Outgoing"
					extraClasses={['rounded-xl']}
					isActive={(params.get('type') === 'outgoing')}
					onClickHandler={() => {
						setSearchParams({ type: 'outgoing' })
					}} />
				<Button
					buttonName="Incoming"
					extraClasses={['rounded-xl']}
					isActive={(!params.get('type') || params.get('type') === 'incoming')}
					onClickHandler={() => {
						setSearchParams({ type: 'incoming' })
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

export default CollaboratorsPage
