import { queryClient } from '@/app/RouteComponent';
import { getCheckoutFormProps } from '@/forms';
import {
    CheckoutFormSchemaType,
    getProfileStatusSetter,
} from '@/react-query/mutations';
import { getProfileStatus } from '@/react-query/query';
import Button from '@/ui/components/button';
import { FormInput } from '@/ui/components/forms';
import Loader from '@/ui/components/loader';
import FilterCheckoutModal from '@/ui/components/modal/FilterCheckoutModal';
import { ProfileHomePage } from '@/ui/pages/profile.$id/index.lazy';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoTrashBin } from 'react-icons/io5';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { Runner } from 'react-runner';

export const Route = createLazyFileRoute(
    '/_protected/_layout/checkout/_layout_checkout/form/'
)({
    component: () => {
        return <CheckoutForm />;
    },
});
const CheckoutForm = () => {
    const initialData = Route.useLoaderData();

    const {
        data: profileStatus,
        isPending: profileIsLoading,
        isSuccess: profileIsSuccess,
    } = getProfileStatus({
        userId: (queryClient.getQueryData(['loginStatus']) as authSchema)
            .user_id,
        preview: false,
        initialData,
    });

    const code = `
		<article className="w-[60vw] mb-[-10rem] min-h-screen relative origin-top-left bg-background pointer-events-none" style={{transform:'scale(0.8)'}}>
			<ProfileHomePage preview={true} name={name} bio={bio} category={category} userId={userId}/>
		</article>
	`;

    if (profileIsLoading) return <Loader />;

    const {
        handleSubmit,
        register,
        control,
        reset,
        watch,
        setValue,
        errors,
        resetField,
        isDirty,
    } = getCheckoutFormProps(profileStatus!);

    const { mutate: profileStatusSetter, isPending: profileStatusLoading } =
        getProfileStatusSetter({
            userId: (queryClient.getQueryData(['loginStatus']) as authSchema)
                .user_id!,
        });

    const [rendered, setRendered] = useState(false);

    const bio = watch('bio');
    const name = watch('name');
    const category = watch('category');
    const userId = (queryClient.getQueryData(['loginStatus']) as authSchema)
        .user_id;

    const scope = {
        ProfileHomePage,
        name,
        bio,
        category,
        userId,
    };

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'category',
    });

    return (
        profileIsSuccess && (
            <article className="w-full flex flex-col items-center sm:items-start xl:flex-row">
                <form
                    id="checkout_form"
                    className="grid gap-y-4 w-full lg:w-6/12 lg:h-[40rem] px-4 sm:pr-6 sm:pl-0 xl:px-5 overflow-y-auto bg-background scrollbar-thin scrollbar-thumb-white scrollbar-track-background"
                    onSubmit={handleSubmit((data) => {
                        if (isDirty) {
                            profileStatusSetter({ ...data });
                        }
                    })}>
                    <section className="grid gap-y-4">
                        <label className="grid gap-y-4">
                            <h2 className="text-xl">Name</h2>
                            <FormInput<CheckoutFormSchemaType>
                                name="name"
                                errors={errors}
                                register={register}
                                placeholder="Name"
                                type="text"
                            />
                        </label>
                        <label className="grid gap-y-4">
                            <h2 className="text-xl">Bio</h2>
                            <FormInput<CheckoutFormSchemaType>
                                name="bio"
                                errors={errors}
                                register={register}
                                placeholder="Bio"
                                type="text"
                            />
                        </label>
                    </section>
                    <label className="grid gap-y-4">
                        <h2 className="text-xl">Product category</h2>
                        <ul className="grid gap-y-4">
                            {fields.map((e, i) => {
                                return (
                                    <li key={e.id} className="grid gap-y-2">
                                        <section className="grid gap-y-4">
                                            <label className="flex items-center gap-x-4">
                                                {i + 1}
                                                <FormInput<CheckoutFormSchemaType>
                                                    type="text"
                                                    name={`category.${i}.name`}
                                                    errors={errors}
                                                    register={register}
                                                    placeholder="Category Name"
                                                />
                                            </label>
                                            <ul className="flex gap-x-4">
                                                <FilterCheckoutModal
                                                    watch={watch}
                                                    setValue={setValue}
                                                    i={i}
                                                    resetField={resetField}
                                                />
                                                <Button
                                                    buttonName=""
                                                    extraClasses={[`!w-full`]}
                                                    onClickHandler={() => {
                                                        setValue(
                                                            `category.${i}.hidden`,
                                                            !watch(
                                                                `category.${i}.hidden`
                                                            ),
                                                            {
                                                                shouldDirty:
                                                                    true,
                                                            }
                                                        );
                                                    }}>
                                                    {watch(
                                                        `category.${i}.hidden`
                                                    ) ? (
                                                        <span className="flex gap-x-2 items-center">
                                                            <FaEye />
                                                            Unhide
                                                        </span>
                                                    ) : (
                                                        <span className="flex gap-x-2 items-center">
                                                            <FaEyeSlash />
                                                            Hide
                                                        </span>
                                                    )}
                                                </Button>
                                                <Button
                                                    buttonName=""
                                                    extraClasses={[`!w-full`]}
                                                    onClickHandler={() => {
                                                        remove(i);
                                                    }}>
                                                    <RiDeleteBin2Fill className="text-red-400" />
                                                    <span>Delete</span>
                                                </Button>
                                            </ul>
                                        </section>
                                        {errors.category && (
                                            <section className="text-red-400 grid gap-y-1">
                                                {errors.category[i]?.name && (
                                                    <span>
                                                        Name:{' '}
                                                        {
                                                            errors.category[i]
                                                                ?.name?.message
                                                        }
                                                    </span>
                                                )}
                                                {errors.category[i]?.url && (
                                                    <span>
                                                        Filter:{' '}
                                                        {
                                                            errors.category[i]
                                                                ?.url?.message
                                                        }
                                                    </span>
                                                )}
                                            </section>
                                        )}
                                    </li>
                                );
                            })}
                            <footer className="gap-x-4 grid w-full">
                                <Button
                                    buttonName="Add new category"
                                    onClickHandler={() => {
                                        append({
                                            name: '',
                                            hidden: true,
                                            url: '',
                                        });
                                    }}
                                    extraClasses={['w-full py-4']}
                                />
                            </footer>
                        </ul>
                    </label>

                    <label className="grid gap-y-4">
                        <h2 className="text-xl">Footer</h2>
                        <ul className="grid gap-y-4">
                            <li className="flex gap-x-4 items-center">
                                1
                                <FormInput<CheckoutFormSchemaType>
                                    type="text"
                                    name={`bio`}
                                    errors={errors}
                                    register={register}
                                    placeholder="Item Title"
                                />
                                <FormInput<CheckoutFormSchemaType>
                                    type="text"
                                    name={`bio`}
                                    errors={errors}
                                    register={register}
                                    placeholder="Item Link"
                                />
                                <Button
                                    buttonName=""
                                    variant="destructive"
                                    extraClasses={[`!p-3 !text-xl`]}>
                                    <IoTrashBin />
                                </Button>
                            </li>
                        </ul>
                        <footer>
                            <Button
                                buttonName="Add Footer Item"
                                onClickHandler={() => {}}
                                extraClasses={['w-full py-4']}
                            />
                        </footer>
                    </label>
                    <footer className="flex gap-x-4 w-full justify-end">
                        <Button
                            buttonName="Revert"
                            onClickHandler={() => {
                                reset();
                            }}
                        />
                        <Button
                            buttonName="Save"
                            type="submit"
                            formID="checkout_form"
                            isLoading={profileIsLoading}
                        />
                    </footer>
                </form>
                <section
                    className={`w-6/12 h-[40rem] overflow-x-auto overflow-y-auto bg-background scrollbar-none  hidden border-x-[0px] xl:block border-white/30 p-2 px-0 border-l-[0.1px]`}>
                    <span className="m-3 mt-1 text-xl uppercase font-medium tracking-widest text-white/70">
                        Preview
                    </span>
                    <Runner scope={scope} code={code} />
                </section>
            </article>
        )
    );
};
