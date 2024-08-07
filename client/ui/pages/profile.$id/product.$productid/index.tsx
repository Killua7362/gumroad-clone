import { queryClient } from '@/app/RouteComponent';
import { getSingleProfileProductFetcherProps } from '@/react-query/query';
import { createFileRoute } from '@tanstack/react-router';

interface SingleProfilePage {
    singleProductData: ProductType;
}

export const Route = createFileRoute('/profile/$id/product/$productid/')({
    loader: async ({ params }): Promise<SingleProfilePage> => {
        const singleProfileProductDataQuery =
            getSingleProfileProductFetcherProps({
                userId: params.id,
                productId: params.productid,
            });

        const singleProductData = await queryClient.ensureQueryData(
            singleProfileProductDataQuery
        );

        return {
            singleProductData,
        };
    },
});
