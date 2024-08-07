import { signUpSchema } from '@/forms/schema/auth_schema';
import { setSignUp, signUpSchemaType } from '@/react-query/mutations';
import Button from '@/ui/components/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createLazyFileRoute('/_nonprotected/_layout/signup/')({
    component: () => {
        return <SignUpPage />;
    },
});

const SignUpPage = () => {
    const [customError, setCustomError] = useState('');

    const { mutate: signUpSetter, isPending: isSignUpSetting } = setSignUp({
        setCustomError: setCustomError,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<signUpSchemaType>({ resolver: zodResolver(signUpSchema) });

    return (
        <div
            className="flex items-center justify-center text-xl"
            style={{
                height: 'calc(100vh - 8rem)',
            }}>
            <article className="flex gap-x-4 border-white/30 border-[0.1px] flex-col lg:flex-row rounded-md p-6 w-11/12 sm:w-9/12 md:w-7/12 lg:w-9/12 xl:w-7/12 2xl:w-6/12 divide-y-[0.1px] lg:divide-y-0 lg:divide-x-[0.1px] divide-white/30">
                <form
                    id="sign_up_form"
                    className="grid gap-y-4 p-4 w-full"
                    onSubmit={handleSubmit((data) => {
                        signUpSetter({ ...data });
                    })}>
                    <header>
                        <h1 className="text-3xl text-center">Sign Up</h1>
                    </header>
                    <main>
                        <section className="grid gap-y-4">
                            <label className="grid gap-y-3">
                                Name
                                <fieldset
                                    className={`${errors.name ? 'border-red-400' : 'border-white/30 focus-within:border-white'} border-[0.1px] rounded-md overflow-none`}>
                                    <input
                                        className="bg-background outline-none text-white text-lg"
                                        {...register('name')}
                                    />
                                    {errors.name && (
                                        <legend className="text-sm">
                                            {errors.name.message}
                                        </legend>
                                    )}
                                </fieldset>
                            </label>
                            <label className="grid gap-y-3">
                                Email
                                <fieldset
                                    className={`${errors.email ? 'border-red-400' : 'border-white/30 focus-within:border-white'} border-[0.1px] rounded-md overflow-none`}>
                                    <input
                                        className="bg-background outline-none text-white text-lg"
                                        {...register('email')}
                                    />
                                    {errors.email && (
                                        <legend className="text-sm">
                                            {errors.email.message}
                                        </legend>
                                    )}
                                </fieldset>
                            </label>
                            <label className="grid gap-y-3">
                                Password
                                <fieldset
                                    className={`${errors.password ? 'border-red-400' : 'border-white/30 focus-within:border-white'} border-[0.1px] rounded-md overflow-none`}>
                                    <input
                                        className="bg-background outline-none text-white text-lg"
                                        {...register('password')}
                                        type="password"
                                    />
                                    {errors.password && (
                                        <legend className="text-sm">
                                            {errors.password.message}
                                        </legend>
                                    )}
                                </fieldset>
                            </label>
                            <label className="grid gap-y-3">
                                Confirm Password
                                <fieldset
                                    className={`${errors.password_confirmation ? 'border-red-400' : 'border-white/30 focus-within:border-white'} border-[0.1px] rounded-md overflow-none`}>
                                    <input
                                        className="bg-background outline-none text-white text-lg"
                                        type="password"
                                        {...register('password_confirmation')}
                                    />
                                    {errors.password_confirmation && (
                                        <legend className="text-sm">
                                            {
                                                errors.password_confirmation
                                                    .message
                                            }
                                        </legend>
                                    )}
                                </fieldset>
                            </label>
                        </section>
                    </main>
                    <footer className="grid gap-y-2">
                        {customError !== '' && (
                            <p className="text-red-400 text-base">
                                {customError}
                            </p>
                        )}
                        <Button
                            buttonName="Sign Up"
                            type="submit"
                            formID="sign_up_form"
                            extraClasses={[`!w-full !py-4`]}
                            isLoading={isSignUpSetting}
                        />
                    </footer>
                </form>
                <div className="p-4 w-full flex flex-col justify-center gap-y-6 lg:pl-8">
                    <Link to="/signin" className="no-underline text-white">
                        <Button
                            buttonName="Sign In"
                            extraClasses={[`!w-full !py-4`]}
                        />
                    </Link>
                </div>
            </article>
        </div>
    );
};
