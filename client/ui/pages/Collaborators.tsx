import { GoLink } from "react-icons/go"
import CollabCard from "@/ui/components/cards/CollabCard"
import { Fragment } from "react/jsx-runtime"
import { AnimatePresence, motion } from "framer-motion"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { useEffect, useState } from "react"
import { AllProdctsForUser, CollabProducts, CollabProductsSelector, loginStatuState } from "@/atoms/states"
import axios from 'axios'
import { useParams } from "react-router"
import { useSearchParams } from "react-router-dom"

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
	}, [params])

	return rendered && (
		<Fragment>
			<div className="flex gap-x-3 items-center">
				<div className={`px-4 py-2 w-fit text-black rounded-xl hover:bg-white/70 cursor-pointer ${(params.get('type') === 'outgoing') ? 'bg-white/70' : 'bg-white'} hover:text-gray-800`}
					onClick={() => {
						setSearchParams({ type: 'outgoing' })
					}}
				>
					Outgoing
				</div>
				<div className={`px-4 py-2 w-fit text-black rounded-xl hover:bg-white/70 cursor-pointer ${(!params.get('type') || params.get('type') === 'incoming') ? 'bg-white/70' : 'bg-white'} hover:text-gray-800`}
					onClick={async () => {
						setSearchParams({ type: 'incoming' })
					}}
				>
					Incoming
				</div>
			</div>
			<div className="w-full mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
				{Object.keys(productsCollection!).map((key, i) => {
					return productsCollection![key].collab_active && Object.keys(productsCollection![key].collab!).length !== 0 && (
						<CollabCard productData={{ ...productsCollection![key] }}>
							<div className="w-full flex justify-end">
								{
									!(key in allProducts) &&
									<div className="w-fit border-white/30 border-[0.1px] px-4 py-2 rounded-md hover:text-white/80 cursor-pointer" onClick={async () => {
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
									}}>
										{
											(collabProducts[key]?.collab || []).filter(e => e.email === loginStatus.email)[0]?.approved ? 'Disapprove' : 'Approve'
										}
									</div>
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
