import { hideToastState } from "@/atoms/states";
import ProductEditPageLayout from "@/ui/layouts/ProductEditPageLayout"
import MDEditor from '@uiw/react-md-editor';
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { IoTrashBin } from "react-icons/io5";
import { z } from 'zod'
import { useFieldArray, useForm, useFormState, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EditProductSchema } from "@/schema/edit_product_schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ProductEditHomePage = ({ editProductState, setEditProductState }: { editProductState: ProductType, setEditProductState: React.Dispatch<React.SetStateAction<ProductType>> }) => {
	const [description, setDescription] = useState<string>()
	const [thumbnailImage, setThumbnailImage] = useState<File>()
	const [coverImage, setCoverImage] = useState<File>()
	const setToastRender = useSetRecoilState(hideToastState)

	const navigate = useNavigate()
	const params = useParams()
	const queryClient = useQueryClient()

	const { data: allProducts, isLoading: productsIsLoading } = useQuery({
		queryKey: ['allProducts']
	})

	type EditProductSchemaType = z.infer<typeof EditProductSchema>

	const {
		register,
		handleSubmit,
		setError,
		control,
		reset,
		setValue,
		formState: { errors }
	} = useForm<EditProductSchemaType>({
		resolver: zodResolver(EditProductSchema), defaultValues: {
			title: editProductState.title,
			description: editProductState.description,
			summary: editProductState.summary,
			price: editProductState.price,
			collab: editProductState.collab
		},
		shouldUnregister: false
	})

	const { append, remove, fields } = useFieldArray({
		name: 'collab',
		control
	})

	const allFormStates = useWatch({
		control
	})

	useEffect(() => {
		setDescription(editProductState.description)
	}, [])

	useEffect(() => {
		setEditProductState(prev => {
			return { ...prev, description: description!, ...allFormStates, collab: allFormStates.collab as IndividualCollab[] }
		})
	}, [allFormStates])

	const { mutateAsync: collabChecker, isSuccess: collabSuccess } = useMutation({
		mutationFn: (payload: { collabs: string[]; }) => fetch(`${window.location.origin}/api/collabs/validate_user`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify(payload),
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json()
		})
	})


	const { mutateAsync: editProductSetter, isSuccess: editSuccessfull } = useMutation({
		mutationFn: (payload: ProductType) => fetch(`${window.location.origin}/api/products/${params.id!}`, {
			method: 'PATCH',
			credentials: 'include',
			body: JSON.stringify(payload),
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json()
		}),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['allProducts'] })
			setToastRender({
				active: false,
				message: 'Product updated successfully'
			})
		},
		onError: (err) => {
			setToastRender({
				active: false,
				message: err.message
			})
		}
	})

	return (
		<Fragment>
			<form className="flex flex-col gap-y-2" onSubmit={handleSubmit(async (data) => {
				const collabValid = await collabChecker({ collabs: [...data.collab!].map(e => e.email) })

				if (!collabValid.valid) {
					(collabValid.data || []).map((e: string, index: number) => {
						e &&
							setError(`collab.${index}.email`, {
								type: `collab.${index}.email`,
								message: e
							})
					})
				}
				if (!collabValid.valid || !collabSuccess) return;

				const editProductValues = await editProductSetter({ ...editProductState, ...data })

				if (editSuccessfull) {
					setEditProductState(prev => {
						return { ...prev, ...editProductValues.data.attributes!, collab: [...data.collab] }
					})
				}

			})}>
				<div className="text-2xl">
					Main
				</div>
				<div className="flex flex-col gap-y-2">
					<div>
						Name
					</div>
					<fieldset className="border-white/30 border-[0.1px] rounded-md">
						<input className="outline-none bg-background text-white w-full text-lg" {...register('title')} />
						{errors.title && <legend className="text-sm text-red-500">{errors.title.message}</legend>}
					</fieldset>
				</div>
				<div className="flex flex-col gap-y-2">
					<div>
						Summary
					</div>
					<fieldset className="border-white/30 border-[0.1px] rounded-md">
						<input className="outline-none bg-background text-white w-full text-lg" {...register('summary')} />
						{errors.summary && <legend className="text-sm text-red-500">{errors.summary.message}</legend>}
					</fieldset>
				</div>
				<div className="flex flex-col gap-y-2">
					<div>
						Description
					</div>
					<MDEditor
						value={description}
						onChange={(data) => {
							setValue('description', data!)
							setDescription(data)
						}}
						preview="edit"
						className='w-full'
					/>
					{errors.description && description?.length! <= 10 && <legend className="text-sm text-red-500">{errors.description.message}</legend>}
				</div>
				<div className="flex flex-col gap-y-2">
					<div>
						Thumbnail
					</div>
					<div className="border-white/30 border-dashed border-[0.1px] p-10 flex cursor-not-allowed items-center justify-center flex-col gap-y-4">
						{
							thumbnailImage ?
								<img alt="thumbnailImage" width={200} height={200} src={URL.createObjectURL(thumbnailImage)} />
								:
								<div>
									Too poor for cdn
								</div>
						}
						<label htmlFor='thumbimage' className="p-2 hover:text-white/70 border-white/30 border-[0.1px] rounded-md overflow-none text-white/70">Upload...</label>
						<input type="file" id='thumbimage' name='thumnail' accept="image/png, image/gif, image/jpeg" style={{ display: 'none' }} disabled onChange={(e) => {
							if (e.target.files && e.target.files[0]) {
								setThumbnailImage(e.target.files[0])
							}
						}} />
					</div>
				</div>
				<div className="flex flex-col gap-y-2">
					<div>
						Cover
					</div>
					<div className="border-white/30 border-dashed border-[0.1px] p-10 flex cursor-not-allowed items-center justify-center flex-col gap-y-4">
						{
							coverImage ?
								<img alt="coverImage" width={200} height={200} src={URL.createObjectURL(coverImage)} />
								:
								<div>
									Too poor for cdn
								</div>
						}
						<label htmlFor='coverImage' className="p-2 cursor-pointer hover:text-white/70 border-white/30 border-[0.1px] text-white/70 rounded-md overflow-none">Upload...</label>
						<input type="file" id='coverImage' name='coverImage' accept="image/png, image/gif, image/jpeg" disabled style={{ display: 'none' }} onChange={(e) => {
							if (e.target.files && e.target.files[0]) {
								setCoverImage(e.target.files[0])
							}
						}} />
					</div>
				</div>
				<div className="flex flex-col gap-y-3">
					<div>
						Price
					</div>
					<fieldset className="border-white/30 border-[0.1px] rounded-md p-2 focus-within:border-white">
						<input className="w-full text-lg bg-background text-white outline-none px-4" type="number" step='any' {...register('price')} />
						{errors.price && <legend className="text-sm text-red-500">{errors.price.message}</legend>}
					</fieldset>
				</div>
				<div className="flex flex-col gap-y-3">
					<div>
						Collabs
					</div>
					<div className="flex gap-x-4">
						<input type="checkbox" className=" bg-background text-white border-white/30 border-[0.1px] p-1 w-fit" defaultChecked={editProductState.collab_active} onChange={(e) => {
							setEditProductState(prev => {
								return { ...prev, collab_active: e.target.checked }
							})
						}} />
						<div className="text-base">
							Activate Collab
						</div>
					</div>
					{
						editProductState.collab_active &&
						<Fragment>
							<div className='flex gap-x-4 items-center text-lg text-white/70'>
								<fieldset className="border-white/30 w-full border-[0.1px] rounded-md p-2 focus-within:border-white">
									<legend className="text-sm">member</legend>
									<div className="w-full">
										Me
									</div>
								</fieldset>
								<fieldset className="border-white/30 w-full border-[0.1px] rounded-md p-2 focus-within:border-white">
									<legend className="text-sm">Share(in %)</legend>
									<div className="w-full">
										{allFormStates.collab === undefined ? 100 : 100 - allFormStates.collab.reduce((a, { share }) => a + (Number(share) || 0), 0)}
									</div>
								</fieldset>
							</div>
							{errors.collab && errors.collab['root'] && <div className="text-red-500 text-sm">{errors.collab['root']?.message}</div>}
							{errors.collab && <div className="text-red-500 text-sm">{errors.collab.message}</div>}
							{
								fields.map((collab, index) => {
									return (
										<div className='flex gap-x-4 items-center' id={collab.id}>
											<div>
												{index + 1}
											</div>
											<fieldset className="border-white/30 border-[0.1px] rounded-md p-2 focus-within:border-white">
												<input className="text-lg bg-background text-white outline-none px-4" {...register(`collab.${index}.email`)} />
												{errors.collab && errors.collab[index]?.email && <legend className="text-red-500 text-sm">{errors.collab[index]?.email?.message}</legend>}
											</fieldset>
											<fieldset className="border-white/30 border-[0.1px] rounded-md p-2 focus-within:border-white">
												<input className="text-lg bg-background text-white outline-none px-4"  {...register(`collab.${index}.share`)} />
												{errors.collab && errors.collab[index]?.share && <legend className="text-red-500 text-sm">{errors.collab[index]?.share?.message}</legend>}
											</fieldset>
											<IoTrashBin className="text-red-500 cursor-pointer" onClick={() => {
												remove(index)
											}} />
										</div>
									)
								})
							}
							<div className="w-full text-center bg-white text-black py-2 rounded-md hover:text-accent/80 cursor-pointer" onClick={() => {
								append({ email: '', share: 1, approved: false })
							}}>
								Add new member
							</div>
						</Fragment>
					}
				</div>
				<div className="flex flex-col gap-y-3">
					<div>
						Settings
					</div>
					<div className="flex flex-col gap-y-2">
						<div className="flex gap-x-4">
							<input type="checkbox" className=" bg-background text-white border-white/30 border-[0.1px] p-1 w-fit" />
							<div className="text-base">
								Allow customers to pay whatever they want
							</div>
						</div>
						<div className="flex gap-x-4">
							<input type="checkbox" className=" bg-background text-white border-white/30 border-[0.1px] p-1 w-fit" />
							<div className="text-base">
								Allow customers to leave Reviews
							</div>
						</div>
						<div className="flex gap-x-4">
							<input type="checkbox" className=" bg-background text-white border-white/30 border-[0.1px] p-1 w-fit" />
							<div className="text-base">
								Show number of sales
							</div>
						</div>
					</div>
				</div>
				<div className="flex gap-x-4 w-full justify-end">
					<div className="px-4 py-2 border-white/30 border-[0.1px] rounded-md hover:text-white/70 cursor-pointer" onClick={() => {
						setEditProductState({ ...(allProducts as ProductTypePayload)[params.id!] })
						reset()
					}}>
						Revert
					</div>
					<button type="submit" className="px-4 py-2 bg-background text-white text-xl border-white/30 border-[0.1px] rounded-md hover:text-white/70 cursor-pointer">
						Save
					</button>
				</div>
			</form>
			<div>
				Testing
			</div>
		</Fragment >
	)
}

export default ProductEditHomePage
