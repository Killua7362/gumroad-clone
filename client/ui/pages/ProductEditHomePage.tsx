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
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/RootPage";
import Button from "@/ui/components/button";
import Select, { OptionProps } from 'react-select'
import { cx, css } from '@emotion/css'
import { productTypeOptions } from "@/schema/edit_product_schema";

const tagsToString = (tags: typeof productTypeOptions) => {
	return (tags || []).map(ele => ele.label).join(',')
}

const stringToTags = (typeString: string) => {
	return (typeString || "").trim().split(',')
}

const ProductEditHomePage = ({ editProductState, setEditProductState }: { editProductState: ProductType, setEditProductState: React.Dispatch<React.SetStateAction<ProductType>> }) => {
	const [description, setDescription] = useState<string>(editProductState.description)
	const [selectTypes, setSelectTypes] = useState<typeof productTypeOptions>(() => {
		let tempSelectOptions: string[] = stringToTags(editProductState.tags)
		return productTypeOptions.filter(data => tempSelectOptions.includes(data.label))
	})

	const [thumbnailImage, setThumbnailImage] = useState<File>()
	const [coverImage, setCoverImage] = useState<File>()
	const setToastRender = useSetRecoilState(hideToastState)

	const navigate = useNavigate()
	const params = useParams()

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
			collabs: editProductState.collabs,
			tags: editProductState.tags
		},
		shouldUnregister: false
	})

	const { append, remove, fields } = useFieldArray({
		name: 'collabs',
		control
	})

	const allFormStates = useWatch({
		control
	})

	useEffect(() => {
		setEditProductState(prev => {
			return { ...prev, description: description!, ...allFormStates, collabs: allFormStates.collabs as IndividualCollab[], type: tagsToString(selectTypes) }
		})
	}, [allFormStates])

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
		onSuccess: (data, payload) => {
			setEditProductState(prev => {
				return { ...prev, ...data.data.attributes! }
			})

			setToastRender({
				active: false,
				message: 'Product updated successfully'
			})
			queryClient.invalidateQueries({ queryKey: ['allProducts', params.id!], exact: true })
			return queryClient.invalidateQueries({ queryKey: ['allProducts'], exact: true })
		},
		onError: (err) => {
			setToastRender({
				active: false,
				message: err.message
			})
		}
	})

	const { mutateAsync: collabChecker, isSuccess: collabSuccess, isPending: productIsLoading } = useMutation({
		mutationFn: (payload: ProductType) => fetch(`${window.location.origin}/api/collabs/validate_user`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ collabs: [...payload.collabs!].map(e => e.email) }),
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json()
		}),
		onSuccess: (data, payload) => {
			if (data.valid) {
				editProductSetter({ ...payload })
			} else {
				(data.data || []).map((e: string, index: number) => {
					e &&
						setError(`collabs.${index}.email`, {
							type: `collabs.${index}.email`,
							message: e
						})
				})
			}
		},
		onError: (error) => { }
	})

	return (
		<Fragment>
			<form className="flex flex-col gap-y-4" id="edit_product_form" onSubmit={handleSubmit(() => {
				/* collabChecker({ ...editProductState, ...data }) */
			})}
			>
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
						Product Type
					</div>
					<Select
						isMulti
						styles={{
							control: (baseStyles, state) => ({
								...baseStyles,
								borderColor: state.isFocused ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.3)',
								backgroundColor: '#09090B',
								cursor: 'pointer',
							}),
						}}
						options={productTypeOptions}
						defaultValue={[...selectTypes]}
						placeholder="Proudct type..."
						classNamePrefix="react-select"
						className={cx(css`
							.react-select{
								&__menu {
									background-color:#09090B;
									border:solid 0.1px rgba(255,255,255,0.3);
								}

								&__option--is-focused{
									background-color:white;
									color:black;
									cursor:pointer;
								}
							}
						`, `text-base !cursor-pointer`)}
						onChange={(v) => {
							setSelectTypes([...v])
							setValue('tags', tagsToString([...v]))
						}}
					/>
					{errors.tags && <legend className="text-sm text-red-500">{errors.tags.message}</legend>}
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
							setDescription(data as string)
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
										{allFormStates.collabs === undefined ? 100 : 100 - allFormStates.collabs.reduce((a, { share }) => a + (Number(share) || 0), 0)}
									</div>
								</fieldset>
							</div>
							{errors.collabs && errors.collabs['root'] && <div className="text-red-500 text-sm">{errors.collabs['root']?.message}</div>}
							{errors.collabs && <div className="text-red-500 text-sm">{errors.collabs.message}</div>}
							{
								fields.map((collab, index) => {
									return (
										<div className='flex gap-x-4 items-center' id={collab.id}>
											<div>
												{index + 1}
											</div>
											<fieldset className="border-white/30 border-[0.1px] rounded-md p-2 focus-within:border-white">
												<input className="text-lg bg-background text-white outline-none px-4" {...register(`collabs.${index}.email`)} />
												{errors.collabs && errors.collabs[index]?.email && <legend className="text-red-500 text-sm">{errors.collabs[index]?.email?.message}</legend>}
											</fieldset>
											<fieldset className="border-white/30 border-[0.1px] rounded-md p-2 focus-within:border-white">
												<input className="text-lg bg-background text-white outline-none px-4"  {...register(`collabs.${index}.share`)} />
												{errors.collabs && errors.collabs[index]?.share && <legend className="text-red-500 text-sm">{errors.collabs[index]?.share?.message}</legend>}
											</fieldset>
											<IoTrashBin className="text-red-500 cursor-pointer" onClick={() => {
												remove(index)
											}} />
										</div>
									)
								})
							}
							<Button buttonName="Add new member" extraClasses={[`!w-full`]} onClickHandler={() => {
								append({ email: '', share: 1, approved: false })
							}} />
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
					<Button buttonName="Revert" type='button' onClickHandler={() => {
						setEditProductState({ ...queryClient.getQueryData(['allProducts', params.id!]) as ProductType })
						reset()
					}} />
					<Button buttonName="Save" type='submit' isLoading={productIsLoading} extraClasses={['!hidden']} />
				</div>
			</form>
			<div>
				Testing
			</div>
		</Fragment >
	)
}

export default ProductEditHomePage
