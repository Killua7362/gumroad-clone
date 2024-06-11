import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetRecoilState } from "recoil"
import { useEffect, useState } from "react"
import { queryClient } from  '@/app/RouteComponent'
import Button from "@/ui/components/button"
import { signInSchema } from "@/forms/schema/auth_schema"
import { setLoginStatus } from "@/react-query/mutations"
import { Link } from '@tanstack/react-router'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_nonprotected/_layout/signin/')({
	component: () => {
		return <SignInPage />
	}
})

const SignInPage = () => {
	const [customError, setCustomError] = useState<string>("")

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors }
	} = useForm<signInSchemaType>({ resolver: zodResolver(signInSchema) })

	const { mutate: loginStatusSetter, isPending: isLoginSetting } = setLoginStatus({ setCustomError })

	return (
		<div className="w-full flex items-center justify-center text-xl"
			style={{
				height: 'calc(100vh - 5rem)'
			}}
		>
			<form
				id='sign_in_form'
				className="flex gap-x-4 border-white/30 border-[0.1px] flex-col lg:flex-row rounded-md p-6 w-10/12 sm:w-8/12 md:w-6/12 lg:w-8/12 xl:w-6/12 2xl:w-5/12 divide-y-[0.1px] lg:divide-y-0 lg:divide-x-[0.1px] divide-white/30" onSubmit={handleSubmit((data) => {
					loginStatusSetter({ ...data })
				})}>
				<div className='flex flex-col gap-y-6 p-4 w-full'>
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
						<div className="text-base flex w-full justify-between">
							<span>
								Remember Me
							</span>
							<input type="checkbox" className="cursor-pointer border-white/30 border-[0.1px] hue-rotate-60" {...register('remember')} />
						</div>
					</div>
					{
						customError !== "" &&
						<div className="text-red-500 text-base">
							{customError}
						</div>
					}
					<Button buttonName="Sign In" form="sign_in_form" type="submit" extraClasses={[`!w-full !py-4`]} isLoading={isLoginSetting} />

				</div>
				<div className="p-4 w-full flex flex-col justify-center gap-y-6 lg:pl-8">
					<Link className='text-white no-underline' to='/signup'>
						<Button buttonName="Sign Up" extraClasses={[`!w-full !py-4`]} />
					</Link>
				</div>
			</form>
		</div>
	)
}
