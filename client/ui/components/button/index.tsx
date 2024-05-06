import { cx, css } from '@emotion/css'

type ButtonTypes = "button" | "submit" | "reset" | undefined

interface ButtonSchema {
	buttonName: string;
	extraClasses?: string[];
	type?: ButtonTypes;
	onClickHandler?: () => void;
}

const Button = ({ buttonName, extraClasses = [""], type = 'button', onClickHandler }: ButtonSchema) => {

	return (
		<button
			onClick={onClickHandler}
			type={type}
			className={cx(`save-button px-4 py-2 border-white/30 rounded-md border-[0.1px] cursor-pointer bg-background text-white text-lg w-fit`, css`
				transition:all 0.1s ease-out;
				&:hover{
					transform:translate(-1.5px,-2px);
					box-shadow: 3px 3px 0px -1px;
				}

			`, ...extraClasses)}
		>
			{buttonName}
		</button>
	)
}

export default Button
