import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { z } from 'zod'
import { UseFormRegister, useForm, FieldValues, FieldErrors, FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';
import { NewProductSchema } from "@/schema/new_product_schema"
import Button from '@/ui/components/button'
import { queryClient } from "@/app/RootPage"
import { getProductCreater } from "@/react-query/mutations"

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

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<NewProductSchemaType>({ resolver: zodResolver(NewProductSchema) })


	const { mutate: productSetter, isPending: productIsSetting } = getProductCreater()

	return (
		<form className="bg-background border-white/30 rounded-xl w-[25rem] border-[0.1px] p-6 text-lg flex flex-col gap-y-6" onSubmit={handleSubmit((data) => {
			let payload: ProductType =
			{
				title: data.name,
				description: "",
				summary: "",
				price: data.price,
				tags: "",
				live: false,
				collab_active: false,
				thumbimageSource: "",
				coverimageSource: "",
				collabs: [] as IndividualCollab[]
			}
			productSetter(payload)
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
				<Button
					buttonName="Cancel"
					onClickHandler={() => {
					}} />
				<Button buttonName="Save" type="submit" isLoading={productIsSetting}
				/>
			</div>
		</form>
	)
}

export default NewProductModal
