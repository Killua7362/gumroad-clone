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

interface returnProductPageCollaborators {
    allProducts: ProductTypePayload;
    collabProducts: ProductTypePayload;
}

export const Route = createFileRoute(
    '/_protected/_layout/products/_layout_products/collaborators/'
)({
    loaderDeps: ({ search: { type } }) => ({ type }),
    loader: async ({
        deps: { type },
    }): Promise<returnProductPageCollaborators> => {
        const allProducts = await queryClient.ensureQueryData(
            allProductsFetcherProps
        );

        const collabProducts = await queryClient.ensureQueryData(
            collabsProductFetcherProps
        );

        return {
            allProducts,
            collabProducts,
        };
    },
    validateSearch: productPageCollaboratorsSchema,
});
