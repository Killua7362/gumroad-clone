import { AllProdctsForUser, AllProdctsForUserFetcher, modalBaseActive } from "@/atoms/states"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'

const NewProductModal = () => {
	const [modalActive, setModalActive] = useRecoilState(modalBaseActive)

	const NewProductSchema = z.object({
		name: z.string().min(2).max(30),
		price: z.coerce.number().min(0)
	})

	type NewProductSchemaType = z.infer<typeof NewProductSchema>

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<NewProductSchemaType>({ resolver: zodResolver(NewProductSchema) })

	const setAllProducts = useSetRecoilState(AllProdctsForUserFetcher)
	const allProductsValue = useRecoilValue(AllProdctsForUser)

	return (
		<form className="bg-background border-white/30 rounded-xl w-[25rem] border-[0.1px] p-6 text-lg flex flex-col gap-y-6" onSubmit={handleSubmit(async (data) => {
			const id = uuidv4()
			let payload: ProductType =
			{
				id: id,
				title: data.name,
				description: "",
				summary: "",
				price: data.price,
				type: "",
				live: false,
				collab_active: false,
				thumbimageSource: "",
				coverimageSource: "",
			}
			await axios.post(`${window.location.origin}/api/products`, {
				...payload
			}, { withCredentials: true }).then(res => {
				payload.id = res.data.data.id
				setAllProducts([...allProductsValue, payload])
				setModalActive({
					active: false,
					type: ""
				})
			}).catch(err => console.log(err))

		})}>
			<div className="uppercase">
				Publish your product
			</div>
			<div className="flex flex-col gap-y-4">
				<div className="flex gap-x-6 items-center">
					<div>
						Name
					</div>
					<fieldset className={`${errors.name ? "border-red-400" : "border-white/30 focus-within:border-white"} border-[0.1px] w-full rounded-md p-2`}>
						<input type="text" className="bg-background text-white outline-none text-base w-full mx-2 my-1" placeholder="Name of your product" {...register("name")} />
						{errors.name && <legend className="text-xs text-red-400"> {errors.name.message}</legend>}
					</fieldset>
				</div>
				<div className="flex gap-x-7 items-center">
					<div>
						Price
					</div>
					<fieldset className="border-white/30 border-[0.1px] w-full rounded-md focus-within:border-white p-2">
						<input type="number" step="any" className="bg-background text-white outline-none text-base w-full mx-2 my-1" placeholder="Price for your product" {...register("price")} />
						{errors.price && <legend>{errors.price.message}</legend>}
					</fieldset>
				</div>
			</div>
			<div className="w-full flex justify-end gap-x-4">
				<button type="button" className="px-4 py-2 border-white/30 rounded-md border-[0.1px] hover:text-white/70 cursor-pointer bg-background text-white text-lg w-fit" onClick={() => {
					setModalActive({
						active: false,
						type: ""
					})
				}} >
					Cancel
				</button>
				<button type="submit" className="px-4 py-2 border-white/30 rounded-md border-[0.1px] hover:text-white/70 cursor-pointer bg-background text-white text-lg w-fit" >
					Save
				</button>
			</div>
		</form>
	)
}

export default NewProductModal
