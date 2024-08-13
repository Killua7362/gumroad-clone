import { cx } from '@emotion/css';
import {
    FieldErrors,
    FieldPath,
    FieldValues,
    UseFormRegister,
} from 'react-hook-form';

interface FormInput<T extends FieldValues> {
    children?: React.ReactNode;
    name: FieldPath<T>;
    errors: FieldErrors<FieldValues>;
    register: UseFormRegister<T>;
    placeholder: string;
    type: string;
    className?: string;
}

export const FormInput = <T extends FieldValues>({
    children,
    name,
    errors,
    register,
    placeholder,
    type,
    className = '',
}: FormInput<T>) => {
    return (
        <fieldset
            className={cx(
                `${errors[name] ? 'border-red-400' : 'border-white/30 focus-within:border-blue-500 focus-within:ring-blue-500'} transition-colors duration-200 border-[0.1px] w-full rounded-md p-2 ${children && 'flex flex-row-reverse'}`,
                className
            )}>
            <input
                type={type}
                className="outline-none bg-inherit text-white w-full text-lg"
                placeholder={`Type your ${placeholder} here...`}
                {...register(name)}
            />
            {children}
            {errors[name] && (
                <legend className="text-xs text-red-400">
                    {' '}
                    {`${errors[name]!.message}`}
                </legend>
            )}
        </fieldset>
    );
};
