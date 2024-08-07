import { queryClient } from '@/app/RouteComponent';
import { CheckoutFormSchemaType } from '@/react-query/mutations';
import {
    getProfileProductsFetcherProps,
    getProfileStatusProps,
} from '@/react-query/query';
import { createFileRoute } from '@tanstack/react-router';

interface ProfilePage {
    productData: ProductType[];
    profileData: CheckoutFormSchemaType;
}

export const Route = createFileRoute('/profile/$id/')({
    loader: async ({ params }): Promise<ProfilePage> => {
        const productDataQuery = getProfileProductsFetcherProps({
            userId: params.id,
        });
        const productData = await queryClient.ensureQueryData(productDataQuery);

        const profileDataQuery = getProfileStatusProps({ userId: params.id });
        const profileData = await queryClient.ensureQueryData(profileDataQuery);

        return {
            productData,
            profileData,
        };
    },
});
