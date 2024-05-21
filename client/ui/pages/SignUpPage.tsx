import { useNavigate } from "react-router"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from "react"
import Button from "@/ui/components/button"
import { signUpSchema } from "@/schema/auth_schema"
import { setSignUp } from "@/react-query/mutations"

const SignUpPage = () => {
	const navigate = useNavigate()
	const [customError, setCustomError] = useState('')


	type signUpSchemaType = z.infer<typeof signUpSchema>

	const { mutate: signUpSetter, isPending: isSignUpSetting } = setSignUp({ setCustomError: setCustomError })

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<signUpSchemaType>({ resolver: zodResolver(signUpSchema) })

	return (
		<div className="w-full h-full flex items-center justify-center text-xl">
			<form className="flex gap-x-4 border-white/30 border-[0.1px] flex-col lg:flex-row rounded-md p-6 w-11/12 sm:w-9/12 md:w-7/12 lg:w-9/12 xl:w-7/12 2xl:w-6/12 divide-y-[0.1px] lg:divide-y-0 lg:divide-x-[0.1px] divide-white/30"
				onSubmit={handleSubmit((data) => {
					signUpSetter({ ...data })
				})}
			>
				<div className='flex flex-col gap-y-4 p-4 w-full'>
					<div className="text-3xl text-center">
						Sign Up
					</div>
					<div className="flex flex-col gap-y-6">
						<div className="flex flex-col gap-y-2">
							<div>
								Name
							</div>
							<fieldset className={`${errors.name ? "border-red-500" : "border-white/30 focus-within:border-white"} border-[0.1px] rounded-md overflow-none`}>
								<input className="bg-background outline-none text-white text-lg" {...register('name')} />
								{errors.name && <legend className="text-sm">{errors.name.message}</legend>}
							</fieldset>
						</div>
						<div className="flex flex-col gap-y-2">
							<div>
								Email
							</div>
							<fieldset className={`${errors.email ? "border-red-500" : "border-white/30 focus-within:border-white"} border-[0.1px] rounded-md overflow-none`}>
								<input className="bg-background outline-none text-white text-lg" {...register('email')} />
								{errors.email && <legend className="text-sm">{errors.email.message}</legend>}
							</fieldset>
						</div>
						<div className="flex flex-col gap-y-2">
							<div>
								Password
							</div>
							<fieldset className={`${errors.password ? "border-red-500" : "border-white/30 focus-within:border-white"} border-[0.1px] rounded-md overflow-none`}>
								<input className="bg-background outline-none text-white text-lg" {...register('password')} type="password" />
								{errors.password && <legend className="text-sm">{errors.password.message}</legend>}
							</fieldset>
						</div>
						<div className="flex flex-col gap-y-2">
							<div>
								Confirm Password
							</div>
							<fieldset className={`${errors.password_confirmation ? "border-red-500" : "border-white/30 focus-within:border-white"} border-[0.1px] rounded-md overflow-none`}>
								<input className="bg-background outline-none text-white text-lg" type="password" {...register('password_confirmation')} />
								{errors.password_confirmation && <legend className="text-sm">{errors.password_confirmation.message}</legend>}
							</fieldset>
						</div>
						{
							customError !== "" &&
							<div className="text-red-500 text-base">
								{customError}
							</div>
						}
						<Button buttonName="Sign Up" type="submit" extraClasses={[`!w-full !py-4`]} isLoading={isSignUpSetting} />
					</div>

				</div>
				<div className="p-4 w-full flex flex-col justify-center gap-y-6 lg:pl-8">
					<Button buttonName="Sign In" extraClasses={[`!w-full !py-4`]} onClickHandler={() => {
						navigate('/signin')
					}} />
				</div>
			</form>
		</div>
	)
}

export default SignUpPage
