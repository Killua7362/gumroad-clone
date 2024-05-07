import { useNavigate } from "react-router"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"

const SignUpPage = () => {
	const navigate = useNavigate()
	const [customError, setCustomError] = useState('')

	const signUpSchema = z.object({
		name: z.string().min(1).max(30),
		email: z.coerce.string().email().min(5),
		password: z.string().min(5).max(12),
		password_confirmation: z.string().min(5).max(12),
	}).refine((data) => data.password === data.password_confirmation, {
		message: "Password don't match",
		path: ['password_confirmation']
	})

	type signUpSchemaType = z.infer<typeof signUpSchema>

	const { mutate: signUpSetter } = useMutation({
		mutationFn: (payload: signUpSchemaType) => fetch(`${window.location.origin}/api/registrations`, {
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
		}),
		onSuccess: () => {
			navigate('/signin')
		},
		onError: (err) => {
			setCustomError(err.message)
		},
	})

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<signUpSchemaType>({ resolver: zodResolver(signUpSchema) })

	return (
		<div className="w-full h-full flex items-center justify-center text-xl">
			<form className="flex gap-x-4 border-white/30 border-[0.1px] rounded-md p-6 w-5/12 divide-x-[0.1px] divide-white/30"
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
						<button type="submit" className="w-full text-xl py-3 text-center text-black bg-white rounded-md hover:text-gray-500 cursor-pointer">
							Sign Up
						</button>
					</div>

				</div>
				<div className="p-4 w-full flex flex-col justify-center gap-y-6 pl-8">
					<div className="w-full py-3 text-center text-black bg-white rounded-md hover:text-gray-500 cursor-pointer"
						onClick={() => {
							navigate('/signin')
						}}
					>
						Sign In
					</div>
				</div>
			</form>
		</div>
	)
}

export default SignUpPage
