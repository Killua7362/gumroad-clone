import { queryClient } from '@/app/RouteComponent';
import { getCollabApprover } from '@/react-query/mutations';
import { collabsProductFetcher } from '@/react-query/query';
import Button from '@/ui/components/button';
import CollabCard from '@/ui/components/cards/CollabCard';
import Loader from '@/ui/components/loader';
import { Link, createLazyFileRoute } from '@tanstack/react-router';
import { Fragment } from 'react/jsx-runtime';

export const Route = createLazyFileRoute(
    '/_protected/_layout/products/_layout_products/collaborators/'
)({
    component: () => {
        return <CollaboratorsPage />;
    },
});

const CollaboratorsPage = () => {
    const initialData = Route.useLoaderData();
    const params = Route.useSearch();

    const {
        data: collabProducts,
        isSuccess: collabIsSuccess,
        isPending: collabProductsIsLoading,
    } = collabsProductFetcher({
        initialData: initialData?.collabProducts,
        type: params.type,
    });

    if (collabProductsIsLoading) return <Loader />;

    const navigate = Route.useNavigate();

    const { mutate: collabProductSetter } = getCollabApprover();

    const currentUserMail: string = (
        queryClient.getQueryData(['loginStatus']) as authSchema
    ).email!;
    return (
        collabIsSuccess && (
            <Fragment>
                <section className="flex gap-x-3">
                    <Link
                        to="/products/collaborators"
                        search={() => ({
                            type: 'outgoing',
                        })}
                        style={{
                            textDecoration: 'none',
                        }}
                        activeProps={{
                            className: 'cursor-default pointer-events-none',
                        }}>
                        <Button
                            buttonName="Outgoing"
                            extraClasses={['rounded-xl']}
                            isActive={params.type === 'outgoing'}
                        />
                    </Link>
                    <Link
                        to="/products/collaborators"
                        search={() => ({
                            type: 'incoming',
                        })}
                        style={{
                            textDecoration: 'none',
                        }}
                        activeProps={{
                            className: 'cursor-default pointer-events-none',
                        }}>
                        <Button
                            buttonName="Incoming"
                            extraClasses={['rounded-xl']}
                            isActive={params.type === 'incoming'}
                        />
                    </Link>
                </section>
                <section className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-6 px-8 sm:pr-6 sm:pl-0">
                    {collabProducts.map((value, i) => {
                        return (
                            <CollabCard
                                key={value.product_id}
                                productData={{
                                    ...value,
                                }}>
                                {params.type === 'incoming' && (
                                    <article className="w-full flex justify-end">
                                        <Button
                                            buttonName={
                                                (
                                                    value.collabs?.filter(
                                                        (e) =>
                                                            e.email ===
                                                                currentUserMail &&
                                                            e.approved === true
                                                    ) || []
                                                ).length > 0
                                                    ? 'Disapprove'
                                                    : 'Approve'
                                            }
                                            onClickHandler={async () => {
                                                collabProductSetter(
                                                    value.product_id!
                                                );
                                            }}
                                        />
                                    </article>
                                )}
                            </CollabCard>
                        );
                    })}
                </section>
            </Fragment>
        )
    );
};
