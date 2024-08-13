import { queryClient } from '@/app/RouteComponent';
import { getCollabApprover } from '@/react-query/mutations';
import { collabsProductFetcher } from '@/react-query/query';
import Button from '@/ui/components/button';
import CollabCard from '@/ui/components/cards/CollabCard';
import Loader from '@/ui/components/loader';
import { css, cx } from '@emotion/css';
import { Link, createLazyFileRoute } from '@tanstack/react-router';

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

    const currentUserMail: string = (
        queryClient.getQueryData(['loginStatus']) as authSchema
    ).email!;

    return (
        collabIsSuccess && (
            <div className="space-y-6">
                <section className="bg-white/5 rounded-lg p-4">
                    <div className="flex gap-x-4">
                        <TabLink type="outgoing" currentType={params.type} />
                        <TabLink type="incoming" currentType={params.type} />
                    </div>
                </section>

                <section
                    className={cx(
                        'mt-2 grid gap-6 px-4 mb-10 sm:px-8 sm:pr-6 sm:pl-4 md:pl-0',
                        css`
                                      /* prettier-ignore */
                                      ${`
                                      grid-template-columns: repeat(1, 1fr);
                                      @media (min-width: 768px) {
                                          grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
                                      }
                                    `}
                                `
                    )}>
                    {collabProducts.map((value) => (
                        <CollabCard key={value.product_id} productData={value}>
                            {params.type === 'incoming' && (
                                <ApprovalButton
                                    value={value}
                                    currentUserMail={currentUserMail}
                                />
                            )}
                        </CollabCard>
                    ))}
                </section>
            </div>
        )
    );
};

const TabLink = ({ type, currentType }: any) => (
    <Link
        to="/products/collaborators"
        search={() => ({ type })}
        className={`px-4 py-2 rounded-lg   no-underline ${
            type === currentType
                ? 'bg-indigo-600 text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
        }`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
    </Link>
);

interface ApprovalButton {
    value: ProductType;
    currentUserMail: string;
}

const ApprovalButton = ({ value, currentUserMail }: ApprovalButton) => {
    const { mutate: collabProductSetter } = getCollabApprover();

    const isApproved =
        (
            value.collabs?.filter(
                (e: any) => e.email === currentUserMail && e.approved === true
            ) || []
        ).length > 0;

    return (
        <div className="mt-4">
            <Button
                buttonName={isApproved ? 'Disapprove' : 'Approve'}
                extraClasses={[
                    `w-full ${
                        isApproved
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                    } text-white`,
                ]}
                onClickHandler={() => collabProductSetter(value.product_id!)}
            />
        </div>
    );
};
