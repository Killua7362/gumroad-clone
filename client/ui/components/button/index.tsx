import { useState } from 'react';
import { cx, css } from '@emotion/css'
import Loader from '../loader';
import { motion } from 'framer-motion'

type ButtonTypes = "button" | "submit" | "reset" | undefined

interface ButtonSchema {
	buttonName: string;
	extraClasses?: string[];
	type?: ButtonTypes;
	onClickHandler?: () => void;
	children?: React.ReactNode;
	isActive?: boolean;
	isLoading?: boolean;
	form?: string;
	variant?: 'normal' | 'destructive'
}

const Button = ({ buttonName, extraClasses = [""], type = 'button', onClickHandler, children, isActive = false, isLoading = false, form = '', variant = 'normal' }: ButtonSchema) => {

	const variants = {
		'normal': 'border-white/30 text-white',
		'destructive': 'border-red-500 text-red-500'
	}

	return (
		<motion.button
			form={form}
			onClick={async () => {
				if (onClickHandler) {
					await onClickHandler()
				}
			}}
			type={type}
			whileHover={{
				...(!isActive) && {
					transform: 'translate(-4px,-4px)',
					boxShadow: '4px 4px 0px -1px',
				},
				transition: {
					type: 'ease-out',
					duration: 0.1
				}
			}}
			whileTap={{
				transform: 'translate(2px,2px)',
				boxShadow: '0px 0px 0px 0px',
				transition: {
					type: 'ease-in',
					duration: 0.1
				}
			}}
			className={cx(`save-button px-4 py-2 flex justify-center gap-x-3 items-center ${isActive && '!border-white !cursor-normal'} cursor-pointer rounded-md border-[0.1px] bg-background text-lg w-fit`,
				variants[variant], ...extraClasses)}
		>
			{
				isLoading &&
				<Loader />
			}
			{
				buttonName !== "" &&
				<span className={`${isLoading && 'invisible'} `}>
					{buttonName}
				</span>
			}
			{children}
		</motion.button>
	)
}

export default Button
