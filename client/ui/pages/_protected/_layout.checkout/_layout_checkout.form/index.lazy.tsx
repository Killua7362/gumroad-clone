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
import { IonItem, IonReorder, IonReorderGroup } from '@ionic/react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { createContext, useContext } from 'react';
import { useFieldArray, UseFieldArrayReturn } from 'react-hook-form';
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

type CheckoutFormContextType = ReactFormProps<CheckoutFormSchemaType> &
    UseFieldArrayReturn<CheckoutFormSchemaType>;

const localCheckoutContext = createContext<CheckoutFormContextType | null>(
    null
);

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

    const props = getCheckoutFormProps(profileStatus!);
    const { handleSubmit, control, reset, watch, isDirty } = props;

    const { mutate: profileStatusSetter, isPending: profileStatusLoading } =
        getProfileStatusSetter({
            userId: (queryClient.getQueryData(['loginStatus']) as authSchema)
                .user_id!,
        });

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

    return (
        profileIsSuccess && (
            <article className="w-full flex flex-col items-center sm:items-start xl:flex-row">
                <localCheckoutContext.Provider
                    value={{
                        ...props,
                        ...useFieldArray({
                            control,
                            name: 'category',
                        }),
                    }}>
                    <form
                        id="checkout_form"
                        className="grid gap-y-4 w-full xl:w-6/12 xl:h-[44rem] px-4 sm:pr-6 sm:pl-0 xl:px-5 overflow-y-auto bg-background scrollbar-thin scrollbar-thumb-white scrollbar-track-background"
                        onSubmit={handleSubmit((data) => {
                            if (isDirty) {
                                profileStatusSetter({ ...data });
                            }
                        })}>
                        <MainSection />
                        <ProductCategorySection />
                        <FooterSection />
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
                </localCheckoutContext.Provider>
                <section
                    className={`w-6/12 h-[44rem] overflow-x-auto overflow-y-auto bg-background scrollbar-none  hidden border-x-[0px] xl:block border-white/30 p-2 px-0 border-l-[0.1px]`}>
                    <span className="m-3 mt-1 text-xl uppercase font-medium tracking-widest text-white/70">
                        Preview
                    </span>
                    <Runner scope={scope} code={code} />
                </section>
            </article>
        )
    );
};

const MainSection = () => {
    const { errors, register } = useContext(localCheckoutContext)!;
    return (
        <div className="space-y-6 bg-white/5 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">Main</h2>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white">Name</h2>
                <FormInput<CheckoutFormSchemaType>
                    name="name"
                    errors={errors}
                    register={register}
                    placeholder="Name"
                    type="text"
                    className="w-full bg-background"
                />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white">Bio</h2>
                <FormInput<CheckoutFormSchemaType>
                    name="bio"
                    errors={errors}
                    register={register}
                    placeholder="Bio"
                    type="text"
                    className="w-full bg-background"
                />
            </div>
        </div>
    );
};

const ProductCategorySection = () => {
    const {
        fields,
        errors,
        register,
        setValue,
        watch,
        resetField,
        remove,
        append,
    } = useContext(localCheckoutContext)!;

    const categories = watch('category') || [];

    return (
        <div className="space-y-6 bg-white/5 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">
                Product Category
            </h2>

            <IonReorderGroup
                disabled={false}
                onIonItemReorder={(event) => {
                    setValue('category', event.detail.complete(categories), {
                        shouldDirty: true,
                    });
                }}
                className="grid gap-y-4">
                {fields.map((e, i) => {
                    return (
                        <IonItem key={e.id} className="grid gap-y-2 p-4">
                            <section className="grid gap-y-4">
                                <label className="flex items-center gap-x-4">
                                    <IonReorder className="mt-[0.35rem] mr-[0.3rem]" />
                                    {i + 1}
                                    <FormInput<CheckoutFormSchemaType>
                                        type="text"
                                        name={`category.${i}.name`}
                                        errors={errors}
                                        register={register}
                                        placeholder="Category Name"
                                        className="w-full bg-background"
                                    />
                                </label>
                                <section className="flex gap-x-4 justify-between">
                                    <FilterCheckoutModal
                                        watch={watch}
                                        setValue={setValue}
                                        i={i}
                                        resetField={resetField}
                                    />
                                    <Button
                                        buttonName=""
                                        extraClasses={[`!grow`]}
                                        onClickHandler={() => {
                                            setValue(
                                                `category.${i}.hidden`,
                                                !watch(`category.${i}.hidden`),
                                                {
                                                    shouldDirty: true,
                                                }
                                            );
                                        }}>
                                        {watch(`category.${i}.hidden`) ? (
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
                                        extraClasses={[`!grow`]}
                                        onClickHandler={() => {
                                            remove(i);
                                        }}>
                                        <RiDeleteBin2Fill className="text-red-400" />
                                        <span>Delete</span>
                                    </Button>
                                </section>
                            </section>
                            {errors.category && (
                                <section className="text-red-400 grid gap-y-1">
                                    {errors.category[i]?.name && (
                                        <span>
                                            Name:{' '}
                                            {errors.category[i]?.name?.message}
                                        </span>
                                    )}
                                    {errors.category[i]?.url && (
                                        <span>
                                            Filter:{' '}
                                            {errors.category[i]?.url?.message}
                                        </span>
                                    )}
                                </section>
                            )}
                        </IonItem>
                    );
                })}
            </IonReorderGroup>
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
        </div>
    );
};

const FooterSection = () => {
    const { errors, register } = useContext(localCheckoutContext)!;
    return (
        <div className="space-y-6 bg-white/5 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">Footer</h2>
            <ul className="grid gap-y-4">
                <li className="flex gap-x-4 items-center">
                    1
                    {
                        // <FormInput<CheckoutFormSchemaType>
                        //     type="text"
                        //     name={`bio`}
                        //     errors={errors}
                        //     register={register}
                        //     placeholder="Item Title"
                        //     className="w-full bg-background"
                        // />
                        // <FormInput<CheckoutFormSchemaType>
                        //     type="text"
                        //     name={`bio`}
                        //     errors={errors}
                        //     register={register}
                        //     placeholder="Item Link"
                        //     className="w-full bg-background"
                        // />
                    }
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
        </div>
    );
};
