import { queryClient } from '@/app/RouteComponent';
import { getCollabApprover } from '@/react-query/mutations';
import { allProductsFetcher, collabsProductFetcher } from '@/react-query/query';
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

    const {
        data: allProducts,
        isSuccess: productIsSuccess,
        isPending: productsIsLoading,
    } = allProductsFetcher({ initialData: initialData?.allProducts });

    const {
        data: collabProducts,
        isSuccess: collabIsSuccess,
        isPending: collabProductsIsLoading,
    } = collabsProductFetcher({ initialData: initialData?.collabProducts });

    if (productsIsLoading || collabProductsIsLoading) return <Loader />;

    const params = Route.useSearch();
    const navigate = Route.useNavigate();

    const { mutate: collabProductSetter } = getCollabApprover();

    const productsCollection = () => {
        if (params.type == 'outgoing') {
            return allProducts;
        } else {
            return collabProducts;
        }
    };

    const collabApproved = () => {
        const result: Record<string, boolean> = {};
        const productsCollectionData: ProductTypePayload = productsCollection();

        Object.keys(productsCollectionData)
            .filter((key) => !(key in allProducts))
            .map((key, i) => {
                result[key] =
                    (productsCollectionData![key].collab_active &&
                        Object.keys(productsCollectionData![key].collabs!)
                            .length !== 0 &&
                        (collabProducts![key]?.collabs || []).filter(
                            (e) =>
                                e.email ===
                                (
                                    queryClient.getQueryData([
                                        'loginStatus',
                                    ]) as authSchema
                                )?.email
                        )[0]?.approved) ||
                    false;
            });
        return result;
    };

    return (
        collabIsSuccess &&
        productIsSuccess && (
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
                    {Object.keys(productsCollection()!).map((key, i) => {
                        return (
                            productsCollection()![key].collab_active &&
                            Object.keys(productsCollection()![key].collabs!)
                                .length !== 0 && (
                                <CollabCard
                                    key={key}
                                    productData={{
                                        ...productsCollection()![key],
                                    }}>
                                    <article className="w-full flex justify-end">
                                        {!(key in allProducts!) && (
                                            <Button
                                                buttonName={
                                                    collabApproved()[key]
                                                        ? 'Disapprove'
                                                        : 'Approve'
                                                }
                                                onClickHandler={async () => {
                                                    collabProductSetter(key);
                                                }}
                                            />
                                        )}
                                    </article>
                                </CollabCard>
                            )
                        );
                    })}
                </section>
            </Fragment>
        )
    );
};
