import { queryClient } from '@/app/RouteComponent';
import { CheckoutFormSchemaType } from '@/react-query/mutations';
import {
  getProfileProductsFetcherProps,
  getProfileStatusProps,
} from '@/react-query/query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/profile/$id/')({
  loader: async ({ params }) => {
    const productDataQuery = getProfileProductsFetcherProps({
      userId: params.id,
    });
    const productData = await queryClient.ensureQueryData(productDataQuery);

    const profileDataQuery = getProfileStatusProps({ userId: params.id });
    const profileData = await queryClient.ensureQueryData(profileDataQuery);

    return {
      productData,
      profileData,
    } as {
      productData: ProductTypePayload;
      profileData: CheckoutFormSchemaType;
    };
  },
});
