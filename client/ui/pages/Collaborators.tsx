import { GoLink } from "react-icons/go"
import CollabCard from "@/ui/components/cards/CollabCard"
import { Fragment } from "react/jsx-runtime"
import { AnimatePresence, motion } from "framer-motion"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { useEffect, useMemo, useState } from "react"
import { AllProdctsForUser, CollabProducts, CollabProductsSelector, loginStatuState } from "@/atoms/states"
import axios from 'axios'
import { useParams } from "react-router"
import { useSearchParams } from "react-router-dom"
import Button from "@/ui/components/button"

const CollaboratorsPage = () => {
	const allProducts = useRecoilValue(AllProdctsForUser)
	const collabProducts = useRecoilValue(CollabProducts)
	const setCollabProducts = useSetRecoilState(CollabProductsSelector)

	const [params, setSearchParams] = useSearchParams()
	const loginStatus = useRecoilValue(loginStatuState)
	const [rendered, setRendered] = useState(false)
	const [productsCollection, setProductsCollection] = useState<ProductTypePayload>()

	useEffect(() => {
		if (params.get('type') === 'outgoing') {
			setProductsCollection({ ...allProducts })
		} else {
			setProductsCollection({ ...collabProducts })
		}

		if (rendered === false) {
			setRendered(true)
		}
	}, [params, collabProducts, allProducts])

	const collabApproved = useMemo(() => {
		let result: { [id: string]: boolean; } = {}
		Object.keys(productsCollection! || {}).filter(key => !(key in allProducts)).map((key, i) => {
			result[key] = productsCollection![key].collab_active && Object.keys(productsCollection![key].collab!).length !== 0 && (collabProducts[key]?.collab || []).filter(e => e.email === loginStatus.email)[0]?.approved || false
		})
		return result;
	}, [productsCollection])

	return rendered && (
		<Fragment>
			<div className="flex gap-x-3 items-center">
				<Button buttonName="Outgoing" extraClasses={['rounded-xl', `${(params.get('type') === 'outgoing') && '!border-white'} `]} onClickHandler={() => {
					setSearchParams({ type: 'outgoing' })
				}} />
				<Button
					buttonName="Incoming"
					extraClasses={['rounded-xl', `${(!params.get('type') || params.get('type') === 'incoming') && '!border-white'} `]}
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
									!(key in allProducts) &&
									<Button buttonName={collabApproved[key] ? 'Disapprove' : 'Approve'} onClickHandler={async () => {
										await axios.post(`${window.location.origin}/api/collabs/${key}/approve`, {}, { withCredentials: true }).then(res => {
											let tempCollab: IndividualCollab[] = [...collabProducts[key].collab!];
											for (let j = 0; j < (collabProducts[key].collab!).length; j++) {
												tempCollab[j] = { ...res.data.data.attributes }
												if (collabProducts[key].collab![j].email === loginStatus.email) {
													setCollabProducts({ ...collabProducts, [key]: { ...collabProducts[key], collab: [...tempCollab] } })
													break;
												}
											}
										}).catch(err => console.log(err))
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
