import { getProductCreater } from '@/react-query/mutations';
import { NewProductSchema } from '@/forms/schema/new_product_schema';
import * as Modal from '@/ui/components/modal'
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, FieldPath, FieldValues, UseFormRegister, useForm } from "react-hook-form";
import { z } from 'zod'
import Button from '@/ui/components/button';

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
		<Modal.Root>
			<Modal.Base>
				<form id="new_product_form" className="bg-background border-white/30 rounded-xl w-[25rem] border-[0.1px] p-6 text-lg flex flex-col gap-y-6" onSubmit={handleSubmit((data) => {
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
				})}
					onClick={(e) => { e.stopPropagation() }}
				>
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
						<Modal.Close>
							<Button
								buttonName="Cancel"
							/>
						</Modal.Close>
						<Modal.Close>
							<Button buttonName="Save" type="submit" isLoading={productIsSetting} form="new_product_form" />
						</Modal.Close>
					</div>
				</form>
			</Modal.Base>
			<Modal.Open>
				<Button
					extraClasses={['rounded-xl']}
					buttonName="New Product"
				/>
			</Modal.Open>
		</Modal.Root>
	)
}

export default NewProductModal
