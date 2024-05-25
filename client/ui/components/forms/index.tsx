import { FieldErrors, FieldPath, FieldValues, UseFormRegister } from "react-hook-form"

export const FormInput = <T extends FieldValues>({ name, errors, register, placeholder, type }: { name: FieldPath<T>, errors: FieldErrors<FieldValues>, register: UseFormRegister<T>, placeholder: string, type: string }) => {
	return (
		<fieldset className={`${errors[name] ? "border-red-400" : "border-white/30 focus-within:border-white"} border-[0.1px] w-full rounded-md p-2`}>
			<input type={type} className="bg-background text-white outline-none text-lg w-full mx-2 my-1" placeholder={`Type your ${placeholder} here...`} {...register(name)} />
			{errors[name] && <legend className="text-xs text-red-400"> {`${errors[name]!.message}`}</legend>}
		</fieldset>
	)
}
