import { queryClient } from '@/app/RouteComponent';
import { CheckoutFormSchemaType } from '@/react-query/mutations';
import { getProfileStatusProps } from '@/react-query/query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
    '/_protected/_layout/checkout/_layout_checkout/form/'
)({
    loader: async (): Promise<CheckoutFormSchemaType> => {
        const profileDataQuery = getProfileStatusProps({
            userId: (queryClient.getQueryData(['loginStatus']) as authSchema)
                .user_id,
        });
        const profileData: CheckoutFormSchemaType =
            await queryClient.ensureQueryData(profileDataQuery);
        return profileData;
    },
});
