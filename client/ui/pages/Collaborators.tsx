import { GoLink } from "react-icons/go"
import CollabCard from "@/ui/components/cards/CollabCard"
import { Fragment } from "react/jsx-runtime"
import { AnimatePresence, motion } from "framer-motion"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router"
import { useSearchParams } from "react-router-dom"
import Button from "@/ui/components/button"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const CollaboratorsPage = () => {
	const queryClient = useQueryClient()

	const [params, setSearchParams] = useSearchParams()

	const { data: loginStatus, isSuccess: isLoginSuccess, isError: isLoginError } = useQuery({
		queryKey: ['loginStatus'],
	});

	queryClient.setQueryDefaults(['collabProducts'], {
		queryFn: () => fetch(`${window.location.origin}/api/collabs/products`).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json().then(data => {
				let result: ProductTypePayload = {}
				for (let i = 0; i < data.data.length; i++) {
					result[data.data[i].id] = { ...data.data[i].attributes }
				}
				for (let i = 0; i < data.included.length; i++) {
					if (data.included[i].type === 'collab') {
						const { product_id, ...temp } = { ...data.included[i].attributes, product_id: "1" }
						result[data.included[i].attributes.product_id] = { ...result[data.included[i].attributes.product_id], collab: [...result[data.included[i].attributes.product_id].collab || [], { ...temp }] }
					}
				}
				return result;
			})
		})
	})

	const { data: collabProductsData, error: collabProductErrors, isLoading: collabProductsIsLoading } = useQuery({
		queryKey: ['collabProducts']
	})

	const collabProducts = useMemo(() => {
		return { ...collabProductsData as ProductTypePayload }
	}, [collabProductsData])

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
			queryClient.invalidateQueries({ queryKey: ['allProducts'] })
		},
		onError: (err) => { },
	})

	const { data: allProductsData, error: productErrors, isLoading: productsIsLoading } = useQuery({
		queryKey: ['allProducts'],
	})
	const allProducts = useMemo(() => {
		return { ...allProductsData as ProductTypePayload }
	}, [allProductsData])

	const productsCollection: ProductTypePayload = useMemo(() => {
		if (params.get('type') === 'outgoing') {
			return { ...allProducts }
		} else {
			return { ...collabProducts }
		}
	}, [params, allProducts!, collabProducts!])

	const collabApproved = useMemo(() => {
		let result: { [id: string]: boolean; } = {}
		Object.keys(productsCollection).filter(key => !(key in allProducts)).map((key, i) => {
			result[key] = productsCollection![key].collab_active &&
				Object.keys(productsCollection![key].collab!).length !== 0 &&
				(collabProducts![key]?.collab || []).filter(e => e.email === (loginStatus as authSchema).email)[0]?.approved || false
		})
		return result;
	}, [productsCollection, loginStatus])

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
				{Object.keys(productsCollection!).map((key, i) => {
					return productsCollection![key].collab_active && Object.keys(productsCollection![key].collab!).length !== 0 && (
						<CollabCard productData={{ ...productsCollection![key] }}>
							<div className="w-full flex justify-end">
								{
									!(key in allProducts!) &&
									<Button buttonName={collabApproved[key] ? 'Disapprove' : 'Approve'} onClickHandler={async () => {
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
