import { queryClient } from '@/app/RouteComponent';
import {
  allProductsFetcherProps,
  collabsProductFetcherProps,
} from '@/react-query/query';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const productPageCollaboratorsSchema = z.object({
  type: z
    .enum(['incoming', 'outgoing'] as const)
    .catch('incoming')
    .optional(),
});

export type productPageCollaboratorsSchemaType = z.infer<
  typeof productPageCollaboratorsSchema
>;

export const Route = createFileRoute(
  '/_protected/_layout/products/_layout_products/collaborators/'
)({
  loader: async () => {
    const allProducts = await queryClient.ensureQueryData(
      allProductsFetcherProps
    );
    const collabProducts = await queryClient.ensureQueryData(
      collabsProductFetcherProps
    );
    return {
      allProducts,
      collabProducts,
    } as {
      allProducts: ProductTypePayload;
      collabProducts: ProductTypePayload;
    };
  },
  validateSearch: productPageCollaboratorsSchema,
});
