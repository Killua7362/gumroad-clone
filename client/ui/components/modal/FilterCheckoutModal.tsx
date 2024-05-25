import * as Modal from '@/ui/components/modal'
import Button from '../button'
import { SelectComponent } from '../select'
import { filterTypeOptions } from '@/forms/schema/misc_schema'
import { UseFormResetField, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { useState } from 'react'
import { FaClipboard } from "react-icons/fa";
import { MdEdit, MdEditOff } from "react-icons/md";
import { useSetRecoilState } from 'recoil'
import { hideToastState } from '@/atoms/states'

const FilterCheckoutModal = ({ watch, setValue, i, resetField }: { watch: UseFormWatch<CheckoutFormSchemaType>, setValue: UseFormSetValue<CheckoutFormSchemaType>, i: number, resetField: UseFormResetField<CheckoutFormSchemaType> }) => {

	const [tempURL, setTempURL] = useState(watch(`category.${i}.url`))
	const urlparams = new URLSearchParams(tempURL)

	const setToastRender = useSetRecoilState(hideToastState)
	return (
		<Modal.Root>
			<Modal.Base>
				<div className="bg-background z-50 border-white/30 rounded-xl w-[35rem] relative border-[0.1px] p-6 text-lg flex flex-col gap-y-4 items-center" onClick={(e) => { e.stopPropagation() }}>
					<div className='text-2xl w-full'>
						Filter
					</div>
					<div className='w-full flex justify-between items-center gap-x-10'>
						<span>
							Sort by
						</span>
						<SelectComponent
							placeholder='Sort by'
							options={filterTypeOptions}
							value={filterTypeOptions.filter(e => e.label === (urlparams.get('sort_by') || 'title'))}
							onChange={(v) => {
								urlparams.set('sort_by', v?.label || 'title')
								setTempURL(urlparams.toString())
							}}
						/>
					</div>
					<div className='w-full flex justify-between items-center gap-x-10'>
						<span>
							Product Count
						</span>
						<div className='flex h-full gap-x-2'>
							{urlparams.get('product_all') !== true.toString() &&
								<input type='number' className='text-lg rounded-lg bg-background text-white border-white/30 border-[0.1px] focus:border-white w-[5rem] px-2 py-1 outline-none'
									min='1'
									defaultValue={urlparams.get('product_count') || 1}
									onChange={(event) => {
										let count: number;
										if (Number(event.currentTarget.value) >= 1) {
											count = Number(event.currentTarget.value)
										} else {
											count = 1;
										}
										urlparams.set('product_count', count.toString())
										setTempURL(urlparams.toString())
									}}
									onKeyDown={(event) => {
										if ((event.which < 48 || event.which > 57) && (event.code !== 'Backspace')) {
											event.preventDefault();
										}
									}} />
							}
							<Button
								buttonName="All"
								type="button"
								isActive={urlparams.get('product_all') === true.toString()}
								onClickHandler={() => {
									urlparams.set('product_all', urlparams.get('product_all') === true.toString() ? 'false' : 'true')
									setTempURL(urlparams.toString())
								}}
							/>
						</div>
					</div>
					<div className='flex flex-col gap-y-3 w-full h-full'>
						<div className='flex gap-x-4'>
							<Button
								buttonName=""
								type="button"
								isActive={urlparams.get('reverse') === true.toString()}
								onClickHandler={() => {
									urlparams.set('reverse', urlparams.get('reverse') === true.toString() ? 'false' : 'true')
									setTempURL(urlparams.toString())
								}}
							>
								Reverse
							</Button>
							<Button
								buttonName="Clear All"
								type="button"
								onClickHandler={() => {
									setTempURL('')
								}}
							/>
							<Button
								buttonName="Revert"
								type="button"
								onClickHandler={() => {
									setTempURL(watch(`category.${i}.url`))
								}}
							/>
							<Button
								buttonName="Default"
								type="button"
								onClickHandler={() => {
									setTempURL('reverse=false&sort_by=title&edit_url=false&product_all=true&product_count=2')
								}}
							/>
						</div>
						<div className='flex items-center gap-x-4'>
							<fieldset className='border-white/30 border-[0.1px] min-h-[3.9rem] w-full rounded-md flex items-center px-4 text-white/60 break-all' disabled={urlparams.get('edit_url') !== true.toString()}>
								<input
									type='text'
									className={`bg-background outline-none ${urlparams.get('edit_url') === true.toString() ? 'text-white' : 'text-white/70'} h-full w-full`}
									onChange={(event) => {
										event.preventDefault()
										setTempURL(event.currentTarget.value)
									}}
									value={tempURL} />
								<legend className='text-xs text-white'>URL</legend>
							</fieldset>
							{
								urlparams.get('edit_url') === true.toString() ?
									<MdEditOff className='text-2xl text-white cursor-pointer' onClick={() => {
										urlparams.set('edit_url', false.toString())
										setTempURL(urlparams.toString())
									}} />
									:
									<MdEdit className='text-2xl text-white cursor-pointer' onClick={() => {
										urlparams.set('edit_url', true.toString())
										setTempURL(urlparams.toString())
									}} />

							}
							<FaClipboard className='text-xl cursor-pointer text-white' onClick={async () => {
								try {
									await navigator.clipboard.writeText(tempURL)
									setToastRender({
										active: false,
										message: 'Copied url to clipboard succesfully'
									})
								} catch (err) {
									setToastRender({
										active: false,
										message: 'Error occured while copying to clipboard'
									})
								}
							}} />
						</div>
						<div className="flex gap-x-4 w-full justify-end">
							<Modal.Close>
								<Button
									buttonName="Cancel"
									type="button"
								/>
							</Modal.Close>
							<Modal.Close>
								<Button
									buttonName="Save"
									type="button"
									onClickHandler={() => {
										setValue(`category.${i}.url`, tempURL)
									}}
								/>
							</Modal.Close>
						</div>
					</div>
				</div>
			</Modal.Base>
			<Modal.Open>
				<Button buttonName='Filter' />
			</Modal.Open>
		</Modal.Root>
	)
}

export default FilterCheckoutModal
