import { createLazyFileRoute } from '@tanstack/react-router'
import { ProfileHomePage } from '@/ui/pages/profile.$id/index.lazy';
import { useEffect, useState } from 'react'
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from '@/ui/components/button';
import { queryClient } from '@/app/RouteComponent';
import { getProfileStatus } from '@/react-query/query';
import { getCheckoutFormProps } from '@/forms';
import { useFieldArray } from 'react-hook-form';
import { getProfileStatusSetter } from '@/react-query/mutations';
import { FormInput } from '@/ui/components/forms';
import FilterCheckoutModal from '@/ui/components/modal/FilterCheckoutModal';
import { Runner } from 'react-runner'
import Loader from '@/ui/components/loader';

export const Route = createLazyFileRoute('/_protected/_layout/checkout/_layout_checkout/form/')({
	component: () => {
		return <CheckoutForm />
	}
})
const CheckoutForm = () => {
	const initialData = Route.useLoaderData()

	const { data: profileStatus, isPending: profileIsLoading, isSuccess: profileIsSuccess } = getProfileStatus({ userId: (queryClient.getQueryData(['loginStatus']) as authSchema).user_id, preview: false, initialData })

	const code = `
		<div className="w-[60vw] mb-[-10rem] min-h-screen relative origin-top-left bg-background pointer-events-none" style={{transform:'scale(0.8)'}}>
			<ProfileHomePage preview={true} name={name} bio={bio} category={category} userId={userId}/>
		</div>
	`

	if (profileIsLoading) return <Loader />

	const { handleSubmit, register, control, reset, watch, setValue, errors, resetField, isDirty } = getCheckoutFormProps(profileStatus || {})

	const { mutate: profileStatusSetter, isPending: profileStatusLoading } = getProfileStatusSetter({ userId: (queryClient.getQueryData(['loginStatus']) as authSchema).user_id! })
	const [rendered, setRendered] = useState(false)

	const bio = watch('bio')
	const name = watch('name')
	const category = watch('category')
	const userId = (queryClient.getQueryData(['loginStatus']) as authSchema).user_id

	const scope = {
		ProfileHomePage,
		name,
		bio,
		category,
		userId
	}

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'category'
	})

	return profileIsSuccess && (
		<div className="flex justify-center w-full h-full gap-x-0">
			<form className="w-full xl:w-7/12 xl:h-[50rem] py-10 px-0 xl:px-8 overflow-y-auto bg-background overflow-x-hidden scrollbar-thin scrollbar-thumb-white scrollbar-track-background flex flex-col justify-between gap-y-4" id='checkout_form' onSubmit={handleSubmit((data) => {
				if (isDirty) {
					profileStatusSetter({ ...data })
				}
			})}>
				<div className='flex flex-col gap-y-4'>
					<div className='flex flex-col gap-y-4'>
						<div className='text-xl'>
							Name
						</div>
						<FormInput<CheckoutFormSchemaType> name='name' errors={errors} register={register} placeholder='Name' type='text' />
					</div>
					<div className='flex flex-col gap-y-4'>
						<div className='text-xl'>
							Bio
						</div>
						<FormInput<CheckoutFormSchemaType> name='bio' errors={errors} register={register} placeholder='Bio' type='text' />
					</div>
					<div className='flex flex-col gap-y-4'>
						<div className='text-xl'>
							Products
						</div>
						<div className='flex flex-col gap-y-4'>
							{
								fields.map((e, i) => {
									return (
										<div key={e.id} className='flex flex-col gap-y-2'>
											<div className='gap-x-4 items-center flex'>
												<span>
													{i + 1}
												</span>
												<FormInput<CheckoutFormSchemaType> type='text' name={`category.${i}.name`} errors={errors} register={register} placeholder='Category Name' />

												<FilterCheckoutModal watch={watch} setValue={setValue} i={i} resetField={resetField} />

												<Button buttonName='' onClickHandler={() => {
													setValue(`category.${i}.hidden`, !watch(`category.${i}.hidden`),{shouldDirty:true})
												}}>
													{
														watch(`category.${i}.hidden`) ?
															<span className='flex gap-x-2 items-center'>
																<FaEye />
																Unhide
															</span>
															:
															<span className='flex gap-x-2 items-center'>
																<FaEyeSlash />
																Hide
															</span>
													}
												</Button>
												<Button buttonName='' onClickHandler={() => { remove(i) }} >
													<RiDeleteBin2Fill className='text-red-400' />
													<span>
														Delete
													</span>
												</Button>
											</div>
											{errors.category &&
												<div className='text-red-400 flex flex-col gap-y-1'>
													{errors.category[i]?.name &&
														<span>
															Name: {errors.category[i]?.name?.message}
														</span>
													}
													{errors.category[i]?.url &&
														<span>
															Filter: {errors.category[i]?.url?.message}
														</span>
													}
												</div>
											}
										</div>
									)
								})
							}
							<div className='gap-x-4 items-center flex w-full justify-end'>
								<Button buttonName='Add new category' onClickHandler={() => {
									append({ name: '', hidden: true, url: '' })
								}}
									extraClasses={['w-full py-4']}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className='flex gap-x-4 w-full justify-end'>
					<Button buttonName='Revert' onClickHandler={() => { reset() }} />
					<Button buttonName='Save' type='submit' form='checkout_form' isLoading={profileIsLoading} />
				</div>
			</form >
			<div className={`w-5/12 h-[50rem] overflow-x-auto overflow-y-auto bg-background scrollbar-thin scrollbar-thumb-white scrollbar-track-background hidden border-x-[0px] xl:block border-white/30 p-2 px-0 border-l-[0.1px]`}
			>
				<div className="m-3 mt-1 text-xl uppercase font-medium tracking-widest text-white/70">
					Preview
				</div>
				<Runner scope={scope} code={code} />
			</div>
		</div >
	)
}

