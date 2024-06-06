import { z } from 'zod'
import { useFieldArray, useForm, useFormState, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EditProductSchema } from "@/forms/schema/edit_product_schema";
import { queryClient } from "@/app/RootPage";
import Button from "@/ui/components/button";
import { SelectComponent } from "@/ui/components/select";
import { cx, css } from '@emotion/css'
import { productTypeOptions } from "@/forms/schema/edit_product_schema";
import { getProductEditor } from "@/react-query/mutations";
import { getEditProductFormProps } from "@/forms";
import { productEditContext } from '../_layout_edit';
import { currencyTypeOptions } from "@/forms/schema/misc_schema";
import { ProductsDetailsPage } from '@/ui/pages/profile.$id/product.$productid/index.lazy';
import { Runner } from 'react-runner'
import { createLazyFileRoute } from "@tanstack/react-router";
import { Fragment, useContext } from 'react';
import { useSetRecoilState } from 'recoil';
import { hideToastState } from '@/atoms/states';
import { IoTrashBin } from 'react-icons/io5';
import MDEditor from '@uiw/react-md-editor';

export const Route = createLazyFileRoute('/_protected/_layout/products/edit/$id/_layout_edit/home/')({
	component: () => {
		return <ProductEditHomePage />
	}
})

const tagsToString = (tags: typeof productTypeOptions) => {
	return (tags || []).map(ele => ele.value).join(',')
}

const stringToTags = (typeString: string) => {
	return (typeString || "").trim().split(',')
}

const ProductEditHomePage = () => {
	const localProductEditContext = useContext(productEditContext)
	const { errors, register, setValue, watch, control, reset, setError } = localProductEditContext!

	const setToastRender = useSetRecoilState(hideToastState)

	const params = Route.useParams()
	const collab_active = watch('collab_active') || false
	const collabs = watch('collabs') || []
	const description = watch('description') || ''
	const currency_code = watch('currency_code') || 'USD'

	const code = `
		<div className="w-[60vw] mb-[-10rem] min-h-screen relative origin-top-left bg-background pointer-events-none" style={{transform:'scale(0.8)'}}>
			<ProductsDetailsPage preview={true} watch={watch}/>
		</div>
	`

	const scope = {
		ProductsDetailsPage,
		watch
	}

	const { append, remove, fields } = useFieldArray({
		name: 'collabs',
		control
	})

	return (
		<Fragment>
			<div className="flex flex-col gap-y-4 w-full xl:w-7/12 xl:h-[50rem] px-0 xl:px-8 overflow-y-auto bg-background overflow-x-hidden scrollbar-thin scrollbar-thumb-white scrollbar-track-background flex flex-col justify-between gap-y-4">
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
					<SelectComponent
						isMulti={true}
						options={productTypeOptions}
						value={[...productTypeOptions.filter(data => stringToTags(watch('tags')).includes(data.value))]}
						placeholder="Proudct type..."
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
						value={description}
						onChange={(data) => {
							setValue('description', data!)
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
					<fieldset className="border-white/30 border-[0.1px] rounded-md p-2 focus-within:border-white flex">
						<SelectComponent
							placeholder='Enter Price...'
							options={currencyTypeOptions}
							value={{ value: currency_code, label: currency_code }}
							width='95px'
							onChange={(v) => {
								setValue('currency_code', v?.value || 'USD')
							}}
						/>
						<input className="w-full text-lg bg-background text-white outline-none px-4" type="number" step='any' {...register('price')} />
						{errors.price && <legend className="text-sm text-red-500">{errors.price.message}</legend>}
					</fieldset>
				</div>
				<div className="flex flex-col gap-y-3">
					<div>
						Collabs
					</div>
					<div className="flex gap-x-4">
						<input type="checkbox" className=" bg-background text-white border-white/30 border-[0.1px] p-1 w-fit" defaultChecked={collab_active} onChange={(e) => {
							setValue('collab_active', !collab_active)
						}} />
						<div className="text-base">
							Activate Collab
						</div>
					</div>
					{
						collab_active &&
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
										{collabs === undefined ? 100 : 100 - collabs.reduce((a, { share }) => a + (Number(share) || 0), 0)}
									</div>
								</fieldset>
							</div>
							{errors.collabs && errors.collabs['root'] && <div className="text-red-500 text-sm">{errors.collabs['root']?.message}</div>}
							{errors.collabs && <div className="text-red-500 text-sm">{errors.collabs.message}</div>}
							{
								fields.map((collab, index) => {
									return (
										<div className='flex gap-x-4 items-center' key={collab.id}>
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
			<div className={`w-5/12 h-[50rem] overflow-x-auto overflow-y-auto bg-background scrollbar-none  hidden border-x-[0px] xl:block border-white/30 p-2 px-0 border-l-[0.1px]`}
			>
				<div className="m-3 mt-1 text-xl uppercase font-medium tracking-widest text-white/70">
					Preview
				</div>
				<Runner scope={scope} code={code} />
			</div>
		</Fragment >
	)
}
