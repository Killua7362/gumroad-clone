import { useNavigate } from "react-router"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useSetRecoilState } from "recoil"
import { loginStatuFetcher } from "@/atoms/states"
import { useState } from "react"

const SignInPage = () => {
	const loginStatusSetter = useSetRecoilState(loginStatuFetcher)
	const navigate = useNavigate()
	const [customError, setCustomError] = useState("")

	const signInSchema = z.object({
		email: z.coerce.string().email().min(5),
		password: z.string().min(5).max(12),
	})

	type signInSchemaType = z.infer<typeof signInSchema>

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors }
	} = useForm<signInSchemaType>({ resolver: zodResolver(signInSchema) })

	return (
		<div className="w-full h-full flex items-center justify-center text-xl">
			<form className="flex gap-x-4 border-white/30 border-[0.1px] rounded-md p-6 w-5/12 divide-x-[0.1px] divide-white/30" onSubmit={handleSubmit(async (data) => {
				axios.post(`${window.location.origin}/api/sessions`, {
					user: {
						email: data.email,
						password: data.password,
					}
				}, { withCredentials: true }).then(res => {
					loginStatusSetter({
						...res.data
					})
					navigate('/')
				}).catch(err => {
					setCustomError(err.response.data.error)
				})
			})}>
				<div className='flex flex-col gap-y-4 p-4 w-full'>
					<div className="text-3xl text-center">
						Sign In
					</div>
					<div className="flex flex-col gap-y-6">
						<div className="flex flex-col gap-y-2">
							<div>
								Email
							</div>
							<fieldset className="border-white/30 border-[0.1px] rounded-md overflow-none">
								<input className="bg-background outline-none text-white text-lg" {...register('email')} />
								{errors.email && <legend className="text-sm">{errors.email.message}</legend>}
							</fieldset>
						</div>
						<div className="flex flex-col gap-y-2">
							<div>
								Password
							</div>
							<fieldset className="border-white/30 border-[0.1px] rounded-md overflow-none">
								<input className="bg-background outline-none text-white text-lg" {...register('password')} type="password" />
								{errors.password && <legend className="text-sm">{errors.password.message}</legend>}
							</fieldset>
						</div>
					</div>
					{
						customError !== "" &&
						<div className="text-red-500 text-base">
							{customError}
						</div>
					}
					<button type="submit" className="w-full text-xl py-3 text-center text-black bg-white rounded-md hover:text-gray-500 cursor-pointer">
						Sign In
					</button>

				</div>
				<div className="p-4 w-full flex flex-col justify-center gap-y-6 pl-8">
					<div className="w-full py-3 text-center text-black bg-white rounded-md hover:text-gray-500 cursor-pointer"
						onClick={() => {
							navigate('/signup')
						}}
					>
						Sign Up
					</div>
				</div>
			</form>
		</div>
	)
}

export default SignInPage
