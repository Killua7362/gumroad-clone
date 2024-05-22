// @ts-ignore: Object is possibly 'null'.

import { hideToastState } from "@/atoms/states";
import ProductEditPageLayout from "@/ui/layouts/ProductEditPageLayout"
import MDEditor from '@uiw/react-md-editor';
import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { IoTrashBin } from "react-icons/io5";
import { z } from 'zod'
import { useFieldArray, useForm, useFormState, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EditProductSchema } from "@/forms/schema/edit_product_schema";
import { queryClient } from "@/app/RootPage";
import Button from "@/ui/components/button";
import Select, { OptionProps } from 'react-select'
import { cx, css } from '@emotion/css'
import { productTypeOptions } from "@/forms/schema/edit_product_schema";
import { getProductEditor } from "@/react-query/mutations";
import { getEditProductFormProps } from "@/forms";
import { productEditContext } from "./ProductEditPage";

const tagsToString = (tags: typeof productTypeOptions) => {
	return (tags || []).map(ele => ele.label).join(',')
}

const stringToTags = (typeString: string) => {
	return (typeString || "").trim().split(',')
}

const ProductEditHomePage = () => {
	const localProductEditContext = useContext(productEditContext)
	const { allFormStates, handleSubmit, errors, register, setValue, watch, control, reset, setError, editProductState, setEditProductState } = localProductEditContext!

	const setToastRender = useSetRecoilState(hideToastState)

	const navigate = useNavigate()
	const params = useParams()

	const { append, remove, fields } = useFieldArray({
		name: 'collabs',
		control
	})

	useEffect(() => {
		setEditProductState(prev => {
			return { ...prev, ...allFormStates, collabs: allFormStates.collabs as IndividualCollab[] }
		})
	}, [allFormStates])

	return (
		<Fragment>
			<div className="flex flex-col gap-y-4">
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
						value={[...productTypeOptions.filter(data => stringToTags(watch('tags')).includes(data.label))]}
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
						value={watch('description')}
						onChange={(data) => {
							setValue('description', data!)
						}}
						preview="edit"
						className='w-full'
					/>
					{errors.description && editProductState.description?.length! <= 10 && <legend className="text-sm text-red-500">{errors.description.message}</legend>}
				</div>
				<div className="flex flex-col gap-y-2">
					<div>
						Thumbnail
					</div>
					<div className="border-white/30 border-dashed border-[0.1px] p-10 flex cursor-not-allowed items-center justify-center flex-col gap-y-4">
						<div>
							Too poor for cdn
						</div>
						<label htmlFor='thumbimage' className="p-2 cursor-pointer hover:text-white/70 border-white/30 border-[0.1px] text-white/70 rounded-md overflow-none">Upload...</label>
						<input type="file" id='thumbimage' name='thumnail' accept="image/png, image/gif, image/jpeg" style={{ display: 'none' }} disabled />
					</div>
				</div>
				<div className="flex flex-col gap-y-2">
					<div>
						Cover
					</div>
					<div className="border-white/30 border-dashed border-[0.1px] p-10 flex cursor-not-allowed items-center justify-center flex-col gap-y-4">
						<div>
							Too poor for cdn
						</div>
						<label htmlFor='coverImage' className="p-2 cursor-pointer hover:text-white/70 border-white/30 border-[0.1px] text-white/70 rounded-md overflow-none">Upload...</label>
						<input type="file" id='coverImage' name='coverImage' accept="image/png, image/gif, image/jpeg" disabled style={{ display: 'none' }} />
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
					<Button buttonName="Save" type='submit' extraClasses={['!hidden']} />
				</div>
			</div>
			<div>
				Testing
			</div>
		</Fragment >
	)
}

export default ProductEditHomePage
