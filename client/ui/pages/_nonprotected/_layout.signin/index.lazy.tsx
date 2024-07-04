import { signInSchema } from '@/forms/schema/auth_schema';
import { setLoginStatus, signInSchemaType } from '@/react-query/mutations';
import Button from '@/ui/components/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createLazyFileRoute('/_nonprotected/_layout/signin/')({
    component: () => {
        return <SignInPage />;
    },
});

const SignInPage = () => {
    const [customError, setCustomError] = useState<string>('');

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<signInSchemaType>({ resolver: zodResolver(signInSchema) });

    const { mutate: loginStatusSetter, isPending: isLoginSetting } =
        setLoginStatus({ setCustomError });

    return (
        <div
            className="flex items-center justify-center text-xl"
            style={{
                height: 'calc(100vh - 8rem)',
            }}>
            <article className="flex gap-x-4 border-white/30 border-[0.1px] flex-col lg:flex-row rounded-md p-6 w-10/12 sm:w-8/12 md:w-6/12 lg:w-8/12 xl:w-6/12 2xl:w-5/12 divide-y-[0.1px] lg:divide-y-0 lg:divide-x-[0.1px] divide-white/30">
                <form
                    className="grid gap-y-6 p-4 w-full"
                    id="sign_in_form"
                    onSubmit={handleSubmit((data) => {
                        loginStatusSetter({ ...data });
                    })}>
                    <header>
                        <h1 className="text-3xl text-center">Sign In</h1>
                    </header>
                    <main>
                        <section className="grid gap-y-6">
                            <label className="grid gap-y-2">
                                Email
                                <fieldset className="border-white/30 border-[0.1px] rounded-md overflow-none">
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
                            <label className="grid gap-y-2">
                                Password
                                <fieldset className="border-white/30 border-[0.1px] rounded-md overflow-none">
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
                        </section>
                    </main>
                    <footer className="grid gap-y-4">
                        <label className="text-base flex w-full justify-between">
                            Remember Me
                            <input
                                type="checkbox"
                                className="cursor-pointer border-white/30 border-[0.1px] hue-rotate-60"
                                {...register('remember')}
                            />
                        </label>
                        {customError !== '' && (
                            <p className="text-red-400 text-base">
                                {customError}
                            </p>
                        )}
                        <Button
                            buttonName="Sign In"
                            type="submit"
                            formID="sign_in_form"
                            extraClasses={[`!w-full !py-4`]}
                            isLoading={isLoginSetting}
                        />
                    </footer>
                </form>
                <section className="p-4 w-full flex flex-col justify-center gap-y-6 lg:pl-8">
                    <Link className="text-white no-underline" to="/signup">
                        <Button
                            buttonName="Sign Up"
                            extraClasses={[`!w-full !py-4`]}
                        />
                    </Link>
                </section>
            </article>
        </div>
    );
};
