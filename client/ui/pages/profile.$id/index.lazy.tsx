import { CheckoutFormSchemaType } from '@/react-query/mutations';
import {
    getProfileProductsFetcher,
    getProfileStatus,
} from '@/react-query/query';
import ProfilePageProductCategory from '@/ui/components/cards/ProfilePageProductCategory';
import Loader from '@/ui/components/loader';
import ProfilePageLayout from '@/ui/layouts/ProfilePageLayout';
import {
    createLazyFileRoute,
    useLoaderData,
    useParams,
} from '@tanstack/react-router';

export const Route = createLazyFileRoute('/profile/$id/')({
    component: () => {
        return <ProfileHomePage />;
    },
});

interface ProfilePageProps extends Partial<CheckoutFormSchemaType> {
    preview?: boolean;
    userId?: string;
}

export const ProfileHomePage = ({
    preview = false,
    userId,
    ...profilePageProps
}: ProfilePageProps) => {
    const params = preview ? undefined : useParams({ from: '/profile/$id/' });

    const initialData = preview
        ? undefined
        : useLoaderData({ from: '/profile/$id/' });

    document.title = 'Profile';

    const {
        data: profileProducts,
        isPending: productsIsLoading,
        isSuccess: productIsSuccess,
    } = getProfileProductsFetcher({
        userId: preview ? userId : params?.id,
        initialData: initialData?.productData,
    });

    const {
        data: profileStatus,
        isPending: profileIsLoading,
        isSuccess: profileIsSuccess,
    } = getProfileStatus({
        userId: params?.id,
        preview: preview,
        initialData: initialData?.profileData,
    });

    if ((preview ? false : profileIsLoading) || productsIsLoading)
        return <Loader />;
    if ((preview ? true : profileIsSuccess) && productIsSuccess) {
        return (
            <ProfilePageLayout
                preview={preview}
                name={preview ? profilePageProps.name! : profileStatus.name}>
                <article
                    className={`w-full gap-y-6 h-full scrollbar-thin scrollbar-thumb-white scrollbar-track-background `}>
                    <section className="bg-white/5 rounded-lg py-6 text-xl flex justify-center m-6 border-white/10 border-[0.1px]">
                        <div className="flex gap-x-4 w-10/12 text-justify">
                            {preview
                                ? profilePageProps.bio!
                                : profileStatus.bio}
                        </div>
                    </section>
                    <section className="w-9/12 mx-auto h-full grid mt-8 gap-y-3">
                        {preview &&
                            profilePageProps.category &&
                            profilePageProps.category.map((e, i) => {
                                return (
                                    !e.hidden && (
                                        <ProfilePageProductCategory
                                            key={`profile_page_product_${i}`}
                                            name={e.name}
                                            url={e.url}
                                            preview={preview}
                                            profileProducts={profileProducts}
                                        />
                                    )
                                );
                            })}
                        {!preview &&
                            profileStatus.category &&
                            profileStatus.category.map((e, i) => {
                                return (
                                    !e.hidden && (
                                        <ProfilePageProductCategory
                                            key={`profile_page_product_${i}`}
                                            name={e.name}
                                            url={e.url}
                                            preview={preview}
                                            profileProducts={profileProducts}
                                        />
                                    )
                                );
                            })}
                    </section>
                </article>
            </ProfilePageLayout>
        );
    }
};
