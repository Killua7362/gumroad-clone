import { AllProdctsForUser, AllProdctsForUserFetcher, modalBaseActive } from "@/atoms/states"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { z } from 'zod'
import { UseFormRegister, useForm, FieldValues, FieldErrors, FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
import { NewProductSchema } from "@/schema/new_product_schema"
import Button from '@/ui/components/button'

type NewProductSchemaType = z.infer<typeof NewProductSchema>

const FormInput = ({ name, errors, register }: { name: FieldPath<NewProductSchemaType>, errors: FieldErrors<FieldValues>, register: UseFormRegister<NewProductSchemaType> }) => {
	return (
		<fieldset className={`${errors[name] ? "border-red-400" : "border-white/30 focus-within:border-white"} border-[0.1px] w-full rounded-md p-2`}>
			<input type="text" className="bg-background text-white outline-none text-base w-full mx-2 my-1" placeholder={`${name.charAt(0).toUpperCase() + name.slice(1)} of your product`} {...register(name)} />
			{errors[name] && <legend className="text-xs text-red-400"> {`${errors[name]!.message}`}</legend>}
		</fieldset>

	)
}

const NewProductModal = () => {
	const [modalActive, setModalActive] = useRecoilState(modalBaseActive)

	const setAllProducts = useSetRecoilState(AllProdctsForUserFetcher)
	const allProductsValue = useRecoilValue(AllProdctsForUser)

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<NewProductSchemaType>({ resolver: zodResolver(NewProductSchema) })

	return (
		<form className="bg-background border-white/30 rounded-xl w-[25rem] border-[0.1px] p-6 text-lg flex flex-col gap-y-6" onSubmit={handleSubmit(async (data) => {
			let payload: ProductType =
			{
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
				setAllProducts({
					...allProductsValue,
					[res.data.data.id]: {
						...payload
					}
				})
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
					<FormInput name={`name`} register={register} errors={errors} />
				</div>
				<div className="flex gap-x-7 items-center">
					<div>
						Price
					</div>
					<FormInput name={`price`} register={register} errors={errors} />
				</div>
			</div>
			<div className="w-full flex justify-end gap-x-4">
				<Button buttonName="Cancel" onClickHandler={() => {
					setModalActive({
						active: false,
						type: ""
					})
				}} />
				<Button buttonName="Save" type="submit" />
			</div>
		</form>
	)
}

export default NewProductModal
