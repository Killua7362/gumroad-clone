import { useState } from 'react';
import './index.css'
import { cx, css } from '@emotion/css'

type ButtonTypes = "button" | "submit" | "reset" | undefined

interface ButtonSchema {
	buttonName: string;
	extraClasses?: string[];
	type?: ButtonTypes;
	onClickHandler?: () => void;
	children?: React.ReactNode;
	isActive?: boolean;
	isLoading?: boolean;
}

const Button = ({ buttonName, extraClasses = [""], type = 'button', onClickHandler, children, isActive = false, isLoading = false }: ButtonSchema) => {
	return (
		<button
			onClick={async () => {
				if (onClickHandler) {
					await onClickHandler()
				}
			}}
			type={type}
			className={cx(`save-button px-4 py-2 flex justify-center gap-x-3 items-center ${isActive ? 'border-white' : 'border-white/30 cursor-pointer'} rounded-md border-[0.1px] bg-background text-white text-lg w-fit`, css`
				transition:all 0.1s ease-out;
				${!isActive && `
					&:hover{
						transform:translate(-1.5px,-2px);
						box-shadow: 3px 3px 0px -1px;
					}
				`
				}

			`, ...extraClasses)}
		>
			<span className={`loader absolute ${!isLoading && 'invisible'}`} />
			{
				buttonName !== "" &&
				<span className={`${isLoading && 'invisible'}`}>
					{buttonName}
				</span>
			}
			{children}
		</button>
	)
}

export default Button
